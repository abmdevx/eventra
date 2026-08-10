# Eventra — Event Registration System

A full-stack **Event Registration System** built with the MERN stack. Eventra provides a modern dark-themed frontend for browsing and registering for events, along with a RESTful backend API for authentication, event management, registrations, admin operations, and AI-powered event descriptions.

---

## ✨ Features

### 👤 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Access + refresh token flow
- Role-based access control
- Protected user routes
- Admin-only routes
- Secure logout
- User profile management
- Password change functionality

### 📅 Event Management

- Browse available events
- View detailed event information
- Admin event creation
- Admin event updates
- Admin event deletion
- Event capacity management
- AI-powered event description generation

### 📝 Event Registrations

- Register for events
- Prevent duplicate registrations
- Enforce event capacity
- View personal registrations
- Admin registration management
- Update registration status
- Cancel registrations without removing registration history

Supported registration statuses:

```text
pending
confirmed
cancelled
```

### 🤖 AI Event Descriptions

- Generate professional event descriptions using Google Gemini
- Uses `gemini-2.5-flash`
- Generated descriptions are saved directly to the event

### 📚 API Documentation

- Interactive Swagger/OpenAPI documentation
- OpenAPI 3.0.3 specification
- API documentation available directly from the running backend

### 🎨 Frontend

- React 18
- Vite
- Tailwind CSS v4
- React Router DOM
- Dark red/black UI
- Responsive interface
- Hand-built reusable components
- Toast notifications
- Protected routes
- Admin routes

---

# 🛠️ Tech Stack

## Frontend

- React 18
- Vite
- Tailwind CSS v4
- React Router DOM
- JavaScript
- Fetch API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Google Gemini API
- Swagger UI
- OpenAPI 3.0.3

---

# 📂 Project Structure

```text
event-api/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── validations/
│   ├── middlewares/
│   ├── utils/
│   ├── openapi.yaml
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   └── layout/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   └── admin/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── package.json
├── package-lock.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js v18+
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key
- Git

---

# 📥 Installation

Clone the repository:

```bash
git clone https://github.com/abmdevx/event-api.git
```

Navigate into the project:

```bash
cd event-api
```

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Return to the root directory:

```bash
cd ..
```

---

# 🔐 Environment Variables

The backend and frontend use separate environment files.

## Backend

Create:

```text
backend/.env
```

Add:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

GEMINI_API_KEY=your_gemini_api_key
```

The backend runs by default at:

```text
http://localhost:8000
```

API base URL:

```text
http://localhost:8000/api/v1
```

---

## Frontend

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

The frontend runs by default at:

```text
http://localhost:5173
```

The backend CORS configuration expects this frontend origin.

---

# ▶️ Running the Application

The root project uses `concurrently` to run both the frontend and backend development servers at the same time.

From the root directory:

```bash
npm run dev
```

This starts:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:8000
```

You can therefore run the entire application using a single command.

---

# 📜 Root Scripts

The root `package.json` uses the following development script:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  }
}
```

Install `concurrently` in the root project if it is not already installed:

```bash
npm install -D concurrently
```

---

# 🔌 API

The backend API is available under:

```text
http://localhost:8000/api/v1
```

---

## Health

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Check server status |

---

# 👤 Users API

## Public

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/create-user` | Register a new user |
| POST | `/users/login-user` | Login user |
| POST | `/users/refresh-access-token` | Refresh access token |

## Protected

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/logout-user` | Logout current user |
| PATCH | `/users/update-user/:id` | Update user profile |
| PATCH | `/users/change-password` | Change password |
| DELETE | `/users/delete-user/:id` | Delete user account |

## Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/get-all-users` | Get all users |
| GET | `/users/get-current-user` | Get current authenticated user |

---

# 📅 Events API

## Protected

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events/get-all-events` | Get all events |
| GET | `/events/get-event-id/:id` | Get event by ID |

## Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/events/create-event` | Create event |
| PUT | `/events/update-event/:id` | Update event |
| DELETE | `/events/delete-event/:id` | Delete event |
| POST | `/events/generate-description/:id` | Generate AI event description |

---

# 📝 Registrations API

All registration endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/registrations/create-registration` | Register for an event |
| PUT | `/registrations/update-registration/:id` | Update registration status |
| DELETE | `/registrations/delete-registration/:id` | Delete registration |
| GET | `/registrations/get-registration-id/:id` | Get registration by ID |
| GET | `/registrations/get-my-registrations` | Get current user's registrations |
| GET | `/registrations/get-all-registrations` | Get all registrations |

---

# 🔑 Authentication

Protected API endpoints require a valid JWT access token.

The frontend sends the token using:

```http
Authorization: Bearer <access_token>
```

After login, the frontend stores the returned access token in `localStorage` and automatically attaches it to authenticated API requests.

Admin routes additionally require the authenticated user to have:

```text
role: "admin"
```

---

# 🤖 AI Description Generation

Eventra integrates Google Gemini to generate professional event descriptions.

The frontend provides a **Generate with AI** button inside the admin event form.

The request is sent to:

```http
POST /api/v1/events/generate-description/:id
```

The backend uses:

```text
gemini-2.5-flash
```

The generated description is saved directly to the corresponding event.

The event must already exist before an AI description can be generated because the endpoint requires an existing event ID.

---

# 🎨 Frontend Architecture

The frontend is built with React and Vite.

```text
frontend/src/
│
├── components/
│   ├── shared/
│   │   ├── Button
│   │   ├── Input
│   │   ├── Card
│   │   ├── Modal
│   │   ├── Badge
│   │   ├── EventCard
│   │   └── Icons
│   │
│   └── layout/
│       ├── Navbar
│       ├── AppLayout
│       ├── ProtectedRoute
│       └── AdminRoute
│
├── context/
│   ├── AuthContext
│   └── ToastContext
│
├── lib/
│   ├── api.js
│   ├── endpoints.js
│   └── format.js
│
└── pages/
    ├── auth/
    ├── admin/
    ├── Home.jsx
    ├── Events.jsx
    ├── EventDetail.jsx
    ├── MyRegistrations.jsx
    ├── Profile.jsx
    └── NotFound.jsx
```

The frontend does not use Axios or a UI component library.

API communication is handled using the native `fetch` API, while reusable UI components are built within the project.

---

# 📚 Swagger API Documentation

Once the backend is running, interactive API documentation is available at:

```text
http://localhost:8000/api-docs
```

The API specification follows:

```text
OpenAPI 3.0.3
```

---

# 🔄 Application Architecture

```text
                    ┌─────────────────────┐
                    │      Eventra UI     │
                    │     React + Vite    │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌─────────────────────┐
                    │     Express API     │
                    │       Node.js       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │  MongoDB   │ │  Gemini AI │ │    JWT     │
          │            │ │            │ │    Auth    │
          └────────────┘ └────────────┘ └────────────┘
```

---

# 🧪 Development

You can run the complete application from the root:

```bash
npm run dev
```

Or run each application independently.

## Backend

```bash
cd backend
npm run dev
```

## Frontend

```bash
cd frontend
npm run dev
```

---

# 🔒 Security

Do not commit environment files containing secrets.

Make sure the following are included in `.gitignore`:

```text
.env
.env.local
.env.*.local
node_modules/
```

Never expose or commit:

- MongoDB credentials
- JWT secrets
- Gemini API keys
- Private API credentials
- Other sensitive environment variables

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test both the frontend and backend.
5. Commit your changes.

```bash
git add .
git commit -m "feat: add your feature"
```

6. Push the branch.

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

# 📄 License

This project is currently available for development and educational purposes.