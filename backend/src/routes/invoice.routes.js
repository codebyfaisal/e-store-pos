import express from "express";
import {
  getInvoices,
  getInvoiceDetails,
  getInvoicePdf,
} from "../controllers/invoice.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Moderator
router.get("/", authorizeRole(["admin", "moderator"]), getInvoices);
router.get("/:id", authorizeRole(["admin", "moderator"]),getInvoiceDetails);
router.get("/:id/pdf", authorizeRole(["admin", "moderator"]),getInvoicePdf);

export default router;
