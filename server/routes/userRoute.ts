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
} from "../controllers/userController";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/activate", activateUser);
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, logoutUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/me", isAuthenticated, getUserInfo);
router.put("/update-user-info", isAuthenticated, updateUserInfo);
router.put("/update-user-password", isAuthenticated, updatePassword);
router.put("/update-user-avatar", isAuthenticated, updateProfilePicture);

export default router;