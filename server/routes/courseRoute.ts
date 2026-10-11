import express from "express";
import {
  createCourse,
  editCourse,
  getSingleCourse,
  getAllCourses,
  getCourseByUser,
} from "../controllers/courseController";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/create-course", isAuthenticated, authorizeRoles("admin"), createCourse);
router.put("/edit-course/:id", isAuthenticated, authorizeRoles("admin"), editCourse);
router.get("/get-course/:id", getSingleCourse);
router.get("/get-courses", getAllCourses);
router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

export default router;
