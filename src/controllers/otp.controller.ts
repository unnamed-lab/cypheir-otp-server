import Express from "express";
import { HOTP } from "../utils/generators";
import { credValidator } from "../utils/validator";
import { salt } from "../utils/hash";
import OTP from "../models/otp.model";
import Package from "../models/package.model";
import { sendOTPMail } from "../utils/mailer";
import { User } from "../models/user.model";
import Plan from "../models/plan.model";

require("dotenv").config();

const getOTPClient = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  await OTP.find({}, ["-package"], { sort: { _id: -1 } })
    .limit(20)
    .then(data => {
      res.send(data);
    })
    .catch(() => {
      return res.status(400).send(`no OTP record found`);
    });
};

const createOTP = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { key, type, digits, email } = req.query;
  const OTPcode = HOTP(key as string, digits as string, {
    type: type as "numeric" | "alphanumeric",
  }); // Create OTP code
  const hasedValue = salt(OTPcode, key as string); // Hashes OTP with credentials
  const packageOTP = await Package.findOne({ key });
  const packageId = packageOTP?._id; //  Get registered user package id
  const getCurrentTime = new Date().getTime() + 5 * 60 * 1000;
  const expiryDate = new Date(getCurrentTime); //  Adds 5 mins in milliseconds

  // Get the current date in UTC
  const now = new Date(new Date().toUTCString());

  const firstDayOfMonthUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );

  const lastDayOfMonthUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)
  );

  const getUserOTP = await OTP.find({
    package: packageId,
    created_on: { $gte: firstDayOfMonthUTC, $lt: lastDayOfMonthUTC },
  });

  const getUserByPackageId = await User.findOne({ _id: packageOTP?.user });

  const getUserPlanByUser = await Plan.findOne({
    _id: getUserByPackageId?.plan,
  });

  console.log(getUserOTP.length);

  if (getUserPlanByUser && getUserPlanByUser.otp >= getUserOTP.length)
    (
      await OTP.create({
        package: packageId,
        key: hasedValue,
        expiry: expiryDate,
      })
    )
      .save()
      .then((data) => {
        const id = String(data._id);

        sendOTPMail(
          { receiver: email as string, otp: OTPcode },
          {
            host: process.env.CYPHEIR_MAIL_HOST as string,
            user: process.env.CYPHEIR_MAIL_USER as string,
            pass: process.env.CYPHEIR_MAIL_PASSWORD as string,
            port: 465,
          },
          () => {
            res.status(201).send(`created <${id}>`); // Send OTP to client
          }
        );
      })
      .catch(() => {
        res.status(404).send(`couldn't generate a OTP code (${Date.now()})`);
      });
  else {
    res.status(404).send(`monthly limit reached`);
    return;
  }
};

const verifyOTP = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { otp, key } = req.query;
  const value = salt(otp as string, key as string);
  const serverKey = await OTP.findOne({ _id: key });

  if (serverKey) {
    const serverOTP = serverKey.key;
    const currentTime = new Date();
    const utcDate = new Date(currentTime.getTime()).getTime();
    const serverExpiry = Number(serverKey.expiry);

    if (serverKey.validation) {
      res.status(201).send(`validated <${key}>`);
      return;
    }

    if (utcDate <= serverExpiry) {
      const validator = credValidator(value, serverOTP, async () => {
        const otpData = await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: 0,
          validation: true,
        });
        return res.status(200).send(`verified <${otpData?._id}>`);
      });

      if (!validator) {
        if (serverKey.attempts === 0) {
          res.status(400).send(`invalid <${key}>`);
          return;
        }

        await OTP.findByIdAndUpdate(serverKey._id, {
          attempts: serverKey.attempts - 1,
        }).then(() => res.status(404).send(`denied <${key}>`));
        return;
      }

      return validator;
    }

    res.status(503).send(`expired <${key}>`);
    return;
  }

  res.status(406).send(`unknown <${key}>`);
  return;
};

const confirmOTP = async (
  req: any,
  res: any
): Promise<void> => {
  const message = req.query;
  const token = (message as unknown as string)?.split("%20")[1]?.slice(1, -1);

  await OTP.findOne({ _id: token }).then((data) => {
    res
      .status(202)
      .send(`granted <${data?._id}>`)
      .catch(() => {
        res.status(404).send(`invalid <${token}>`);
      });
    return;
  });
};

export { getOTPClient, createOTP, verifyOTP, confirmOTP };
