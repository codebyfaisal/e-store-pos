import express from "express";
import { getOrders, updateOrder } from "../controllers/orders.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Moderator, Editor
router.get("/", authorizeRole(["admin", "moderator", "editor"]), getOrders);
router.put("/", authorizeRole(["admin", "moderator", "editor"]), updateOrder);

export default router;
