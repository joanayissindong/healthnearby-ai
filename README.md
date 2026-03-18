# 🏥 HealthNearby AI — Notion MCP Agent

> A live AI operating system for healthcare data in Cameroon, powered by Notion MCP.

Built for the [Notion MCP Challenge](https://dev.to/challenges/notion-2026-03-04) on DEV.to

---

## Architecture

```
User → Chat UI → Express Server → Claude API + Notion MCP → Notion DB
                                        ↑
                              Read / Update / Create
```

Notion is not just a database — it's the **live operational brain** of the system.
Every action (query, update, create) goes through Notion MCP at runtime.

---

## Setup (5 minutes)

### 1. Clone & install
```bash
npm install
```

### 2. Configure environment
Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```
(Notion token and DB ID are already set)

### 3. Seed the database
```bash
npm run setup
```
This will:
- Configure the Notion DB schema (20 properties)
- Seed 20 healthcare facilities (15 Douala + 5 Yaoundé)

### 4. Start the agent
```bash
npm start
```

### 5. Open the UI
```
http://localhost:3000
```

---

## Demo scenarios

**Query (Read via MCP):**
> "Find an open pharmacy in Douala that accepts MTN MoMo right now"

**Update (Write via MCP):**
> "Mark Pharmacie de Garde Nkongmondo as closed"

**Create (Insert via MCP):**
> "Add a new pharmacy: Pharmacie Espoir, Bastos Yaoundé, accepts MoMo, open 08:00-22:00"

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Agent | Claude claude-sonnet-4-20250514 |
| Data Protocol | Notion MCP (mcp-client-2025-04-04) |
| Database | Notion |
| Backend | Node.js + Express |
| Frontend | Vanilla JS + CSS |

---

Built with ❤️ from Yaoundé, Cameroon — Joan Ayissi Ndong
