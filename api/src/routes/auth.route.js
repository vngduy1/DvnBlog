import express from "express";
import {
  signUpFunc,
  signInFunc,
  googleOauth,
} from "../app/controllers/authController.js";

const router = express.Router();

router.post("/sign-up", signUpFunc);
router.post("/sign-in", signInFunc);
router.post("/google", googleOauth);

export default router;
