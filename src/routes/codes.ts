const express = require("express");
const codeRouter = express.Router();
const { HOTP } = require("../utils/generators");
const { salt } = require("../utils/hash");

codeRouter.get("/", (res: any, req: any): void => {
  req.status(200).send("Response sent!");
});

codeRouter.post("/create", (res: any, req: any): void => {
  const OTP = HOTP("unnamed", 12);

  console.log(`OTP code: ${OTP}`);
  console.log(`Salt code: ${salt("unnamed", "codes")}`);

  req.status(200).send(`OTP code: ${OTP}`);
});

export = codeRouter;
