import express from "express";
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notificationController";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.get("/get-all-notifications", isAuthenticated, authorizeRoles("admin"), getNotifications);
router.get("/", isAuthenticated, authorizeRoles("admin"), getNotifications);
router.put("/update-notification/:id", isAuthenticated, authorizeRoles("admin"), updateNotificationStatus);

export default router;
