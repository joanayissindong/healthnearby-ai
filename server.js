require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID  = process.env.NOTION_DATABASE_ID;
// Format as UUID with dashes (required by MCP)
const DATABASE_UUID = DATABASE_ID.replace(
  /^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'
);

// ─── Real MCP Client via local Notion MCP server (stdio) ──────────────────────
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

let mcpClient = null;
let mcpTools  = [];

async function initMCP() {
  try {
    console.log('🔌 Starting local Notion MCP server...');
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@notionhq/notion-mcp-server'],
      env: {
        ...process.env,
        OPENAPI_MCP_HEADERS: JSON.stringify({
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28'
        })
      }
    });
    mcpClient = new Client({ name: 'healthnearby-ai', version: '1.0.0' }, { capabilities: {} });
    await mcpClient.connect(transport);
    const { tools } = await mcpClient.listTools();
    mcpTools = tools.map(t => t.name);
    console.log(`✅ Notion MCP connected — ${mcpTools.length} tools available`);
    console.log(`   Tools: ${mcpTools.slice(0,5).join(', ')}...`);
  } catch (err) {
    console.error('❌ MCP connection failed:', err.message);
    console.log('⚠️  Falling back to direct Notion API');
    mcpClient = null;
  }
}

// ─── MCP tool call ─────────────────────────────────────────────────────────────
async function callMCPTool(toolName, params) {
  if (!mcpClient) throw new Error('MCP client not connected');
  const result = await mcpClient.callTool({ name: toolName, arguments: params });
  const text = result.content?.[0]?.text;
  if (!text) return result;
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

// ─── Fallback: direct Notion API ───────────────────────────────────────────────
const NOTION_HEADERS = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28'
};

async function notionQuery(filter = {}, sorts = []) {
  const body = { page_size: 100 };
  if (Object.keys(filter).length) body.filter = filter;
  if (sorts.length) body.sorts = sorts;
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: 'POST', headers: NOTION_HEADERS, body: JSON.stringify(body)
  });
  return res.json();
}

async function notionUpdate(pageId, properties) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH', headers: NOTION_HEADERS, body: JSON.stringify({ properties })
  });
  return res.json();
}

async function notionCreate(properties) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST', headers: NOTION_HEADERS,
    body: JSON.stringify({ parent: { database_id: DATABASE_ID }, properties })
  });
  return res.json();
}

// ─── Smart router: MCP first, fallback to direct API ──────────────────────────
async function queryDatabase(filter = {}, sorts = []) {
  if (mcpClient) {
    const params = { data_source_id: DATABASE_UUID };
    if (Object.keys(filter).length) params.filter = filter;
    if (sorts.length) params.sorts = sorts;
    try {
      const result = await callMCPTool('API-query-data-source', params);
      // If MCP returns results array directly or wrapped
      if (result && result.results) return result;
      if (Array.isArray(result)) return { results: result };
      return notionQuery(filter, sorts); // fallback if unexpected format
    } catch(e) {
      console.log('MCP query failed, using direct API:', e.message);
      return notionQuery(filter, sorts);
    }
  }
  return notionQuery(filter, sorts);
}

async function updatePage(pageId, properties) {
  // Always use direct API for updates — more reliable than MCP patch
  return notionUpdate(pageId, properties);
}

async function createPage(properties) {
  // Always use direct API for creates — MCP create has schema differences
  return notionCreate(properties);
}

// ─── Real-time open/closed from hours (Cameroon UTC+1) ────────────────────────
function isOpenNow(weekdays, saturday, sunday, is_on_duty) {
  if (is_on_duty) return true;
  const now = new Date();
  const localHour = (now.getUTCHours() + 1) % 24;
  const localTime = localHour * 60 + now.getUTCMinutes();
  const day = now.getUTCDay();
  let range = day === 0 ? sunday : day === 6 ? saturday : weekdays;
  if (!range || range === 'Closed') return false;
  if (range === '00:00-23:59') return true;
  try {
    const [o, c] = range.split('-');
    const [oh, om] = o.trim().split(':').map(Number);
    const [ch, cm] = c.trim().split(':').map(Number);
    return localTime >= oh * 60 + om && localTime < ch * 60 + cm;
  } catch { return false; }
}

