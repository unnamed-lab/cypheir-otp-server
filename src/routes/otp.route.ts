import express from "express";
import {
  confirmOTP,
  createOTP,
  getOTPClient,
  verifyOTP,
} from "../controllers/otp.controller";
const router = express.Router();
router.get("/", getOTPClient);

router.post("/verify", verifyOTP);

router.post("/create", createOTP);

router.get("/check", confirmOTP);

export = router;
