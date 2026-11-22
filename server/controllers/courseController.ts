import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/courseModel";
import OrderModel from "../models/orderModel";
import NotificationModel from "../models/notificationModel";
import { redis } from "../utils/redis";

// Create course
export const createCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const course = await CourseModel.create(data);

      try {
        await redis.del("allCourses");
      } catch (_) {}

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit course
export const editCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id as string;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      try {
        await redis.del("allCourses");
        await redis.del(courseId);
      } catch (_) {}

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get single course (public view - without sensitive video URLs)
export const getSingleCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id as string;

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      // Check if ID is a valid MongoDB ObjectId or fallback demo ID
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(200).json({
          success: true,
          course: null,
          message: "Demo or non-database course",
        });
      }

      let course: any = null;
      try {
        const cached = await redis.get(courseId);
        if (cached) {
          course = JSON.parse(cached);
        }
      } catch (_) {}

      if (!course) {
        course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        if (course) {
          try {
            await redis.set(courseId, JSON.stringify(course), "EX", 604800);
          } catch (_) {}
        }
      }

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all courses (public catalog)
export const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let courses: any = null;
      try {
        const cached = await redis.get("allCourses");
        if (cached) {
          courses = JSON.parse(cached);
        }
      } catch (_) {}

      if (!courses) {
        courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        try {
          await redis.set("allCourses", JSON.stringify(courses));
        } catch (_) {}
      }

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get course content for enrolled students
export const getCourseByUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses || [];
      const courseId = req.params.id as string;

      const courseExists = userCourseList.find(
        (c: any) =>
          c.courseId === courseId ||
          c._id === courseId ||
          c.courseId?.toString() === courseId ||
          c._id?.toString() === courseId ||
          c?.toString() === courseId
      );

      let hasOrder = false;
      if (!courseExists && req.user?._id) {
        const order = await OrderModel.findOne({
          courseId,
          userId: req.user._id.toString(),
        });
        if (order) {
          hasOrder = true;
        }
      }

      // Allow admin or enrolled users
      if (!courseExists && !hasOrder && req.user?.role !== "admin") {
        return next(
          new ErrorHandler("You are not eligible to access this course", 403)
        );
      }

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
        courseName: course?.name,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete course (Admin only)
export const deleteCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne();

      try {
        await redis.del("allCourses");
        await redis.del(id);
      } catch (_) {}

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete a specific course module / lecture (Admin only)
export const deleteCourseModule = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = String(req.params.courseId);
      const moduleId = String(req.params.moduleId);

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const initialCount = course.courseData?.length || 0;
      course.courseData = (course.courseData || []).filter(
        (item: any) => item._id?.toString() !== moduleId
      );

      if (course.courseData.length === initialCount) {
        return next(new ErrorHandler("Course module not found in this course", 404));
      }

      await course.save();

      try {
        await redis.del("allCourses");
        await redis.del(courseId);
      } catch (_) {}

      res.status(200).json({
        success: true,
        message: "Course module deleted successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Add review to course
interface IAddReviewData {
  review: string;
  rating: number;
}

export const addReview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id as string;

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      // Check if user is enrolled or is admin
      const isEnrolled =
        userCourseList?.some(
          (course: any) =>
            course.courseId === courseId ||
            course._id?.toString() === courseId ||
            course.id === courseId
        ) || req.user?.role === "admin";

      if (!isEnrolled) {
        return next(
          new ErrorHandler("You are not eligible to review this course without enrollment", 403)
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const { review, rating } = req.body as IAddReviewData;
      if (!review) {
        return next(new ErrorHandler("Review comment is required", 400));
      }

      const reviewData: any = {
        user: {
          _id: req.user?._id,
          name: req.user?.name || "Anonymous Learner",
          email: req.user?.email,
          avatar: req.user?.avatar,
        },
        rating: Number(rating) || 5,
        comment: review.trim(),
      };

      course.reviews = course.reviews || [];
      course.reviews.push(reviewData);

      // Recalculate average rating
      let totalRating = 0;
      course.reviews.forEach((rev: any) => {
        totalRating += rev.rating;
      });
      course.ratings = Number((totalRating / course.reviews.length).toFixed(1));

      await course.save();

      // Invalidate course caches
      try {
        await redis.del(courseId);
        await redis.del("allCourses");
      } catch (_) {}

      // Create Admin Notification
      try {
        await NotificationModel.create({
          title: "New Review Added",
          message: `${req.user?.name || "A learner"} added a ${rating || 5}-star review on "${course.name}"`,
          status: "unread",
          userId: req.user?._id?.toString(),
        });
      } catch (_) {}

      res.status(200).json({
        success: true,
        course,
        message: "Review added successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all reviews across all published courses
export const getAllPlatformReviews = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find({}, { name: 1, reviews: 1, ratings: 1 });
      const reviews: any[] = [];

      courses.forEach((c) => {
        if (c.reviews && c.reviews.length > 0) {
          c.reviews.forEach((r: any) => {
            const revObj = r.toObject ? r.toObject() : r;
            reviews.push({
              ...revObj,
              courseName: c.name,
              courseId: c._id,
            });
          });
        }
      });

      // Sort by newest
      reviews.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

