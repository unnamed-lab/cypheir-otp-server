const express = require("express");
const codeRouter = express.Router();
const { HOTP, CodeFuse } = require("../utils/generators");
const { credValidator } = require("../utils/validator");

codeRouter.get("/", (res: any, req: any): void => {
  req.status(200).send("Response sent!");
});

codeRouter.post("/create", (res: any, req: any): void => {
  const OTP = HOTP("unnamed", 6, { type: "alphanumeric" });
  const key1 = CodeFuse({
    value: "unnamed",
    key: OTP,
    client: "127.0.0.1",
  });

  const key2 = CodeFuse({
    value: "unnamed",
    key: OTP,
    client: "127.0.0.1",
  });

  const validator = credValidator(key1, key2, () => {
    return "Callback function works!";
  });

  console.log(`OTP code: ${OTP}`);
  console.log(validator);

  req.status(200).send(`OTP code: ${OTP}`);
});

export = codeRouter;
