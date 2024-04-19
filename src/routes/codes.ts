const express = require("express");
const codeRouter = express.Router();
const { HOTP, CodeFuse } = require("../utils/generators");
const { salt } = require("../utils/hash");

codeRouter.get("/", (res: any, req: any): void => {
  req.status(200).send("Response sent!");
});

codeRouter.post("/create", (res: any, req: any): void => {
  const OTP = HOTP("unnamed", 6, { type: "alphanumeric" });

  console.log(`OTP code: ${OTP}`);
  console.log(
    CodeFuse({
      value: "unnamed",
      key: OTP,
      client: "127.0.0.1",
    })
  );
  console.log(
    CodeFuse({
      value: "unname",
      key: OTP,
      client: "127.0.0.1",
    })
  );

  req.status(200).send(`OTP code: ${OTP}`);
});

export = codeRouter;
