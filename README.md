# Hard-Wear (MERN) — T‑Shirts Store

Modern, responsive e-commerce starter for selling clothing (currently **T‑Shirts**) built with:

- **Frontend**: React (Vite) + Tailwind CSS + React Router + Redux Toolkit
- **Backend**: Node.js + Express (MVC) + JWT auth
- **Database**: MongoDB (Mongoose)

## Requirements

- Node.js 18+ (recommended)
- MongoDB connection URI (Atlas is fine)

## Quick start (local)

### 1) Backend env

Copy:

- `backend/.env.example` → `backend/.env`

Set:

- `MONGODB_URI=...`
- `JWT_SECRET=...`

### 2) Install dependencies

From the project root:

```bash
cd hardwear
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3) Seed sample data (creates admin + sample products)

```bash
cd backend
npm run seed
```

### 4) Run app

In two terminals (Windows-safe):

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api/health`

## Admin panel

After seeding, login with the printed credentials (defaults):

- Email: `admin@hardwear.dev`
- Password: `Admin123!`

Admin routes:

- `/admin`
- `/admin/products`
- `/admin/orders`

## API docs

See `docs/API.md`.

## Deploy on Render

This repo includes `render.yaml` for Blueprint deploy.

1. Push this repo to GitHub.
2. In Render, choose **New +** → **Blueprint** and select your repo.
3. Render creates:
   - `hardwear-api` (Node web service, `backend/`)
   - `hardwear-web` (Static site, `frontend/`)
4. Set required environment variables:
   - `hardwear-api`
     - `MONGODB_URI` = your Atlas URI
     - `JWT_SECRET` = long random secret
     - `FRONTEND_URL` = your frontend Render URL (e.g. `https://hardwear-web.onrender.com`)
   - `hardwear-web`
     - `VITE_API_URL` = your backend URL (e.g. `https://hardwear-api.onrender.com`)
5. Trigger deploy for both services.

### Optional post-deploy seed

In Render Shell for `hardwear-api`, run:

```bash
npm run seed
```

