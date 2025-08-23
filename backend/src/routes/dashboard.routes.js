import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Moderator, Editor
router.get("/", authorizeRole(["admin", "moderator", "editor"]), getDashboardData);

export default router;
