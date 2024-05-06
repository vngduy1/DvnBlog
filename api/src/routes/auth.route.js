import express from "express";
import { signUpFunc, signInFunc } from "../app/controllers/authController.js";

const router = express.Router();

router.post("/sign-up", signUpFunc);
router.post("/sign-in", signInFunc);

export default router;
