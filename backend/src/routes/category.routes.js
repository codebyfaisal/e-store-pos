import express from "express";

import {
  getCategories,
  insertCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Editor
router.get("/", authorizeRole(["admin", "editor"]), getCategories);
router.post("/", authorizeRole(["admin", "editor"]), insertCategory);
router.put("/", authorizeRole(["admin", "editor"]), updateCategory);
router.delete("/:id", authorizeRole(["admin", "editor"]), deleteCategory);

export default router;
