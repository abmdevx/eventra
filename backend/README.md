# Eventra Backend

The backend is the Eventra REST API. It provides authentication, event
management, registrations, admin operations, and AI-generated event
descriptions. Admins can also register for events as participants.

## Stack

- Node.js with native ES modules
- Express
- MongoDB with Mongoose
- JWT and bcryptjs authentication
- Zod request validation
- Swagger UI and OpenAPI 3.0.3
- Google Gemini API

## Setup

From the repository root:

```bash
npm install --prefix backend
```

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

`MONGO_URI`, both token secrets, and their expiry values are required for the
corresponding features. `GEMINI_API_KEY` is required for AI description
generation. Keep `.env` out of version control.

## Run the API

```bash
# Development server with nodemon
npm run dev

# Production-style Node process
npm start
```

The API listens on `http://localhost:8000` by default. The port can be changed
with `PORT`.

## API documentation

Once the server is running, open <http://localhost:8000/api-docs> for the
interactive Swagger UI. The source specification is
[src/config/openapi.yaml](./src/config/openapi.yaml).

The API base URL is:

```text
http://localhost:8000/api/v1
```

## API overview

| Area | Examples |
| --- | --- |
| Health | `GET /health` |
| Public users | `POST /users/create-user`, `POST /users/login-user`, `POST /users/refresh-access-token` |
| Protected users | `GET /users/logout-user`, `PATCH /users/update-user/:id`, `PATCH /users/change-password`, `DELETE /users/delete-user/:id` |
| Admin users | `GET /users/get-all-users`, `GET /users/get-current-user` |
| Protected events | `GET /events/get-all-events`, `GET /events/get-event-id/:id` |
| Admin events | `POST /events/create-event`, `PUT /events/update-event/:id`, `DELETE /events/delete-event/:id` |
| AI descriptions | `POST /events/generate-description/:id` |
| Registrations | `POST /registrations/create-registration`, `GET /registrations/get-my-registrations` |
| Admin activity | `GET /registrations/get-all-registrations` (read-only overview of all users' registration records) |

Protected routes expect:

```text
Authorization: Bearer <access-token>
```

Refresh-token and logout flows also use cookies. The frontend sends requests
with credentials enabled.

## Source structure

```text
src/
├── app.js                 # Express middleware, routes, and Swagger UI
├── server.js              # Environment loading, database connection, and startup
├── config/
│   ├── db.js              # MongoDB connection
│   └── openapi.yaml       # OpenAPI specification
├── controllers/           # Request and response logic
├── middleware/            # Authentication, admin, and validation middleware
├── models/                # User, event, and registration schemas
├── routes/                # Route modules
├── utils/                 # API response/error, async, and Gemini helpers
└── validations/           # Zod request schemas
```

## Registration statuses

Registrations use the following statuses:

```text
pending
confirmed
cancelled
```

Cancelling a registration preserves its history instead of removing the
record. The admin activity endpoint exposes those registration records for
review; it is not an append-only audit log of every historical status change.
