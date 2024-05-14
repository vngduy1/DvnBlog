import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../app/controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/getUser/:userId", verifyToken, getUser);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
