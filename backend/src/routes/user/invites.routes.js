import express from "express";
import {
  getInvites,
  addInvite,
  updateInvite,
  deleteInvite,
} from "../../controllers/user.controllers/invite.user.controller.js";
import {
  authenticate,
  authorizeRole,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

const adminOnly = ["admin"];

router.get("/", authenticate, authorizeRole(adminOnly), getInvites);
router.post("/", authenticate, authorizeRole(adminOnly), addInvite);
router.put("/", authenticate, authorizeRole(adminOnly), updateInvite);
router.delete("/:email", authenticate, authorizeRole(adminOnly), deleteInvite);

export default router;
