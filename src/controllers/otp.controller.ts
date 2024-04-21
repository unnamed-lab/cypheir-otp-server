import express from "express";
import { HOTP, FuseHash } from "../utils/generators";
import { credValidator } from "../utils/validator";

require("dotenv").config();

const getOTPClient = (req: any, res: any): void => {};

const createOTP = (req: any, res: any): void => {
  const OTP = HOTP("unnamed", 6, { type: "alphanumeric" });

  const validator = credValidator("hi", "hi", () => {
    return "Callback function works!";
  });

  console.log(`OTP code: ${OTP}`);
  console.log(validator);

  res.status(200).send(`OTP code: ${OTP}`);
};

const verifyOTP = (req: any, res: any): void => {};

export { getOTPClient, createOTP, verifyOTP };
