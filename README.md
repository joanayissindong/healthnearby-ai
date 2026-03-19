# 🏥 HealthNearby AI — Notion MCP Healthcare Agent

> **This is not a chatbot.**
> **This is a live AI operating system that reads, updates, and controls real-world healthcare data — powered by Notion MCP.**

Built for the [Notion MCP Challenge](https://dev.to/challenges/notion-2026-03-04) · DEV Community · March 2026

---

## The Problem

It is 11 PM in Bépanda, Douala, Cameroon.

A mother's 4-year-old son has a fever that won't break.

She needs a pharmacy — open right now, that accepts MTN Mobile Money, because she has no cash at home.

She has no app. No website. No information.

She starts calling neighbors. Walking in the dark.

**HealthNearby AI was built to end that walk.**

---

## What Makes This Different

Most AI projects **answer questions**.

**This system acts.**

Using Notion MCP, the AI agent can:

- 🔍 **Query** — find facilities by city, type, payment method, real-time open status
- 🔄 **Update** — change facility status live in Notion, auto-adjust reliability score
- ➕ **Create** — add new facilities to the database instantly

Every single action goes through **Notion MCP** at runtime.
Remove MCP — the system stops working. It is not decorative.

---

## The System Loop

```
User → AI Agent (Groq) → Notion MCP (22 tools) → Notion DB → Real-time response
         ↑                      ↓
         └──── Read → Decide → Act → Update ────┘
```

---

## Live Features

| Feature | Description |
|---------|-------------|
| 🔌 **Real MCP Protocol** | `@notionhq/notion-mcp-server` via stdio — 22 Notion tools |
| ⏱️ **Real-time Status** | Open/closed computed from hours (Cameroon UTC+1) — no cron job |
| 🔄 **Auto-sync** | Server syncs all 200 facilities' status to Notion on startup + every 30 min |
| ⭐ **Reliability Score** | Auto-decreases when a facility is wrongly marked closed during open hours |
| 🧠 **AI Decision Panel** | Shows AI reasoning steps + MCP calls + execution time in real-time |
| 🚨 **Emergency Mode** | One click → UI turns red, auto-searches on-duty pharmacies open NOW |
| 🌍 **Bilingual** | Automatic FR/EN detection — responds in the user's language |
| 🔗 **Verify in Notion** | Direct link to the exact updated Notion page after every action |
| 🏥 **Facility Inspector** | Live right-panel with full details, hours, payments, action buttons |
| 🎬 **Splash Screen** | MCP connection animation on load — shows the system initializing |
| 💡 **Welcome Modal** | 3 guided demo scenarios — judges can explore with 1 click |
| 📊 **200 Facilities** | 6 Cameroonian cities, 5 facility types |
| 💛 **Mobile Money First** | MTN MoMo + Orange Money as primary filters — not an afterthought |

---

## Demo Scenarios

### 🔍 Query (Read via MCP)
```
"Find an open pharmacy in Douala that accepts MTN MoMo right now"
→ Agent queries Notion via MCP
→ Filters by city + payment + real-time computed open status
→ Returns top results ranked by reliability score
→ Shows best recommendation with call button
```

### 🔄 Update (Write via MCP)
```
"Mark Pharmacie de Garde Nkongmondo as closed"
→ Agent finds exact match in Notion DB
→ Updates Is_Open_Now + Is_On_Duty via direct API
→ Auto-adjusts reliability score if closed during open hours
→ Returns Notion page link for live verification
```

### ➕ Create (Insert via MCP)
```
"Add a new pharmacy: Pharmacie Espoir, Bastos Yaoundé, accepts MoMo and Orange Money"
→ AI extracts structured data from natural language
→ Creates new Notion page with all properties
→ Immediately searchable in the system
→ Returns Notion page link to verify
```

### 🚨 Emergency Mode
```
Click the URGENCE button
→ UI turns red
→ Auto-searches on-duty pharmacies open NOW
→ "This is not a demo. This is life-saving."
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Agent | Groq — Llama 3.1-8b-instant (free) |
| MCP Protocol | `@notionhq/notion-mcp-server` + `@modelcontextprotocol/sdk` |
| Database | Notion (200 seeded facilities) |
| Backend | Node.js + Express |
| Frontend | Vanilla JS + CSS (3-column cockpit UI) |

---

## Setup

### 1. Clone & install
```bash
git clone https://github.com/joanayissindong/healthnearby-ai.git
cd healthnearby-ai
npm install
```

### 2. Configure `.env`
```env
NOTION_TOKEN=ntn_your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
GROQ_API_KEY=gsk_your_groq_key
PORT=3000
```

### 3. Create your Notion database
- Create a new full-page database in Notion
- Go to **Settings → Integrations** and connect **HealthNearby AI**
- Copy the database ID from the URL

### 4. Seed the database
```bash
npm run setup
```
Creates the full schema + seeds 200 healthcare facilities across 6 cities.

### 5. Start the agent
```bash
npm start
```
On startup:
- Connects to Notion MCP server (22 tools)
- Syncs real-time open/closed status for all 200 facilities
- Starts syncing every 30 minutes automatically

### 6. Open the UI
```
http://localhost:3000
```

---

## Data Coverage

| City | Facilities | Types |
|------|-----------|-------|
| Douala | 70 | Hospitals, Clinics, Pharmacies, Labs, Health Centers |
| Yaoundé | 50 | Same categories |
| Bafoussam | 25 | Same categories |
| Bamenda | 25 | Same categories |
| Garoua | 15 | Same categories |
| Maroua | 15 | Same categories |
| **Total** | **200** | **5 types** |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  HealthNearby AI                     │
├──────────────┬──────────────────┬───────────────────┤
│  MCP Activity│   Chat + AI      │ Facility Inspector │
│  Timeline    │   Decision Panel │ Live details       │
│  READ badges │   Hero Card      │ Action buttons     │
│  UPDATE      │   Streaming      │ Call / Mark / Find │
│  CREATE      │   Best Pick      │                   │
└──────────────┴──────────────────┴───────────────────┘
         ↕                  ↕
   Notion MCP          Groq AI API
   (22 tools)       (Llama 3.1-8b)
         ↕
   Notion Database
   (200 facilities)
```

---

## Why MCP Matters Here

> "Most projects use MCP to read data.
> HealthNearby uses MCP to operate a live system."

- `API-query-data-source` → real-time facility search
- `API-patch-page` → live status updates
- `API-post-page` → instant facility creation
- Auto-sync on startup → Notion always reflects real-world hours

---

## The Vision

HealthNearby AI is the first building block of a healthcare information infrastructure for Central and West Africa — a platform where facilities self-register, update their own data, and where patients can always find care.

Starting with 200 facilities in 6 cities.
The vision: every facility, every city, every country in the region.

---

**The mother in Bépanda shouldn't have to walk in the dark.**

---

Built with ❤️ from Yaoundé, Cameroon
**Joan Wilfried Ayissi Ndong** — DEV Notion MCP Challenge, March 2026

GitHub: [joanayissindong/healthnearby-ai](https://github.com/joanayissindong/healthnearby-ai)