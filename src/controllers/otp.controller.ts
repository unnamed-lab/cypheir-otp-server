import express from "express";
import { HOTP, FuseHash } from "../utils/generators";
import { credValidator } from "../utils/validator";
import { salt } from "../utils/hash";
import OTP from "../models/otp.model";
import Package from "../models/package.model";
import { sendOTPMail } from "../utils/mailer";

require("dotenv").config();

const getOTPClient = async (req: any, res: any): Promise<void> => {
  await OTP.find({}, ["-package"], { sort: { _id: -1 } })
    .limit(10)
    .then((data: any) => {
      res.send(data);
    })
    .catch((error) => {
      res.send("No OTP record found");
    });
};

const createOTP = async (req: any, res: any): Promise<void> => {
  const { key, type, digits, email } = req.query;
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
      sendOTPMail(email, OTPcode);
      const id = String(data._id);
      res.status(201).send(`created <${id}>`); // Send OTP to client
    })
    .catch((err) => {
      res.status(404).send(`couldn't generate a OTP code (${Date.now()})`);
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

    if (serverKey.validation) return res.status(201).send(`created <${key}>`);

    if (utcDate <= serverExpiry) {
      const validator = credValidator(value, serverOTP, async () => {
        const otpData = await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: 0,
          validation: true,
        });
        return res.status(200).send(`verified <${otpData?._id}>`);
      });

      if (!validator) {
        if (serverKey.attempts === 0)
          return res.status(400).send(`invalid <${key}>`);

        return await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: serverKey.attempts - 1,
        }).then(() => res.status(404).send(`denied <${key}>`));
      }

      return validator;
    }

    return res.status(503).send(`expired <${key}>`);
  }

  return res.status(406).send(`unknown <${key}>`);
};

const confirmOTP = async (req: any, res: any): Promise<void> => {
  const message: string = req.query;

  const token = message?.split("%20")[1]?.slice(1, -1);

  await OTP.findOne({ _id: token }).then((data) => {
    return res
      .status(202)
      .send(`granted <${data?._id}>`)
      .catch(() => {
        res.status(404).send(`invalid <${token}>`);
      });
  });
};

export { getOTPClient, createOTP, verifyOTP, confirmOTP };
