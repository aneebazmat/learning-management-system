import express from "express";
import {
  registerUser,
  activateUser,
  loginUser,
  logoutUser,
  getUserInfo,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  socialAuth,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/activate", activateUser);
router.post("/login", loginUser);
router.post("/social-auth", socialAuth);
router.get("/logout", logoutUser);
router.post("/logout", logoutUser);
router.get("/me", isAuthenticated, getUserInfo);
router.put("/update-user-info", isAuthenticated, updateUserInfo);
router.put("/update-user-password", isAuthenticated, updatePassword);
router.put("/update-user-avatar", isAuthenticated, updateProfilePicture);

// Admin-only user management routes
router.get("/all-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.get("/get-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.put("/update-user-role", isAuthenticated, authorizeRoles("admin"), updateUserRole);
router.delete("/delete-user/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

export default router;
