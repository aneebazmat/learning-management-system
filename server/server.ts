import "dotenv/config";
import { app } from "./app";
import connectDB from "./utils/db";

// Global process exception guards to guarantee service uptime on cloud hosting
process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught Exception:", err?.message || err);
});

process.on("unhandledRejection", (err: any) => {
  console.error("[server] Unhandled Rejection:", err?.message || err);
});

const PORT = process.env.PORT || 5000;

// Create a server and listen explicitly on IPv4 0.0.0.0 to prevent IPv6 binding issues
const server = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`[server] Server is running on http://0.0.0.0:${PORT}`);
  connectDB().catch((err) => console.error("[server] Initial DB connect error:", err?.message || err));
});

export default server;