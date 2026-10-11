import {app} from "./app";
import connectDB from "./utils/db";
require("dotenv").config();

// Create a server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});