// import express from "express";

// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   refreshUserToken,
// } from "../controllers/user.controllers/auth.user.controller.js";
// import {
//   getUsers,
//   getUser,
//   updateUser,
//   deleteUser,
//   getActivities
// } from "../controllers/user.controllers/admin.user.controller.js";

// import {
//   getInvites,
//   addInvite,
//   updateInvite,
//   deleteInvite,
// } from "../controllers/user.controllers/invite.user.controller.js";

// import {
//   getUserProfile,
//   updateUserProfile,
//   changeUserPassword,
//   deleteUserProfile,
// } from "../controllers/user.controllers/profile.user.controller.js";

// import {
//   checkInvitation,
//   authenticate,
//   authorizeRole,
//   verifyRefreshToken,
// } from "../middlewares/auth.middleware.js";
// import { getBootstrapData } from "../controllers/user.controllers/bootstrap.controller.js";

// const router = express.Router();

// // Auth routes
// router.post("/register", checkInvitation, registerUser);
// router.post("/login", loginUser);
// router.get("/logout", authenticate, logoutUser);
// router.get("/reset-token", verifyRefreshToken, refreshUserToken);

// // Bootstrap
// router.get("/bootstrap", authenticate, authorizeRole(["admin", "moderator", "editor"]), getBootstrapData );

// // User self-service
// router.get("/profile", authenticate, authorizeRole(["admin","moderator","editor"]), getUserProfile);
// router.put("/profile", authenticate, authorizeRole(["admin","moderator","editor"]), updateUserProfile);
// router.put("/profile/password", authenticate, authorizeRole(["admin","moderator","editor"]), changeUserPassword);
// router.delete("/profile", authenticate, authorizeRole(["admin","moderator","editor"]), deleteUserProfile);

// // Activities
// router.get("/activities", authenticate, authorizeRole(["admin", "moderator", "editor"]), getActivities);

// // ADMIN
// // Invites
// router.get("/invites", authenticate, authorizeRole(["admin"]), getInvites);
// router.post("/invites", authenticate, authorizeRole(["admin"]), addInvite);
// router.put("/invites", authenticate, authorizeRole(["admin"]), updateInvite);
// router.delete("/invites/:email", authenticate, authorizeRole(["admin"]), deleteInvite);

// // User
// router.get("/", authenticate, authorizeRole(["admin"]), getUsers);
// router.put("/", authenticate, authorizeRole(["admin"]), updateUser);
// router.get("/:id", authenticate, authorizeRole(["admin"]), getUser);
// router.delete("/:id", authenticate, authorizeRole(["admin"]), deleteUser);


// export default router;

import express from "express";

import authRoutes from "./user/auth.routes.js";
import profileRoutes from "./user/profile.routes.js";
import adminRoutes from "./user/admin.routes.js";
import inviteRoutes from "./user/invites.routes.js";
import { getActivities } from "../controllers/user.controllers/admin.user.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

const allowedRoles = ["admin", "moderator", "editor"];

router.get("/activities", authenticate, authorizeRole(allowedRoles), getActivities);

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/admin", adminRoutes);
router.use("/invites", inviteRoutes);

export default router;
