import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserProfile,
} from "../../controllers/user.controllers/profile.user.controller.js";
import {
  authenticate,
  authorizeRole,
} from "../../middlewares/auth.middleware.js";
import { getBootstrapData } from "../../controllers/user.controllers/bootstrap.controller.js";

const router = express.Router();

const allowedRoles = ["admin", "moderator", "editor"];

router.get("/", authenticate, authorizeRole(allowedRoles), getUserProfile);
router.put("/", authenticate, authorizeRole(allowedRoles), updateUserProfile);
router.put("/password", authenticate, authorizeRole(allowedRoles), changeUserPassword);
router.delete("/", authenticate, authorizeRole(allowedRoles), deleteUserProfile);
router.get("/bootstrap", authenticate, authorizeRole(allowedRoles), getBootstrapData);

export default router;
