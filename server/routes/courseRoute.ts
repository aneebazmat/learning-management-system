import express from "express";
import {
  createCourse,
  editCourse,
  getSingleCourse,
  getAllCourses,
  getCourseByUser,
  deleteCourse,
  deleteCourseModule,
  addReview,
  getAllPlatformReviews,
} from "../controllers/courseController";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post("/create-course", isAuthenticated, authorizeRoles("admin"), createCourse);
router.put("/edit-course/:id", isAuthenticated, authorizeRoles("admin"), editCourse);
router.put("/:id", isAuthenticated, authorizeRoles("admin"), editCourse);
router.get("/get-course/:id", getSingleCourse);
router.get("/get-courses", getAllCourses);
router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

// Dynamic reviews
router.put("/add-review/:id", isAuthenticated, addReview);
router.get("/all-reviews", getAllPlatformReviews);

// Admin deletion routes
router.delete("/delete-course/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse);
router.delete("/delete-module/:courseId/:moduleId", isAuthenticated, authorizeRoles("admin"), deleteCourseModule);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse);
router.delete("/:courseId/module/:moduleId", isAuthenticated, authorizeRoles("admin"), deleteCourseModule);

export default router;
