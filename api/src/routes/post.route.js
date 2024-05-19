import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts } from "../app/controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/get-posts", getPosts);

export default router;
