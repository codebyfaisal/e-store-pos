import express from "express";
import { getSalesReturns } from "../controllers/salesReturns.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Moderator, Editor
router.get("/", authorizeRole(["admin", "moderator", "editor"]), getSalesReturns);

export default router;
