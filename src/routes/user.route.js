import { Router } from "express";

// middlewares
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

// validations
import { createUserSchema, updateUserSchema, loginUserSchema, changePasswordSchema } from "../validations/user.validation.js";

import {
  getAllUsers, // ADMIN ACCESS ONLY
  getCurrentUser, //ADMIN ACCESS ONLY
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  changePassword,
  deleteUser,
  refreshAccessToken,  // BOTH USER AND ADMIN
} from "../controllers/user.controller.js";

const router = Router();

// TODO: Add auth/validation middleware before handlers

// Public Routes
router.route("/login-user").post(validate(loginUserSchema), loginUser);
router.route("/create-user").post(validate(createUserSchema), createUser);
router.route("/refresh-access-token").post(refreshAccessToken);

// Protected Routes
router.use(verifyJWT);

router.route("/logout-user").get(logoutUser);
router.route("/update-user/:id").patch(validate(updateUserSchema), updateUser);
router.route("/change-password").patch(validate(changePasswordSchema), changePassword);
router.route("/delete-user/:id").delete(deleteUser);

// Admin Routes
router.use(verifyAdmin); 
router.route("/get-all-users").get(getAllUsers);
router.route("/get-current-user").get(getCurrentUser);

export default router;
