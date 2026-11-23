import "dotenv/config";
import { app } from "./app";
import connectDB from "./utils/db";

const PORT = process.env.PORT || 5000;

// Create a server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});