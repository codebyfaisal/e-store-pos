import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getActivities,
} from "../../controllers/user.controllers/admin.user.controller.js";
import {
  authenticate,
  authorizeRole,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

const adminOnly = ["admin"];

// Users management
router.get("/", authenticate, authorizeRole(adminOnly), getUsers);
router.put("/", authenticate, authorizeRole(adminOnly), updateUser);
router.get("/:id", authenticate, authorizeRole(adminOnly), getUser);
router.delete("/:id", authenticate, authorizeRole(adminOnly), deleteUser);

export default router;