function parsePage(page) {
  const p = page.properties;
  const t = (k, type) => {
    try {
      if (type === 'title')  return p[k]?.title?.[0]?.text?.content || '';
      if (type === 'select') return p[k]?.select?.name || '';
      if (type === 'text')   return p[k]?.rich_text?.[0]?.text?.content || '';
      if (type === 'check')  return p[k]?.checkbox || false;
      if (type === 'phone')  return p[k]?.phone_number || '';
      if (type === 'num')    return p[k]?.number || 0;
    } catch { return null; }
  };
  const weekdays = t('Weekdays_Hours', 'text');
  const saturday = t('Saturday_Hours', 'text');
  const sunday   = t('Sunday_Hours',   'text');
  const is_on_duty = t('Is_On_Duty', 'check');
  return {
    id: page.id,
    notion_url: `https://www.notion.so/${page.id.replace(/-/g, '')}`,
    name: t('Name','title'), city: t('City','select'), type: t('Type','select'),
    neighborhood: t('Neighborhood','text'), phone: t('Phone','phone'),
    is_open: isOpenNow(weekdays, saturday, sunday, is_on_duty),
    is_on_duty,
    momo: t('Accepts_MTN_MoMo','check'), orange: t('Accepts_Orange_Money','check'),
    weekdays, saturday, sunday,
    reliability: t('Reliability_Score','num'),
  };
}

function detectIntent(msg) {
  const m = msg.toLowerCase().trim();
  // Greetings / smalltalk — do NOT query Notion
  const greetings = ['salut','bonjour','bonsoir','hello','hi ','hey ','how are','merci',
                     'thank','what is','who are','help me','what can','tell me about you'];
  if (greetings.some(g => m === g || m.startsWith(g + ' '))) return 'chat';
  if (m.length < 15 && !m.includes('pharmacy') && !m.includes('hospital') &&
      !m.includes('pharmacie') && !m.includes('hôpital') && !m.includes('find') &&
      !m.includes('trouver') && !m.includes('open') && !m.includes('ouvert'))
    return 'chat';

  if (m.includes('mark') || m.includes('update') || m.includes('set') ||
      m.includes('close') || m.includes('change') || m.includes('marquer') ||
      m.includes('fermer') || m.includes('ouvrir') || m.includes('modifier'))
    return 'update';
  if (m.includes('add') || m.includes('create') || m.includes('new') ||
      m.includes('register') || m.includes('ajouter') || m.includes('créer') ||
      m.includes('nouveau') || m.includes('nouvelle'))
    return 'create';
  return 'query';
}

function detectLanguage(msg) {
  const m = msg.toLowerCase();
  // Only trigger FR if the user WRITES in French (verbs, articles, accented words)
  // Proper nouns like "Hôpital X" in an English sentence should NOT trigger FR
  const frVerbs = ['trouver','chercher','ajouter','marquer','montrer','afficher',
                   'ouvrir','fermer','créer','modifier','donner','montrez','trouvez'];
  const frArticles = ['\bles\b','\bdes\b','\bune\b','\bdu\b','\bau\b',
                      '\bma\b','\bmon\b','\bton\b','\bsa\b'];
  const frAdverbs = ['maintenant','maintenant','actuellement','maintenant','quels','quelles'];
  const frGreeting = ['salut','bonjour','bonsoir','merci','comment','est-ce','puis-je'];

  const allFR = [...frVerbs, ...frAdverbs, ...frGreeting];
  const frScore = allFR.filter(w => new RegExp('\\b' + w + '\\b').test(m)).length
    + frArticles.filter(p => new RegExp(p).test(m)).length;

  return frScore >= 1 ? 'fr' : 'en';
}

