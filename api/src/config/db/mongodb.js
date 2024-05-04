import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connect DB successfully!!!");
  } catch (error) {
    console.log("connect DB fail");
    console.log(error.message);
  }
}
