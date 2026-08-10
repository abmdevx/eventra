import { Router } from "express";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

// validations
import { createEventSchema, updateEventSchema } from "../validations/event.validation.js";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  writeEventMessage
} from "../controllers/event.controller.js";

const router = Router();
// TODO: Add auth/validation middleware before handlers

router.use(verifyJWT);

router.route("/get-all-events").get(getAllEvents);
router.route("/get-event-id/:id").get(getEventById);

router.use(verifyAdmin);
router.route("/create-event").post(validate(createEventSchema), createEvent);
router.route("/update-event/:id").put(validate(updateEventSchema), updateEvent);
router.route("/delete-event/:id").delete(deleteEvent);
router.route("/generate-description/:id").post(writeEventMessage)

export default router;
