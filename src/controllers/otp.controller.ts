import express from "express";
import { HOTP, FuseHash } from "../utils/generators";
import { credValidator } from "../utils/validator";
import { salt } from "../utils/hash";
import OTP from "../models/otp.model";
import Package from "../models/package.model";

require("dotenv").config();

const getOTPClient = async (req: any, res: any): Promise<void> => {
  await OTP.find({}, ["-package"])
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
  const OTPcode = HOTP(key, digits, { type: type });
  console.log(`OTP code: ${OTPcode}`);

  const hasedValue = salt(OTPcode, key);
  const packageId: any = (await Package.findOne({ key }))?._id;
  (await OTP.create({ package: packageId, key: hasedValue }))
    .save()
    .then(() => {
      res.status(200).send(`OTP code: ${OTPcode}`); // Send OTP to client
    })
    .catch((err) => {
      console.log("Couldn't generate a OTP code");
      console.log(err);
    });
};

const verifyOTP = async (req: any, res: any): Promise<void> => {
  const { otp, key } = req.query;
  const value = salt(otp, key);
  const serverKey = await OTP.findOne({ package: key });

  if (!serverKey) console.error("OTP credentials not found");
  else {
    const serverOTP = serverKey.key;
    const currentTime = Date.now();
    console.log(
      "Current timestamp: " + currentTime,
      "Expiry Time: " + serverKey.expiry
    );

    if (Number(serverKey.expiry) <= currentTime) {
      const validator = credValidator(value, serverOTP, async () => {
        await OTP.findByIdAndUpdate(serverKey._id, { validation: true });
        return res.send("access granted");
      });

      console.log(validator);

      if (!validator && serverKey.attempts > 0) {
        await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: serverKey.attempts - 1,
        });
        return res.sendStatus(404).send("Keys do not match");
      }
    }
  }
};

export { getOTPClient, createOTP, verifyOTP };
