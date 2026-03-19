# 🏥 HealthNearby AI — Notion MCP Healthcare Agent

> **This is not a chatbot.**
> **This is a live AI operating system that reads, updates, and controls real-world healthcare data — powered by Notion MCP.**

🎥 **Demo Video:** *(included in DEV submission)*
📸 **Live App:** `http://localhost:3000` (after setup)

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

## Why This Project Stands Out

- 🌍 **Real-world impact** — solves an urgent healthcare access problem in Cameroon, where 92.1% of people navigate the healthcare system entirely on their own
- ⚙️ **True MCP integration** — not just reading data, but executing real actions (query, update, create) via `@notionhq/notion-mcp-server`
- 🧠 **AI as a decision system** — recommends the best option based on real-time reliability + availability + payment method
- 🔄 **Live system, not a static demo** — every action updates Notion in real-time, auto-syncs every 30 minutes
- 🗺️ **Complete product experience** — interactive map, facility inspector, MCP timeline, AI decision panel, emergency mode

- 🚀 **Built under real constraints** — designed for low-connectivity environments and mobile-first usage

> This is not a prototype.
> This is a working system that could be deployed today.

---

## The System Loop

```
User → AI Agent (Groq) → Notion MCP (22 tools) → Notion DB → Real-time response
         ↑                        ↓
         └──── Read → Decide → Act → Update ────┘
```

This architecture ensures that:
- The AI never invents data — every result comes from Notion
- Every decision is grounded in real-time Notion data
- Every action is traceable via the MCP Activity panel

---

## UI — 3-Column Cockpit

```
┌─────────────────┬──────────────────────┬──────────────────────┐
│  MCP Activity   │    Chat + AI         │   Live Map           │
│  Timeline       │    Decision Panel    │   Leaflet.js         │
│  READ badges    │    Hero Card         │   🟢 Open pins       │
│  UPDATE amber   │    Thinking steps    │   🟡 On-duty pins    │
│  CREATE green   │    Best Pick card    │   🔴 Closed pins     │
│  Execution ms   │    Streaming text    │   Click → Inspector  │
└─────────────────┴──────────────────────┴──────────────────────┘
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🔌 **Real MCP Protocol** | `@notionhq/notion-mcp-server` via stdio — 22 Notion tools |
| ⏱️ **Real-time Status** | Open/closed computed from Cameroon hours (UTC+1) — no cron job |
| 🔄 **Auto-sync** | Syncs all 200 facilities' status to Notion on startup + every 30 min |
| ⭐ **Reliability Score** | Auto-decreases when a facility is wrongly marked closed |
| 🗺️ **Interactive Map** | Leaflet.js map with 🟢🟡🔴 pins — click any pin for full details |
| 🏥 **Facility Inspector** | Live panel with hours, payments, reliability, call + action buttons |
| 🧠 **AI Decision Panel** | Shows reasoning steps + MCP calls + execution time in ms |
| 🚨 **Emergency Mode** | One click → red UI, auto-searches on-duty pharmacies across all of Cameroon |
| 🌍 **Bilingual** | Auto-detects FR/EN — responds in the user's language |
| 🔗 **Verify in Notion** | Direct link to the exact Notion page after every update/create |
| 🎬 **Splash Screen** | MCP connection animation on load — system feels alive |
| 💡 **Welcome Modal** | 3 guided demo scenarios — judges explore with 1 click |
| 📊 **200 Facilities** | 6 cities, 5 types: hospitals, clinics, pharmacies, labs, health centers |
| 💛 **Mobile Money First** | MTN MoMo + Orange Money as primary filters — not an afterthought |

---

## Demo Scenarios

### 🔍 Query (Read via MCP)
```
"Find an open pharmacy in Douala that accepts MTN MoMo right now"
→ Queries Notion via MCP
→ Filters by city + payment + real-time open status
→ Returns top 5 ranked by reliability + Hero Card
→ Map updates with colored pins
```

### 🔄 Update (Write via MCP)
```
"Mark Pharmacie de Garde Nkongmondo as closed"
→ Finds exact match in Notion DB
→ Updates Is_Open_Now in Notion via API
→ Auto-adjusts reliability score
→ Returns direct Notion page link for live verification
```

### ➕ Create (Insert via MCP)
```
"Add a new pharmacy: Pharmacie Espoir, Bastos Yaoundé, accepts MoMo"
→ AI extracts structured data from natural language
→ Creates new Notion page with all properties
→ Immediately searchable and appears on map
```

### 🚨 Emergency Mode
```
Click URGENCE button
→ UI turns red with glow effect
→ Auto-searches ALL on-duty pharmacies open NOW across Cameroon
→ Map shows amber pins only — on-duty facilities
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Agent | Groq — Llama 3.1-8b-instant (free) |
| MCP Protocol | `@notionhq/notion-mcp-server` + `@modelcontextprotocol/sdk` |
| Database | Notion (200 seeded facilities) |
| Map | Leaflet.js (OpenStreetMap) |
| Backend | Node.js + Express |
| Frontend | Vanilla JS + CSS (3-column cockpit) |

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
- Connect your **HealthNearby AI** integration
- Copy the database ID from the URL

### 4. Seed the database
```bash
npm run setup
```
Creates schema + seeds 200 healthcare facilities across 6 cities.

### 5. Start the agent
```bash
npm start
```
On startup:
- Connects to Notion MCP server (22 tools)
- Syncs real-time open/closed status for all 200 facilities
- Auto-syncs every 30 minutes

### 6. Open
```
http://localhost:3000
```

---

## Data Coverage

| City | Facilities |
|------|-----------|
| Douala | 70 |
| Yaoundé | 50 |
| Bafoussam | 25 |
| Bamenda | 25 |
| Garoua | 15 |
| Maroua | 15 |
| **Total** | **200** |

Types: Hospitals · Clinics · Pharmacies · Laboratories · Health Centers

---

## Why MCP Is the Core

> "Most projects use MCP to read data.
> HealthNearby uses MCP to operate a live system."

MCP is not an integration layer here.
It is the execution layer of the system.

- `API-query-data-source` → real-time facility search with filters
- `API-patch-page` → live status updates in Notion
- `API-post-page` → instant facility creation
- Auto-sync on startup → Notion always reflects real-world hours

---

## The Vision

HealthNearby AI is the first building block of a healthcare information infrastructure for Central and West Africa — a platform where facilities self-register, update their own data, and where patients can always find care.

Starting with 200 facilities in 6 cities.
The vision: every facility, every city, every country in the region.

---

The mother in Bépanda should not have to walk in the dark to find care.

**With HealthNearby AI, she won't.**

And this is just the beginning.

---

Built with ❤️ from Yaoundé, Cameroon
**Joan Wilfried Ayissi Ndong** — DEV Notion MCP Challenge, March 2026

GitHub: [joanayissindong/healthnearby-ai](https://github.com/joanayissindong/healthnearby-ai)