import express from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  signOut,
  getUserById,
} from "../app/controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/getUser/:userId", verifyToken, getUser);
router.get("/get-users", verifyToken, getUsers);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/sign-out", verifyToken, signOut);
router.get("/:userId", getUserById);

export default router;
