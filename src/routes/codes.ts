const express = require("express");
const codeRouter = express.Router();
const { HOTP } = require("../utils/generators");

codeRouter.get("/", (res: any, req: any): void => {
  req.status(200).send("Response sent!");
});

codeRouter.post("/create", (res: any, req: any): void => {
  const OTP = HOTP("unnamed", Math.floor(Math.random() * (1000 - 1 + 1)) + 1);

  console.log(`OTP code: ${OTP}`);
  req.status(200).send(`OTP code: ${OTP}`);
});

export = codeRouter ;
