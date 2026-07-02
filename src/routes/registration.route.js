import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  getAllRegistrations,
  getRegistrationById,
  getMyRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from "../controllers/registration.controller.js";

// validations
import { createRegistrationSchema, updateRegistrationSchema } from "../validations/registration.validation.js";

import { Router } from "express";
// TODO: Add auth/validation middleware before handlers
const router = Router();

router.use(verifyJWT);

router.route("/create-registration").post(validate(createRegistrationSchema), createRegistration);
router.route("/update-registration/:id").put(validate(updateRegistrationSchema), updateRegistration);
router.route("/delete-registration/:id").delete(deleteRegistration);
router.route("/get-registration-id/:id").get(getRegistrationById);
router.route("/get-my-registrations").get(getMyRegistrations);

router.use(verifyAdmin)
router.route("/get-all-registrations").get(getAllRegistrations);

export default router;
