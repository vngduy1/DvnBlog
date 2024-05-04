import express from "express";
import { connectDB } from "../src/config/db/mongodb.js";
import "dotenv/config";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(express.json());

//connect DB
connectDB();

const PORT = process.env.PORT || 3000;

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
