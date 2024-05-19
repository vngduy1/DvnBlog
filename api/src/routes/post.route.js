import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  editPosts,
  deletePosts,
} from "../app/controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/get-posts", getPosts);
router.post("/edit-post/:postId/:userId", editPosts);
router.delete("/delete-post/:postId/:userId", verifyToken, deletePosts);

export default router;
