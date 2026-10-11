import express from "express";
import { registerUser, activateUser, loginUser, logoutUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/activate", activateUser);
router.post("/login", loginUser);
router.post


export default router;