import express from "express";
import {
  getCustomers,
  getCustomer,
  insertCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin
router.get("/", authorizeRole(["admin"]), getCustomers);
router.get("/:id", authorizeRole(["admin"]), getCustomer);
router.post("/", authorizeRole(["admin"]), insertCustomer);
router.put("/:id", authorizeRole(["admin"]), updateCustomer);
router.delete("/:id", authorizeRole(["admin"]), deleteCustomer);

export default router;
