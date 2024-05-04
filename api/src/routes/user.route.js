import express from "express";
import { testUser } from "../app/controllers/userController.js";

const router = express.Router();

router.get("/", testUser);

export default router;