function buildFilter(msg) {
  const m = msg.toLowerCase();
  const f = [];
  if (m.includes('douala'))    f.push({ property: 'City', select: { equals: 'Douala' } });
  if (m.includes('yaound'))    f.push({ property: 'City', select: { equals: 'Yaoundé' } });
  if (m.includes('bafoussam')) f.push({ property: 'City', select: { equals: 'Bafoussam' } });
  if (m.includes('bamenda'))   f.push({ property: 'City', select: { equals: 'Bamenda' } });
  if (m.includes('garoua'))    f.push({ property: 'City', select: { equals: 'Garoua' } });
  if (m.includes('maroua'))    f.push({ property: 'City', select: { equals: 'Maroua' } });
  if (m.includes('pharmac'))   f.push({ property: 'Type', select: { equals: 'Pharmacy' } });
  if (m.includes('hospital') || m.includes('hôpital') || m.includes('hopital'))
                               f.push({ property: 'Type', select: { equals: 'Hospital' } });
  if (m.includes('clinic'))    f.push({ property: 'Type', select: { equals: 'Clinic' } });
  if (m.includes('lab'))       f.push({ property: 'Type', select: { equals: 'Laboratory' } });
  if (m.includes('health center') || m.includes('csi') || m.includes('centre de santé'))
                               f.push({ property: 'Type', select: { equals: 'Health center' } });
  if (m.includes('on duty') || m.includes('garde'))
                               f.push({ property: 'Is_On_Duty', checkbox: { equals: true } });
  if (m.includes('momo') || m.includes('mtn'))
                               f.push({ property: 'Accepts_MTN_MoMo', checkbox: { equals: true } });
  if (m.includes('orange'))    f.push({ property: 'Accepts_Orange_Money', checkbox: { equals: true } });
  if (f.length === 0) return {};
  if (f.length === 1) return f[0];
  return { and: f };
}

async function callAI(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, max_tokens: 1000
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || 'No response';
}

async function updateReliability(pageId, currentScore, action) {
  let newScore = currentScore;
  if (action === 'wrongly_closed') newScore = Math.max(0,   currentScore - 5);
  if (action === 'confirmed_open') newScore = Math.min(100, currentScore + 1);
  if (newScore !== currentScore) {
    await updatePage(pageId, {
      'Reliability_Score': { number: newScore },
      'Last_Updated': { date: { start: new Date().toISOString().split('T')[0] } }
    });
  }
  return newScore;
}

