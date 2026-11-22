import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analyticsGenerator";
import userModel from "../models/userModel";
import CourseModel from "../models/courseModel";
import OrderModel from "../models/orderModel";

// Get users analytics --- only for admin
export const getUsersAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(userModel);
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get courses analytics --- only for admin
export const getCoursesAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(CourseModel);
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get orders analytics --- only for admin
export const getOrdersAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModel);
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get platform overview telemetry --- only for admin
export const getAnalyticsOverview = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [
        totalUsers,
        totalAdmins,
        totalCourses,
        totalOrders,
        usersAnalytics,
        coursesAnalytics,
        ordersAnalytics,
        coursesList,
      ] = await Promise.all([
        userModel.countDocuments(),
        userModel.countDocuments({ role: "admin" }),
        CourseModel.countDocuments(),
        OrderModel.countDocuments(),
        generateLast12MonthsData(userModel),
        generateLast12MonthsData(CourseModel),
        generateLast12MonthsData(OrderModel),
        CourseModel.find({}, { name: 1, price: 1, purchased: 1, level: 1, tags: 1 }),
      ]);

      // Calculate approximate gross revenue from courses purchased
      const totalRevenue = coursesList.reduce(
        (sum, course) => sum + (course.price || 0) * (course.purchased || 0),
        0
      );

      // Level breakdown
      const levelBreakdown = coursesList.reduce((acc: any, c: any) => {
        const lvl = c.level || "All Levels";
        acc[lvl] = (acc[lvl] || 0) + 1;
        return acc;
      }, {});

      // Tag / Category breakdown
      const categoryBreakdown = coursesList.reduce((acc: any, c: any) => {
        const cat = c.tags || "General";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        overview: {
          totalUsers,
          totalAdmins,
          totalStudents: Math.max(0, totalUsers - totalAdmins),
          totalCourses,
          totalOrders,
          totalRevenue,
          levelBreakdown,
          categoryBreakdown,
          users: usersAnalytics,
          courses: coursesAnalytics,
          orders: ordersAnalytics,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
