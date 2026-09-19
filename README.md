# CodeMe

> Your DSA practice, personalized.

<p align="center">
  <a href="https://codeme-phi.vercel.app/">
    <strong>🚀 Try CodeMe Live</strong>
  </a>
</p>

CodeMe is a personalized DSA practice platform built for the **AI for Learning Hackathon**. It analyzes a learner's solving history, topic mastery, difficulty progression, failures, and recency to recommend what they should practice next—paired with a pedagogical AI Tutor powered by Google Gemini.

---

## 🌟 Key Features

### 1. 🎯 Personalized Recommendation Engine
- **Data-Driven Practice**: Evaluates topic weakness, difficulty fit, failure relevance, concept overlap, and practice recency to determine a personalized next challenge.
- **Explainable Guidance**: Every recommendation provides transparent, personalized rationale explaining *why* this problem was selected for your current skill progression.
- **Deterministic Scoring**: Delivers consistent, reproducible recommendations grounded directly in your attempt history.

### 2. ✦ AI Tutor (Google Gemini)
- **Pedagogical 3-Tier Progressive Hints**:
  - **Hint 1 · Concept**: Small conceptual nudge to inspire algorithmic thinking. Never dumps code or algorithms.
  - **Hint 2 · Strategy**: Directional algorithmic approach and high-level strategy.
  - **Hint 3 · Implementation**: Concrete structural guidance, data structures, and edge cases without providing full copy-paste solutions.
- **Quota-Optimized Architecture**: A single Gemini generation request generates all 3 progressive hints as structured JSON. Hints 2 and 3 are revealed instantly from memory with **zero additional API requests**.
- **Request Deduplication & 15s Cooldown**: Prevents double-clicks and accidental quota exhaustion with a subtle cooldown indicator.
- **Deep Solution Breakdown**: On-demand post-attempt algorithmic explanations detailing time/space complexity and core principles.
- **Math & Notation Pipeline**: Custom rendering protects LaTeX formulas, Big-O notation, and code snippets while keeping currency signs and symbols clean.

### 3. 📊 Analytics & Topic Mastery
- **Visual KPIs**: Track total problems solved, success rates, practice streaks, and time invested.
- **Granular Topic Breakdown**: Measures mastery across Arrays, Two Pointers, Trees, Graphs, Dynamic Programming, and more.
- **Weakness Detection**: Directly identifies topics needing reinforcement and factors them into upcoming recommendations.

### 4. 📚 Curated Problem Catalog
- **104 curated DSA problems** with concise descriptions, input/output examples, constraints, topic tags, and static hints.
- Real-time search, difficulty filters, and topic chips.

---

## 🏗️ Architecture

```text
┌────────────────────────────────┐
│      Vercel (Frontend)         │
│     React 19 · Vite · SPA      │
└───────────────┬────────────────┘
                │ HTTPS / JSON API
                ▼
┌────────────────────────────────┐
│      Render (Backend API)      │
│    Node.js · Express Engine    │
└───────┬────────────────┬───────┘
        │                │
        ▼                ▼
┌──────────────┐   ┌───────────────────────────┐
│MongoDB Atlas │   │       Google Gemini       │
│ Problems &   │   │     gemini-3.6-flash      │
│ Practice Data│   │(Quota-Optimized AI Tutor) │
└──────────────┘   └───────────────────────────┘
```

### Live Deployment

- **Frontend**: [https://codeme-phi.vercel.app/](https://codeme-phi.vercel.app/) (Vercel)
- **Backend**: Hosted on Render
- **Database**: MongoDB Atlas
- **AI**: Google Gemini (`gemini-3.6-flash`)

---

## 📁 Project Structure

```text
codeme/
├── client/                     # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/         # AiMarkdown, UI components
│   │   ├── pages/              # Dashboard, Library, ProblemDetails, Recommendation, Analytics
│   │   ├── services/           # API client (singleton)
│   │   └── utils/              # Text formatters, math notation sanitizers
│   ├── test/                   # Frontend unit tests (Markdown & AI hint state machine)
│   └── package.json
├── server/                     # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/             # DB and environment configuration
│   │   ├── controllers/        # AI, Problem, Attempt, Analytics, Recommendation controllers
│   │   ├── models/             # Mongoose schemas (Problem, Attempt, User)
│   │   ├── routes/             # REST API endpoints
│   │   ├── services/           # aiService (Gemini), recommendationService, analyticsService
│   │   └── utils/              # Seeding utilities
│   ├── test/                   # Backend tests (AI parser, recommendation, analytics)
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- [Google AI Studio](https://aistudio.google.com/) (for Gemini API key)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Ankith-Achar-27/codeme.git
cd codeme

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure Environment Variables

#### Backend (`server/.env`)
Create `server/.env` (or copy from `server/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codeme
CLIENT_URL=http://localhost:5173

# Google Gemini API
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-3.6-flash
AI_PROVIDER=gemini
```

#### Frontend (`client/.env`)
Create `client/.env` (or copy from `client/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Problem Catalog

Seed the 104 curated DSA problems into your MongoDB database:

```bash
cd server
npm run seed
```

### 4. Run Development Servers

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite runs on http://localhost:5173
```

---

## 🧪 Testing & Validation

CodeMe includes automated test suites covering both frontend state management and backend services.

### Backend Tests
Verifies recommendation determinism, analytics calculations, Gemini prompt structure, strict JSON parsing, and 502/503 error handling:
```bash
cd server
npm test
```
*Result: 28/28 tests passing.*

### Frontend Tests, Linting & Build
Verifies LaTeX/Markdown notation sanitization, bold/code preservation, single-request hint progression, local hint reveals, double-click deduplication, and cooldown timer:
```bash
cd client
node --test test/*.test.js
npm run lint
npm run build
```
*Result: 16/16 tests passing, 0 lint warnings/errors, production build successful.*

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS Design System, Oxlint
- **Backend**: Node.js, Express, Mongoose, Native Node Test Runner
- **Database**: MongoDB / MongoDB Atlas
- **AI Engine**: Google Gemini API (`gemini-3.6-flash`)
- **Hosting**: Vercel (Frontend), Render (Backend API), MongoDB Atlas (Database)

---

## 👥 Team

Built with ❤️ by **Team Erebus** for the **AI for Learning Hackathon**.
