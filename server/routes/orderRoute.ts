import express from "express";
import { createOrder, getAllOrders } from "../controllers/orderController";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/enroll/:courseId", isAuthenticated, createOrder);
router.get("/get-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

export default router;
