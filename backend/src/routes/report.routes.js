import express from "express";
import {
  getSalesReports,
  getInventoryReports,
  getProfitLossReport,
  getAnnualReport,
} from "../controllers/reports.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Moderator
router.get("/sales", authorizeRole(["admin", "moderator"]), getSalesReports);
router.get("/inventory", authorizeRole(["admin", "moderator"]), getInventoryReports);
router.get("/profit-loss", authorizeRole(["admin", "moderator"]), getProfitLossReport);
router.get("/annual", authorizeRole(["admin", "moderator"]), getAnnualReport);

export default router;
