import express from "express";
import {
  createOTP,
  getOTPClient,
  verifyOTP,
} from "../controllers/otp.controller";
const router = express.Router();
router.get("/", getOTPClient);

router.post("/verify", verifyOTP);

router.post("/create", createOTP);

export = router;
