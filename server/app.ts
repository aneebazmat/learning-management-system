import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error";
import userRoutes from "./routes/userRoute";
import courseRoutes from "./routes/courseRoute";

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

// Testing route to verify that the server is running
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is running!" });
});

// Mount API routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);

// Unknown route handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);