// ─── Chat endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const mcpActions = [];
  const lang = detectLanguage(message);
  const usingRealMCP = !!mcpClient;

  try {
    const intent = detectIntent(message);
    let prompt = '';
    let notionUrl = null;

    // ── CHAT / SMALLTALK ──────────────────────────────────────────────────────────
    if (intent === 'chat') {
      const langLine = lang === 'fr'
        ? 'IMPORTANT: You MUST respond entirely in French.'
        : 'IMPORTANT: You MUST respond entirely in English.';
      const aiPrompt = `You are HealthNearby AI, a friendly healthcare assistant for Cameroon. ${langLine}
The user said: "${message}"
This is a greeting or general question — do NOT list facilities.
Respond naturally and briefly. Mention you can help find healthcare facilities, check opening hours, and update facility status via Notion MCP.`;
      const response = await callAI(aiPrompt);
      return res.json({ response, mcpActions: [], notionUrl: null, lang, bestPick: null });
    }

    // ── QUERY ──────────────────────────────────────────────────────────────────
    let facilities = [];
    if (intent === 'query') {
      const filter = buildFilter(message);
      const sorts  = [{ property: 'Reliability_Score', direction: 'descending' }];

      mcpActions.push({
        tool: usingRealMCP ? 'notion:query_database [MCP]' : 'notion:query_database [API]',
        input: { database_id: DATABASE_ID, filter, sorts },
        protocol: usingRealMCP ? 'MCP/SSE' : 'REST'
      });

      const result = await queryDatabase(filter, sorts);
      mcpActions[0].raw_response = {
        total: result.results?.length || 0,
        has_more: result.has_more
      };

      const allFacilities = (result.results || []).map(parsePage);
      // Deduplicate by name+city
      const seen = new Set();
      facilities = allFacilities.filter(f => {
        const key = f.name + '|' + f.city;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const m = message.toLowerCase();
      if (m.includes('open') || m.includes('ouvert') || m.includes('right now') || m.includes('maintenant')) {
        facilities = facilities.filter(f => f.is_open);
      }

      const langLine = lang === 'fr' ? 'IMPORTANT: You MUST respond entirely in French.' : 'IMPORTANT: You MUST respond entirely in English. Do NOT use French.';

      if (facilities.length === 0) {
        prompt = `You are HealthNearby AI. ${langLine}
User query: "${message}"
The Notion database returned 0 matching facilities.
CRITICAL: Do NOT invent any facility. Simply say no results found and suggest a broader search.`;
      } else {
        prompt = `You are HealthNearby AI, a healthcare assistant for Cameroon. ${langLine}

User query: "${message}"
CRITICAL: Use ONLY the facilities in the JSON below. NEVER invent names, phones, or addresses.

Notion data (${facilities.length} facilities, open status = real-time UTC+1 Cameroon):
${JSON.stringify(facilities.slice(0, 10), null, 2)}

From above data ONLY, list with:
- Name, neighborhood, city
- ✅ Open / ❌ Closed
- 💛 MTN MoMo / 🟠 Orange Money
- 📞 Phone (exactly as in data)
- ⭐ Reliability/100

Show top 5. End with best recommendation from the list only.`;
      }
    }

    // ── UPDATE ─────────────────────────────────────────────────────────────────
    else if (intent === 'update') {
      mcpActions.push({
        tool: usingRealMCP ? 'notion:query_database [MCP]' : 'notion:query_database [API]',
        input: { database_id: DATABASE_ID },
        protocol: usingRealMCP ? 'MCP/SSE' : 'REST'
      });

      const result = await queryDatabase();
      mcpActions[0].raw_response = { total: result.results?.length || 0 };

      const facilities = (result.results || []).map(parsePage);
      const m = message.toLowerCase();
      const match = facilities.find(f =>
        m.includes(f.name.toLowerCase()) ||
        f.name.toLowerCase().split(' ').some(w => w.length > 4 && m.includes(w.toLowerCase()))
      );

      if (match) {
        const updates = {};
        if (m.includes('close') || m.includes('closed') || m.includes('fermé') || m.includes('fermer')) {
          updates['Is_Open_Now'] = { checkbox: false };
          updates['Is_On_Duty']  = { checkbox: false };
          if (match.is_open) {
            const newScore = await updateReliability(match.id, match.reliability, 'wrongly_closed');
            updates['Reliability_Score'] = { number: newScore };
          }
        } else if (m.includes('open') || m.includes('ouvert') || m.includes('ouvrir')) {
          updates['Is_Open_Now'] = { checkbox: true };
          await updateReliability(match.id, match.reliability, 'confirmed_open');
        }
        if (m.includes('on duty') || m.includes('garde')) {
          updates['Is_On_Duty']  = { checkbox: true };
          updates['Is_Open_Now'] = { checkbox: true };
        }
        updates['Last_Updated'] = { date: { start: new Date().toISOString().split('T')[0] } };

        mcpActions.push({
          tool: usingRealMCP ? 'notion:update_page [MCP]' : 'notion:update_page [API]',
          input: { page_id: match.id, properties: updates },
          protocol: usingRealMCP ? 'MCP/SSE' : 'REST'
        });

        const updated = await updatePage(match.id, updates);
        mcpActions[1].raw_response = { status: updated.object, id: updated.id };
        notionUrl = match.notion_url;

        const langLine = lang === 'fr' ? 'IMPORTANT: You MUST respond entirely in French.' : 'IMPORTANT: You MUST respond entirely in English. Do NOT use French.';
        prompt = `You are HealthNearby AI. ${langLine}
User: "${message}"
Updated "${match.name}" (${match.neighborhood}, ${match.city}) in Notion via ${usingRealMCP ? 'MCP protocol' : 'API'}.
Changes: ${JSON.stringify(updates)}.
Status: ${updated.object === 'page' ? 'SUCCESS ✅' : 'ERROR ❌'}.
Confirm clearly with new status.`;
      } else {
        const langLine = lang === 'fr' ? 'IMPORTANT: You MUST respond entirely in French.' : 'IMPORTANT: You MUST respond entirely in English. Do NOT use French.';
        prompt = `You are HealthNearby AI. ${langLine}
User wanted to update: "${message}" but no matching facility found.
Ask for more specific facility name.`;
      }
    }

    // ── CREATE ─────────────────────────────────────────────────────────────────
    else if (intent === 'create') {
      const extractPrompt = `Extract facility info from: "${message}"
Return ONLY valid JSON, no markdown:
{"name":"","city":"Douala","neighborhood":"","type":"Pharmacy","phone":"","momo":true,"orange":false,"weekdays":"08:00-21:00","saturday":"08:00-20:00","sunday":"Closed"}
City: Douala/Yaoundé/Bafoussam/Bamenda/Garoua/Maroua
Type: Pharmacy/Hospital/Clinic/Laboratory/Health center`;

      let fd;
      try {
        const extracted = await callAI(extractPrompt);
        fd = JSON.parse(extracted.replace(/```json|```/g, '').trim());
      } catch {
        fd = { name: 'New Facility', city: 'Douala', neighborhood: 'Centre', type: 'Pharmacy', phone: '', momo: true, orange: false, weekdays: '08:00-21:00', saturday: '08:00-20:00', sunday: 'Closed' };
      }

      const today = new Date().toISOString().split('T')[0];
      const props = {
        "Name":                { title:      [{ text: { content: fd.name } }] },
        "City":                { select:      { name: fd.city }               },
        "Type":                { select:      { name: fd.type }               },
        "Neighborhood":        { rich_text:  [{ text: { content: fd.neighborhood || '' } }] },
        "Phone":               { phone_number: fd.phone || ''                 },
        "Is_Open_Now":         { checkbox: false },
        "Is_On_Duty":          { checkbox: false },
        "Accepts_MTN_MoMo":    { checkbox: !!fd.momo },
        "Accepts_Orange_Money":{ checkbox: !!fd.orange },
        "Weekdays_Hours":      { rich_text:  [{ text: { content: fd.weekdays || '08:00-21:00' } }] },
        "Saturday_Hours":      { rich_text:  [{ text: { content: fd.saturday || '08:00-20:00' } }] },
        "Sunday_Hours":        { rich_text:  [{ text: { content: fd.sunday   || 'Closed'      } }] },
        "Reliability_Score":   { number: 75 },
        "Last_Updated":        { date: { start: today } }
      };

      mcpActions.push({
        tool: usingRealMCP ? 'notion:create_page [MCP]' : 'notion:create_page [API]',
        input: fd,
        protocol: usingRealMCP ? 'MCP/SSE' : 'REST'
      });

      const created = await createPage(props);
      mcpActions[0].raw_response = { status: created.object, id: created.id };
      if (created.id) notionUrl = `https://www.notion.so/${created.id.replace(/-/g, '')}`;

      const langLine = lang === 'fr' ? 'IMPORTANT: You MUST respond entirely in French.' : 'IMPORTANT: You MUST respond entirely in English. Do NOT use French.';
      prompt = `You are HealthNearby AI. ${langLine}
User: "${message}"
Created in Notion via ${usingRealMCP ? 'MCP protocol' : 'API'}: ${JSON.stringify(fd)}.
ID: ${created.id || 'error'}.
Confirm with all details. Be clear and friendly.`;
    }

    const response = await callAI(prompt);

    // Compute bestPick for query intent
    let bestPick = null;
    if (intent === 'query' && typeof facilities !== 'undefined' && facilities.length > 0) {
      const top = facilities[0];
      const reasons = [];
      if (top.is_open) reasons.push('Open right now');
      if (top.is_on_duty) reasons.push('On-duty pharmacy (24/7)');
      if (top.momo) reasons.push('Accepts MTN MoMo');
      if (top.orange) reasons.push('Accepts Orange Money');
      reasons.push(`Reliability score: ${top.reliability}/100`);
      bestPick = { name: top.name, neighborhood: top.neighborhood, city: top.city, phone: top.phone, reasons };
    }

    res.json({ response, mcpActions, notionUrl, lang, bestPick, protocol: usingRealMCP ? 'MCP' : 'API' });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Status endpoint ───────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    mcp_connected: !!mcpClient,
    mcp_tools: mcpTools,
    protocol: mcpClient ? 'MCP/SSE (mcp.notion.com)' : 'Notion REST API',
    db: DATABASE_ID,
    groq: !!GROQ_API_KEY
  });
});

// ─── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

initMCP().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🏥 HealthNearby AI running on http://localhost:${PORT}`);
    console.log(`🔌 Protocol: ${mcpClient ? 'Notion MCP (mcp.notion.com/sse)' : 'Notion REST API (fallback)'}`);
    console.log(`🤖 Groq Llama 3 ready\n`);
  });
});