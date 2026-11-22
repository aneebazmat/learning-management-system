import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/orderModel";
import CourseModel from "../models/courseModel";
import User from "../models/userModel";
import NotificationModel from "../models/notificationModel";
import { redis } from "../utils/redis";

// Create / process course enrollment
export const createOrder = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.body?.courseId || req.params?.courseId;
      const userId = req.user?._id;

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required for enrollment", 400));
      }

      if (!userId) {
        return next(new ErrorHandler("Please login to enroll in this course", 401));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if user is already enrolled
      const isAlreadyEnrolled = user.courses.some(
        (c: any) => c.courseId === courseId || c._id?.toString() === courseId
      );

      if (isAlreadyEnrolled) {
        return res.status(200).json({
          success: true,
          message: "You are already enrolled in this course",
          courseId,
          user,
        });
      }

      // Add course to user's enrolled courses list
      user.courses.push({ courseId });
      await user.save();

      // Create order entry
      const order = await OrderModel.create({
        courseId,
        userId: user._id.toString(),
        payment_info: req.body?.payment_info || {
          status: "completed",
          method: "direct_enrollment",
          date: new Date(),
        },
      });

      // Increment course purchased counter
      course.purchased = (course.purchased || 0) + 1;
      await course.save();

      // Create Admin Notification
      try {
        await NotificationModel.create({
          title: "New Enrollment",
          message: `${user.name || user.email} enrolled in "${course.name}"`,
          status: "unread",
          userId: user._id.toString(),
        });
      } catch (_) {}

      // Invalidate caches
      try {
        await redis.set(user._id.toString(), JSON.stringify(user));
        await redis.del("allCourses");
        await redis.del(courseId);
      } catch (_) {}

      res.status(201).json({
        success: true,
        order,
        user,
        message: `Successfully enrolled in ${course.name}!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all orders (Admin only)
export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
