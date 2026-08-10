# Eventra — Frontend

A dark, red/black front end for the **Event Registration System API**. Built with:

- **React 18 + Vite**
- **Tailwind CSS v4** (`@import "tailwindcss";` in `src/index.css`, no `tailwind.config.js` needed — theme lives in `@theme` in the same file)
- **react-router-dom** for routing
- Plain `fetch` for API calls (no axios, no UI component library — every component in `src/components/shared` is hand-built)

## Getting started

```bash
cd frontend
npm install
cp .env.example .env   # point VITE_API_URL at your running backend
npm run dev
```

The app runs at `http://localhost:5173` by default, which matches the `FRONT_END_ORIGIN` your backend's CORS config expects.

Make sure the backend (`event-api`) is running separately (`npm run dev` inside that project) — this is a pure front end that talks to it over HTTP.

## Project structure

```
src/
  components/
    shared/     # Button, Input, Card, Modal, Badge, EventCard, Icons... every reusable UI piece
    layout/      # Navbar, AppLayout, ProtectedRoute, AdminRoute
  context/       # AuthContext (session), ToastContext (notifications)
  lib/           # api.js (fetch wrapper), endpoints.js (grouped API calls), format.js
  pages/
    auth/        # Login, Register
    admin/       # AdminEvents (+ EventForm), AdminUsers, AdminRegistrations
    Home.jsx, Events.jsx, EventDetail.jsx, MyRegistrations.jsx, Profile.jsx, NotFound.jsx
  App.jsx        # routes
  main.jsx       # entry point
  index.css      # Tailwind v4 import + dark red/black theme
```

## Notes on how it maps to the backend

- **Auth**: login stores the returned `accessToken` (localStorage) and sends it as `Authorization: Bearer <token>` on every request. `GET /users/get-current-user` is admin-only in the backend, so the logged-in user's profile is cached locally at login/update time instead.
- **Events**: `/events/get-all-events` and `/events/get-event-id/:id` are available to any logged-in user; create/update/delete/generate-description are admin-only and live under **Manage events**.
- **Registrations**: creating a registration posts `{ userId, eventId }` and the backend enforces capacity + duplicate checks — errors surface as toast notifications. Cancelling sets `status: "cancelled"` (matches the backend's enum) rather than deleting the record, so it stays in history.
- **AI descriptions**: the "Generate with AI" button in the event form calls `POST /events/generate-description/:id` (Gemini) — only enabled once the event has been saved, since the endpoint needs an existing event id.

## Notes on running the API

The backend at `/api/v1` expects `MONGODB_URI`, JWT secrets, and a `GEMINI_API_KEY` in its own `.env`. See the backend's README for that setup — this frontend doesn't need anything but `VITE_API_URL`.
