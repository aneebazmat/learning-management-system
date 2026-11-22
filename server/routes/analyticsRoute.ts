import express from "express";
import {
  getUsersAnalytics,
  getCoursesAnalytics,
  getOrdersAnalytics,
  getAnalyticsOverview,
} from "../controllers/analyticsController";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.get("/users", isAuthenticated, authorizeRoles("admin"), getUsersAnalytics);
router.get("/get-users-analytics", isAuthenticated, authorizeRoles("admin"), getUsersAnalytics);

router.get("/courses", isAuthenticated, authorizeRoles("admin"), getCoursesAnalytics);
router.get("/get-courses-analytics", isAuthenticated, authorizeRoles("admin"), getCoursesAnalytics);

router.get("/orders", isAuthenticated, authorizeRoles("admin"), getOrdersAnalytics);
router.get("/get-orders-analytics", isAuthenticated, authorizeRoles("admin"), getOrdersAnalytics);

router.get("/overview", isAuthenticated, authorizeRoles("admin"), getAnalyticsOverview);

export default router;
