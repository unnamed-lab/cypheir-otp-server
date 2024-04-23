import express from "express";
import { HOTP, FuseHash } from "../utils/generators";
import { credValidator } from "../utils/validator";
import { salt } from "../utils/hash";
import OTP from "../models/otp.model";
import Package from "../models/package.model";

require("dotenv").config();

const getOTPClient = async (req: any, res: any): Promise<void> => {
  await OTP.find({}, ["-package"], { sort: { _id: -1 } })
    .limit(10)
    .then((data: any) => {
      console.log(data);
      res.send(data);
    })
    .catch((error) => {
      console.error(error);
      res.send("No OTP record found");
    });
};

const createOTP = async (req: any, res: any): Promise<void> => {
  const { key, type, digits } = req.query;
  const OTPcode = HOTP(key, digits, { type: type }); // Create OTP code
  const hasedValue = salt(OTPcode, key); // Hashes OTP with credentials
  const packageId: any = (await Package.findOne({ key }))?._id; //  Get registered user package id
  const getCurrentTime = new Date().getTime() + 5 * 60 * 1000;
  const expiryDate = new Date(getCurrentTime); //  Adds 3 mins in milliseconds

  (
    await OTP.create({
      package: packageId,
      key: hasedValue,
      expiry: expiryDate,
    })
  )
    .save()
    .then((data) => {
      console.log(`OTP code: ${OTPcode}`);
      const id = String(data._id);
      res.status(200).send(id); // Send OTP to client
    })
    .catch((err) => {
      console.log(`Couldn't generate a OTP code (${Date.now()})`);
      console.log(err);
    });
};

const verifyOTP = async (req: any, res: any): Promise<void> => {
  const { otp, key } = req.query;
  const value = salt(otp, key);
  const serverKey = await OTP.findOne({ _id: key });

  if (serverKey) {
    const serverOTP = serverKey.key;
    const currentTime = new Date();
    const utcDate = new Date(currentTime.getTime()).getTime();
    const serverExpiry = Number(serverKey.expiry);

    if (serverKey.validation) return res.status(403).send("OTP already used");

    if (utcDate <= serverExpiry) {
      const validator = credValidator(value, serverOTP, async () => {
        await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: 0,
          validation: true,
        });
        return res.status(200).send("access granted");
      });

      if (!validator) {
        if (serverKey.attempts === 0)
          return res.status(403).send("OTP is no longer valid");

        return await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: serverKey.attempts - 1,
        }).then(() => res.status(404).send("Keys do not match"));
      }

      return validator;
    }

    return res.status(404).send("OTP has expired");
  }

  return res.status(404).send("OTP credentials not found");
};

export { getOTPClient, createOTP, verifyOTP };
