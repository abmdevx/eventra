# Eventra Frontend

The frontend is a React single-page application for the Eventra event
registration system. It provides the public event experience, authenticated
user pages, and admin management screens.

## Features

- Browse events and view event details
- Register for events and review registration history
- Login, registration, profile editing, and password changes
- Protected user routes and admin-only routes
- Admin event, user, and registration management
- Toast notifications, loading states, confirmations, and reusable form
  components
- Responsive dark red and black design

## Stack

- React 18
- Vite
- React Router
- Tailwind CSS v4
- Axios

## Setup

From the repository root:

```bash
npm install --prefix frontend
```

Create `frontend/.env` when the backend is not running at the default URL:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

The backend must also allow the frontend origin with
`FRONT_END_ORIGIN=http://localhost:5173`.

## Development and production commands

```bash
# Start the Vite development server
npm run dev

# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

The development server runs at <http://localhost:5173> by default.

## Application structure

```text
src/
├── components/
│   ├── layout/              # App layout, navbar, and route guards
│   └── shared/              # Reusable UI components
├── context/
│   ├── AuthContext.jsx      # Authentication and current-user state
│   └── ToastContext.jsx     # Global notifications
├── lib/
│   ├── api.js               # Axios client and API error handling
│   ├── endpoints.js         # Grouped backend endpoint calls
│   └── format.js            # Display formatting helpers
├── pages/
│   ├── auth/                # Login and registration
│   ├── admin/               # Admin dashboard screens and event form
│   └── ...                  # Home, events, profile, and registrations
├── App.jsx                  # Application routes
├── index.css                # Tailwind import and application theme
└── main.jsx                 # React entry point
```

## API integration

The API client uses `VITE_API_URL`, defaulting to
`http://localhost:8000/api/v1`. Authenticated requests send the access token
from local storage as a Bearer token and include credentials for refresh and
logout cookies.

The backend must be running before using login, events, or registrations. See
the [backend README](../backend/README.md) for database and API setup.

## Screenshots

Product screenshots are available in [`public/screenshots`](./public/screenshots).
