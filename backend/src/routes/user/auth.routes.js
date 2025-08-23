import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserToken,
} from "../../controllers/user.controllers/auth.user.controller.js";
import {
  checkInvitation,
  authenticate,
  verifyRefreshToken,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", checkInvitation, registerUser);
router.post("/login", loginUser);
router.get("/logout", authenticate, logoutUser);
router.get("/reset-token", verifyRefreshToken, refreshUserToken);

export default router;
