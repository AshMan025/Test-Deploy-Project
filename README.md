# Memory Wall

A minimal full-stack app for learning deployment and cloud architecture. Users can post short messages to a shared wall.

- **Backend:** FastAPI + SQLAlchemy (PostgreSQL in production, SQLite locally)
- **Frontend:** React + Vite + Tailwind CSS

The frontend and backend live in separate directories so they can be deployed independently.

## Project structure

```
MemoryWall/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py      # DB URL fallback + engine setup
│   │   ├── models.py        # Memory SQLAlchemy model
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   └── main.py            # FastAPI app + routes
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── config.js      # VITE_API_BASE_URL helper
│   │   │   └── memories.js    # API fetch functions
│   │   ├── components/
│   │   │   ├── MemoryForm.jsx
│   │   │   └── MemoryWall.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- (Optional) PostgreSQL / Supabase for production database

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # optional for local SQLite
```

**Local development (SQLite):** Leave `DATABASE_URL` unset. The app uses `sqlite:///./memory_wall.db`.

**Production (Supabase PostgreSQL):** Set `DATABASE_URL` in `.env` or your host's environment variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

Start the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Backend endpoints

| Method | Path            | Description                          |
|--------|-----------------|--------------------------------------|
| GET    | `/api/memories` | List all memories (newest first)     |
| POST   | `/api/memories` | Create a memory (`name`, `message`) |
| GET    | `/api/health`   | Health check                         |

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

The frontend reads `VITE_API_BASE_URL` and defaults to `http://localhost:8000` when unset.

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Running both locally

1. Start the backend on port **8000**
2. Start the frontend on port **5173**
3. Post a memory from the form and confirm it appears in the grid

CORS is pre-configured for `http://localhost:5173`. For production, set `CORS_ORIGINS` on the backend to your frontend URL (comma-separated).

## Production notes

- **Backend:** Deploy `backend/` to any Python host (Render, Railway, Fly.io, etc.). Set `DATABASE_URL` to your Supabase connection string.
- **Frontend:** Build with `npm run build` and deploy the `dist/` folder (Vercel, Netlify, etc.). Set `VITE_API_BASE_URL` to your deployed API URL at build time.
- Supabase sometimes provides `postgres://` URLs; the backend normalizes these to `postgresql://` automatically.
