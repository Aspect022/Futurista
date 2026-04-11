# Futurista — Your Car's AI Mechanic

**Futurista** is an AI-powered car health assistant that reads your vehicle's engine data and tells you — in plain English — what needs fixing, when it will break, and what to do about it. Under the hood, a multi-agent AI system analyses sensor patterns to predict failures before they happen, so you never get stranded.

---

## What It Does

- **Plain English Health Reports** — AI translates complex sensor data into simple language anyone can understand
- **Predicts Failures Before They Happen** — Shows exactly which parts will fail and how many days you have left
- **"Ask My Car" AI Chat** — Ask questions like "Is my car safe to drive today?" and get instant, clear answers
- **Road Trip Safety Check** — Planning a trip? The AI checks if your car can handle it
- **Book a Mechanic** — One tap to find the nearest service centre with estimated costs
- **Real-Time Warnings** — Get notified the moment something starts wearing down
- **Data Input & Analysis** — Feed in real engine data (RPM, brake thickness, voltage) and watch predictions update live

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        DRIVER                                │
│               (Opens Futurista Web App)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Futurista Frontend (Next.js 14)                  │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────┐  │
│  │ My Car   │  │ Health   │  │ Ask My  │  │ Road Trip    │  │
│  │ Dashboard│  │ Report   │  │ Car Chat│  │ Safety Check │  │
│  └──────────┘  └──────────┘  └─────────┘  └──────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │        Next.js API Routes (Groq / Llama 3)           │    │
│  │  /health-summary  /predictive-explain  /ask-car      │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│            Master Agent Orchestrator (FastAPI)                │
│                                                               │
│  ┌────────────┐ ┌──────────┐ ┌───────────┐ ┌─────────────┐  │
│  │ Data       │ │ Diagnosis│ │ Customer  │ │ Scheduling  │  │
│  │ Analysis   │ │ Worker   │ │ Engagement│ │ Worker      │  │
│  └────────────┘ └──────────┘ └───────────┘ └─────────────┘  │
│  ┌────────────┐ ┌──────────────────────┐                     │
│  │ Feedback   │ │ Manufacturing        │                     │
│  │ Worker     │ │ Insights Worker      │                     │
│  └────────────┘ └──────────────────────┘                     │
│                                                               │
│  ┌──────────────────┐                                        │
│  │ UEBA Security    │  (AI agent risk monitoring)            │
│  └──────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| AI/LLM | Groq Cloud API, Llama 3 70B |
| Charts | Recharts |
| 3D Visualisation | React Three Fiber, Three.js |
| Notifications | Sonner |
| Backend | FastAPI (Python), Multi-Agent Orchestration |
| Infrastructure | Docker, Docker Compose, Redis |
| Security | UEBA (User and Entity Behavior Analytics) |

---

## How to Run It

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend (optional — runs with mock data without it)

```bash
cd Backend
docker-compose up -d
```

### Environment Variables

Create `Frontend/.env.local`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com)

---

## Demo Script (60 seconds)

> **[OPEN — 0:00-0:08]**
> "Imagine you're driving to work and your car suddenly breaks down. The tow truck costs ₹5,000. The emergency repair costs ₹25,000. But what if your car could have WARNED you… three weeks ago? That's Futurista."
>
> **[SHOW THE APP — 0:08-0:20]**
> *Open the app. Land on "Your Toyota Innova — 48% Health"*
> "This is my car's health dashboard. Right away, I see my car is at 48% health — that's red. The AI has already checked every part and it's telling me: 'Your brakes have about 12 days left.'"
>
> **[THE WOW MOMENT — 0:20-0:35]**
> *Click "Explain" on the Brake Pads card*
> "But here's the magic. I click 'Explain' — and our AI, powered by Llama 3, translates the raw sensor data into plain English. It says: 'Your brake pads have worn thin from city driving. You might hear squeaking when stopping.' My grandmother could understand this."
>
> **[THE DEPTH — 0:35-0:50]**
> *Scroll to data input panel, adjust brake pad slider*
> "The app also lets me input real sensor data. Watch — when I slide brake pad thickness from 5mm down to 2mm, the prediction instantly changes to Critical. And I can ask my car anything…"
> *Click 'Ask My Car' → type 'Is it safe to drive today?'*
>
> **[CLOSE — 0:50-1:00]**
> "Under the hood, this runs on a multi-agent AI backend with six specialised workers — but the driver never sees any of that complexity. They just see: 'Fix your brakes in 12 days.' That's Futurista — your car's AI mechanic."

---

## Demo Video

[Coming soon]

---

## Team

Built with ❤️ for the Hackathon

---

*Futurista — Your car's AI mechanic.*
