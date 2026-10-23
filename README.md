# Eventra

Eventra is a full-stack event registration system. Users can discover events,
register for them, and manage their profiles. Administrators can manage events,
users, and registrations from a dedicated dashboard.

The repository is organized as two applications:

- **Frontend** - a React and Vite single-page application.
- **Backend** - an Express and MongoDB REST API with JWT authentication,
  role-based authorization, Swagger documentation, and Gemini-powered event
  descriptions.

## Features

- User registration, login, logout, profile updates, and password changes
- JWT access and refresh token authentication
- User and admin role-based route protection
- Event browsing and event details
- Admin event creation, editing, deletion, and capacity management
- Event registration with duplicate and capacity checks
- Registration history and cancellation
- Admin views for users and registrations
- AI-generated event descriptions with Google Gemini
- Interactive OpenAPI documentation
- Responsive dark red and black interface

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Tailwind CSS v4, Axios |
| Backend | Node.js, Express, Mongoose, MongoDB |
| Authentication | JSON Web Tokens, bcryptjs, cookies |
| Documentation | Swagger UI, OpenAPI 3.0.3 |
| AI | Google Gemini API |

## Repository structure

```text
eventra/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and OpenAPI configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication, admin, and validation middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Shared API and Gemini helpers
│   │   └── validations/     # Zod request schemas
│   ├── public/              # Backend public assets
│   └── README.md            # Backend setup and API reference
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared and layout components
│   │   ├── context/         # Authentication and toast state
│   │   ├── lib/             # API client, endpoints, and formatters
│   │   └── pages/           # Public, authenticated, and admin pages
│   ├── public/              # Frontend assets
│   └── README.md            # Frontend setup and architecture
├── package.json             # Root development script
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database, local or hosted with MongoDB Atlas
- A Google Gemini API key for AI description generation

## Installation

Clone the repository and install dependencies for all three package manifests:

```bash
git clone https://github.com/abmdevx/eventra.git
cd eventra
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Environment variables

Create `backend/.env`:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/eventra
FRONT_END_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_another_long_random_secret
REFRESH_TOKEN_EXPIRY=10d
GEMINI_API_KEY=your_gemini_api_key
```

Create `frontend/.env` only when the API is not using its default URL:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Do not commit either `.env` file or real credentials.

## Run the application

From the repository root, run both development servers:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

The default local URLs are:

- Frontend: <http://localhost:5173>
- API: <http://localhost:8000/api/v1>
- Swagger UI: <http://localhost:8000/api-docs>

The backend's `FRONT_END_ORIGIN` must match the URL used by the frontend so
that browser requests pass CORS validation.

## Documentation

More focused documentation is available in:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [OpenAPI specification](./backend/src/config/openapi.yaml)

## License

No license file is currently included in this repository.
