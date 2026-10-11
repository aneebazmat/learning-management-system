import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/courseModel";
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
        (c: any) => c.courseId === courseId || c._id === courseId
      );

      // Allow admin or enrolled users
      if (!courseExists && req.user?.role !== "admin") {
        return next(
          new ErrorHandler("You are not eligible to access this course", 403)
        );
      }

      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
