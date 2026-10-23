import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express"
import userRoute from "./routes/user.route.js";
import eventRoute from "./routes/event.route.js";
import registrationRoute from "./routes/registration.route.js";
import healthRoute from "./routes/health.route.js";

// swagger
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();

app.use(cors({
      origin: process.env.FRONT_END_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      maxAge: 86400
    })
);

app.use(express.json({
  limit: "16kb"
}));

app.use(express.urlencoded({
   extended: true,
   limit: "16kb"
}))

app.use(cookieParser());

// After your existing middleware setup (after cookieParser line)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = parse(
  readFileSync(join(__dirname, "./config/openapi.yaml"), "utf8")
);

// importing routes here
app.use("/api/v1/users", userRoute);
app.use("/api/v1/events", eventRoute);
app.use("/api/v1/registrations", registrationRoute);
app.use("/api/v1/health", healthRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
   res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || []
   });
});

export default app;

/*
app.js responsibility:
- middleware
- routes
- request handling
*/