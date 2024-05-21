import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  updatePost,
  deletePosts,
} from "../app/controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/get-posts", getPosts);
router.put("/update-post/:postId/:userId", verifyToken, updatePost);
router.delete("/delete-post/:postId/:userId", verifyToken, deletePosts);

export default router;
