import express from "express";
import {
  getBrands,
  insertBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Editor
router.get("/", authorizeRole(["admin", "editor"]), getBrands);
router.post("/", authorizeRole(["admin", "editor"]), insertBrand);
router.put("/", authorizeRole(["admin", "editor"]), updateBrand);
router.delete("/:id", authorizeRole(["admin", "editor"]), deleteBrand);

export default router;
