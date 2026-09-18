# CodeMe

**Your DSA practice, personalized.**

CodeMe is a hackathon project by Team Erebus. It will help users choose their next data-structures-and-algorithms problem using their solving history, including outcomes, topics, difficulty, attempts, and recency.

This repository currently contains the project foundation and a seedable DSA problem catalog. Authentication, recommendation logic, and AI features are intentionally not implemented yet.

## Project structure

```text
dsa-coach/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/          # Dashboard, library, details, recommendations, analytics
│       └── services/
├── server/                 # Express + MongoDB/Mongoose API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── data/                   # Shared seed/sample data (when needed)
├── .gitignore
└── README.md
```

## Install

Install each application separately:

```bash
cd client
npm install

cd ../server
npm install
```

Copy the example environment files if you need to customize defaults:

```bash
copy client\\.env.example client\\.env
copy server\\.env.example server\\.env
```

MongoDB is optional during this foundation stage. The API starts without it; set `MONGODB_URI` when a database is available.

## Database and seed data

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` to your MongoDB database, for example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/codeme
```

The catalog contains approximately 100 curated DSA problems with concise original descriptions, tags, examples, and hints. Seed it with:

```bash
cd server
npm run seed
```

The seed command replaces only catalog records whose slugs belong to this seed set; it does not clear unrelated `Problem` documents.

## Run locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The API health check is available at [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Useful scripts

- `npm run dev` — start the development server
- `npm start` (server) — start the API
- `npm run seed` (server) — insert or refresh the DSA problem catalog
- `npm run build` (client) — produce a production frontend build
- `npm run lint` (client) — lint frontend files
