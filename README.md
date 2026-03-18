# 🏥 HealthNearby AI — Notion MCP Healthcare Agent

> **This is not a chatbot.**
> **This is a live AI system that reads, updates, and controls real-world healthcare data.**

Built for the [Notion MCP Challenge](https://dev.to/challenges/notion-2026-03-04)

---

## The Problem

It is 11 PM in Bépanda, Douala, Cameroon.

A mother's 4-year-old son has a fever that won't break.

She needs a pharmacy — open right now, that accepts MTN Mobile Money.

She has no app. No website. No information.

She starts calling neighbors. Walking in the dark.

**HealthNearby AI was built to end that walk.**

---

## What Makes This Different

Most AI projects **answer questions**.

**This system acts.**

Using Notion MCP, the AI can:

- 🔍 Query real healthcare data
- 🔄 Update facility status live
- ➕ Create new facilities instantly

All actions happen **inside Notion in real time**.

---

## 🧠 The Core Idea

> Notion is not a database.
> It is a **live operational brain**.

---

## 🔁 The System Loop

```
User → AI Agent → Notion MCP → Notion DB → Response → Update
```

This creates a continuous loop:

> **Read → Decide → Act → Update**

If MCP is removed, the system stops working.

---

## 🎬 What It Does

### 🔍 Query (Read via MCP)
```
"Find an open pharmacy in Douala that accepts MTN MoMo right now"
```
→ AI queries Notion via MCP
→ Filters live data
→ Returns best option ranked by reliability

---

### 🔄 Update (Write via MCP)
```
"Mark Pharmacie de Garde Nkongmondo as closed"
```
→ AI updates Notion in real time
→ Reliability score auto-adjusts

---

### ➕ Create (Insert via MCP)
```
"Add a new pharmacy: Pharmacie Espoir, Bastos Yaoundé"
```
→ AI creates a new Notion entry
→ Immediately available in search

---

## ⚙️ Why MCP Matters

- Uses `@notionhq/notion-mcp-server` (22 tools)
- Direct AI → Notion communication at runtime
- No simulation — real data operations

> Most projects use MCP to read data.
> **HealthNearby uses MCP to operate a live system.**

---

## 💡 Key Features

| Feature | Description |
|---------|-------------|
| 🔌 Real MCP Protocol | Full integration with 22 Notion tools |
| ⏱️ Real-time Status | Open/closed computed from hours (UTC+1 Cameroon) |
| ⭐ Reliability Score | Auto-updates based on data accuracy |
| 🧠 AI Decision Panel | Shows reasoning + MCP actions in real-time |
| 🌍 Bilingual | Auto-detects FR/EN |
| 🔗 Verify in Notion | Every action visible in live database |
| 📊 200 Facilities | 6 cities across Cameroon |
| 💛 Mobile Money First | MTN MoMo + Orange Money as primary filters |

---

## 🌍 Data Coverage

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

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Agent | Groq (Llama 3.1-8b-instant) |
| MCP Protocol | `@notionhq/notion-mcp-server` + `@modelcontextprotocol/sdk` |
| Database | Notion (200 seeded facilities) |
| Backend | Node.js + Express |
| Frontend | Vanilla JS + CSS |

---

## 🚀 Setup

```bash
git clone https://github.com/joanayissindong/healthnearby-ai.git
cd healthnearby-ai
npm install
```

Configure `.env`:

```
NOTION_TOKEN=ntn_...
NOTION_DATABASE_ID=...
GROQ_API_KEY=gsk_...
PORT=3000
```

Run:

```bash
npm run setup   # Creates schema + seeds 200 facilities
npm start       # Starts the agent
```

Open → `http://localhost:3000`

---

## 🧠 The Insight

The infrastructure already exists.
The facilities exist. The payments exist.

What's missing is accessible, real-time information.

---

## 🌍 The Vision

HealthNearby AI is the foundation of a healthcare information system for Africa.

A system where:
- Facilities update themselves
- Data stays alive
- Patients always find care

**The mother in Bépanda shouldn't have to walk in the dark.**

---

Built with ❤️ from Yaoundé, Cameroon
**Joan Wilfried Ayissi Ndong** — DEV Notion MCP Challenge, March 2026