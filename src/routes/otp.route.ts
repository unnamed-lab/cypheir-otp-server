import express from "express";
import {
  createOTP,
  getOTPClient,
  verifyOTP,
} from "../controllers/otp.controller";
const router = express.Router();
const { HOTP, FuseHash } = require("../utils/generators");
const { credValidator } = require("../utils/validator");

router.get("/", getOTPClient);

router.post("/create", createOTP);

export = router;
