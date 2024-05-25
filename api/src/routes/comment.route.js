import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
} from "../app/controllers/commentController.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/get-post-comments/:postId", getPostComments);

export default router;
