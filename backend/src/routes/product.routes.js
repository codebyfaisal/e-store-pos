import express from "express";
import {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  getProductMeta,
} from "../controllers/products.controller.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin, Editor
router.get("/", authorizeRole(["admin", "editor"]), getProducts);
router.get("/meta", authorizeRole(["admin", "editor"]), getProductMeta);
router.get("/:id", authorizeRole(["admin", "editor"]), getProduct);
router.post("/", authorizeRole(["admin", "editor"]), insertProduct);
router.put("/", authorizeRole(["admin", "editor"]), updateProduct);
router.delete("/:id", authorizeRole(["admin", "editor"]), deleteProduct);

export default router;
