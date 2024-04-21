import express from "express";
import { HOTP, FuseHash } from "../utils/generators";
import { credValidator } from "../utils/validator";
import { salt } from "../utils/hash";
import OTP from "../models/otp.model";

require("dotenv").config();

const getOTPClient = (req: any, res: any): void => {};

const createOTP = (req: any, res: any): void => {
  const { key, type, digits } = req.query;
  const OTP = HOTP(key, digits, { type: type });
  console.log(`OTP code: ${OTP}`);

  const hasedValue = salt(OTP, key);

  res.status(200).send(`OTP code: ${OTP}`);
};

const verifyOTP = async (req: any, res: any): Promise<void> => {
  const { otp, key } = req.query;
  const value = salt(otp, key);

  const serverKey = await OTP.findOne({ package: key });

  if (!serverKey) console.log("OTP credentials not found");
  else {
    const serverOTP = serverKey.key;

    const validator = credValidator(value, serverOTP, async () => {
      await OTP.findByIdAndUpdate(serverKey._id, { validation: true });
    });
    console.log(validator);

    if (!validator) {
      if (serverKey.attempts > 0)
        await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: serverKey.attempts - 1,
        });

      return res
        .sendStatus(404)
        .send("Keys do not match");
    }
  }
};

export { getOTPClient, createOTP, verifyOTP };
