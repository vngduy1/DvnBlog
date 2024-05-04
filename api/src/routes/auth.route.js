import express from "express";
import { signUpFunc } from "../app/controllers/authController.js";

const router = express.Router();

router.post("/sign-up", signUpFunc);

export default router;
