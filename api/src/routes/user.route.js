import express from "express";
import { getUser, updateUser } from "../app/controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/getUser/:userId", verifyToken, getUser);
router.put("/update/:userId", verifyToken, updateUser);

export default router;
