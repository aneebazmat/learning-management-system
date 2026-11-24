import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorHandler from "./utils/ErrorHandler";
import errorHandler from "./middleware/error";
import userRoutes from "./routes/userRoute";
import courseRoutes from "./routes/courseRoute";
import orderRoutes from "./routes/orderRoute";
import analyticsRoutes from "./routes/analyticsRoute";
import notificationRoutes from "./routes/notificationRoute";

export const app = express();

// Middleware to parse JSON requests
app.use(express.json({ limit: "50mb" }));

// Middleware to handle body parsing for URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to handle cookie parsing
app.use(cookieParser());

// Robust CORS origins handling
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  ...(process.env.ORIGIN
    ? process.env.ORIGIN.replace(/[\[\]'"]/g, "")
        .split(",")
        .map((s) => s.trim())
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true,
  })
);

// Request logger for API calls
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/api/v1") || req.path === "/test") {
    console.log(`[server] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Testing route to verify that the server is running
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is running!" });
});

// Mount API routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1", analyticsRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1", notificationRoutes);

// Unknown route handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(`Not Found - ${req.originalUrl}`, 404);
  next(error);
});

app.use(errorHandler);
