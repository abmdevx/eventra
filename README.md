# Event Registration System API

A REST API for managing events, user registrations, and admin operations built with the MERN stack (Node.js, Express, MongoDB). Includes JWT-based authentication with role-based access control, full Swagger/OpenAPI documentation, and an AI-powered event description generator using Google Gemini.

---

## ✨ Features

- 🔐 **JWT Authentication** — access + refresh token flow with secure cookie support
- 👥 **Role-Based Access Control** — public, protected (user), and admin-only routes
- 📅 **Event Management** — create, update, delete, and browse events
- 📝 **Event Registrations** — users can register for events and track registration status (`pending`, `confirmed`, `cancelled`)
- 🤖 **AI-Generated Descriptions** — auto-generate professional event descriptions using Gemini AI
- 📚 **Swagger UI Documentation** — fully interactive API docs (OpenAPI 3.0.3)
- ✅ **Health Check Endpoint** — quick server status check

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (Access + Refresh Tokens)
- **AI:** Google Gemini API (`gemini-2.5-flash`)
- **API Docs:** Swagger UI / OpenAPI 3.0.3

---

## 📂 Project Structure

```
├── controllers/     # Route handler logic
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
├── validations/     # Request validation schemas
├── middlewares/      # Auth (verifyJWT, verifyAdmin), error handling
├── utils/            # ApiError, ApiResponse, AsyncHandler helpers
├── openapi.yaml       # OpenAPI 3.0.3 spec (Swagger docs source)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/abmdevx/event-api.git
cd code-alpha-event-api
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
GEMINI_API_KEY=your_gemini_api_key
```

### Run the server

```bash
npm run dev
```

Server will start at `http://localhost:8000`

### API Documentation

Once running, view the interactive Swagger docs at:

```
http://localhost:8000/api-docs
```

---

## 📖 API Overview

Base URL: `http://localhost:8000/api/v1`

### Health

| Method | Endpoint  | Access | Description         |
|--------|-----------|--------|---------------------|
| GET    | `/health` | Public | Server health check |

### Users — Public

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| POST   | `/users/create-user`             | Register a new user                 |
| POST   | `/users/login-user`              | Login, receive access/refresh tokens|
| POST   | `/users/refresh-access-token`    | Refresh an expired access token     |

### Users — Protected (requires JWT)

| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | `/users/logout-user`            | Logout current user                  |
| PATCH  | `/users/update-user/:id`        | Update user profile                  |
| PATCH  | `/users/change-password`        | Change authenticated user's password |
| DELETE | `/users/delete-user/:id`        | Delete a user account                |

### Users — Admin (requires JWT + admin role)

| Method | Endpoint                   | Description                           |
|--------|----------------------------|--------------------------------------|
| GET    | `/users/get-all-users`     | List all users                       |
| GET    | `/users/get-current-user`  | Get currently authenticated user     |

### Events — Protected (requires JWT)

| Method | Endpoint                        | Description                |
|--------|---------------------------------|----------------------------|
| GET    | `/events/get-all-events`        | List all events            |
| GET    | `/events/get-event-id/:id`      | Get a single event by ID   |

### Events — Admin (requires JWT + admin role)

| Method | Endpoint                                  | Description                                        |
|--------|-------------------------------------------|----------------------------------------------------|
| POST   | `/events/create-event`                    | Create a new event                                 |
| PUT    | `/events/update-event/:id`                | Update an existing event                           |
| DELETE | `/events/delete-event/:id`                | Delete an event                                    |
| POST   | `/events/generate-description/:id`        | 🤖 Auto-generate an event description using Gemini AI |

### Registrations (requires JWT)

| Method | Endpoint                                          | Description                          |
|--------|---------------------------------------------------|--------------------------------------|
| POST   | `/registrations/create-registration`              | Register for an event                |
| PUT    | `/registrations/update-registration/:id`          | Update registration status           |
| DELETE | `/registrations/delete-registration/:id`          | Delete a registration                |
| GET    | `/registrations/get-registration-id/:id`          | Get a single registration by ID      |
| GET    | `/registrations/get-my-registrations`             | Get logged-in user's registrations   |
| GET    | `/registrations/get-all-registrations`            | Get all registrations of all users   |

---

## 🔑 Authentication

Protected and admin routes require a valid JWT sent as a Bearer token:

```
Authorization: Bearer <access_token>
```

Admin routes additionally require the authenticated user to have `role: "admin"`.

---

## 🤖 AI Description Generation

The `/events/generate-description/:id` endpoint uses Google's Gemini AI (`gemini-2.5-flash`) to generate a 20–30 word professional event description based on the event's title, then saves it directly to the event record.

---

## 🤝 Contributing

Contributions are always welcome!

If you'd like to improve this project, you can:

* Add a frontend for the API.
* Optimize the backend architecture or performance.
* Improve validation, security, or error handling.
* Add new features or API endpoints.
* Enhance the documentation or README.
* Report bugs or suggest improvements.

Feel free to fork the repository, create a new branch, and submit a pull request. All constructive contributions and feedback are appreciated.