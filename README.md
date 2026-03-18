# 🏥 HealthNearby AI — Notion MCP Healthcare Agent

> **A live AI operating system for healthcare data in Cameroon, powered by Notion MCP.**

Built for the [Notion MCP Challenge](https://dev.to/challenges/notion-2026-03-04) on DEV Community.

---

## The Problem

It is 11 PM in Bépanda, Douala, Cameroon.

A mother's 4-year-old son has a fever that won't break. She needs a pharmacy — open right now, that accepts MTN Mobile Money, because she has no cash at home.

She has no app to check. No website to search. She starts calling neighbors.

**HealthNearby AI was built to end that walk.**

---

## What It Does

HealthNearby AI is a conversational agent that uses **Notion as a live operational brain** for 200 healthcare facilities across 6 Cameroonian cities.

Every action — query, update, create — goes through **Notion MCP** in real-time.

### Three core capabilities:

**🔍 Query** — Find facilities instantly
```
"Find an open pharmacy in Douala that accepts MTN MoMo right now"
→ Agent queries Notion via MCP, filters in real-time
→ Returns top results ranked by reliability score
```

**🔄 Update** — Keep data alive
```
"Mark Pharmacie de Garde Nkongmondo as closed"
→ Agent updates Notion via MCP
→ Reliability score auto-adjusts
```

**➕ Create** — Expand the network
```
"Add a new pharmacy: Pharmacie Espoir, Bastos Yaoundé, accepts MoMo"
→ Agent creates new Notion page via MCP
→ Immediately searchable
```

---

## Why Notion MCP Is the Core

Notion is not just a database here — it is the **operational brain** of the system.

- MCP protocol connects the AI agent directly to Notion at runtime
- Every read, write, and create happens through `@notionhq/notion-mcp-server` (22 tools)
- If you remove MCP, the system collapses — it is not decorative

**The loop:**
```
User → Groq AI → Notion MCP → Notion DB → Real-time response
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🔌 Real MCP Protocol | Uses `@notionhq/notion-mcp-server` — 22 Notion tools available |
| ⏱️ Real-time Status | Open/closed computed from hours (Cameroon UTC+1) |
| ⭐ Reliability Score | Auto-updates when facilities are marked incorrectly |
| 🧠 AI Decision Panel | Shows AI reasoning + MCP calls in real-time |
| 🌍 Bilingual | Automatic FR/EN detection and response |
| 🔗 Notion Verify | Direct link to updated Notion page after every action |
| 📊 200 Facilities | 6 Cameroonian cities |
| 💛 Mobile Money First | MTN MoMo + Orange Money as primary filters |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Agent | Groq (Llama 3.1-8b-instant) — free |
| MCP Protocol | `@notionhq/notion-mcp-server` + `@modelcontextprotocol/sdk` |
| Database | Notion (200 seeded facilities) |
| Backend | Node.js + Express |
| Frontend | Vanilla JS + CSS |

---

## Setup

### 1. Clone & install
```bash
git clone https://github.com/joanayissindong/healthnearby-ai.git
cd healthnearby-ai
npm install
```

### 2. Configure environment
Create a `.env` file:
```env
NOTION_TOKEN=ntn_your_notion_token
NOTION_DATABASE_ID=your_database_id
GROQ_API_KEY=gsk_your_groq_key
PORT=3000
```

### 3. Create your Notion database
- Create a new full-page database in Notion
- Connect your integration to the database
- Copy the database ID from the URL

### 4. Seed the database
```bash
npm run setup
```

### 5. Start the agent
```bash
npm start
```

### 6. Open the UI
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

---

## The Vision

HealthNearby AI is the first building block of a healthcare information infrastructure for Central and West Africa — a platform where facilities self-register, update their own data, and where patients can always find care.

The mother in Bépanda shouldn't have to walk in the dark.

---

Built with ❤️ from Yaoundé, Cameroon — **Joan Wilfried Ayissi Ndong**
DEV Notion MCP Challenge, March 2026