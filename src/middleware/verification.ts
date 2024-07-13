import Express from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

export interface IGetTokenInfoRequest extends Express.Request {
  user: string;
  token: string;
}

function verifyUserToken(
  req: IGetTokenInfoRequest,
  res: Express.Response,
  next: any
) {
  const bearerHeader = (req.header as Record<string, any>)["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearToken = bearer[1];
    req.token = bearToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

function verifyUserAccess(
  req: any,
  res: any,
  next: Express.NextFunction
) {
  jwt.verify(
    req.token,
    String(process.env.JWT_SECRET_KEY),
    (err: any, decoded: any) => {
      if (err) res.sendStatus(401);
      else {
        req.user = decoded.data;
        next();
      }
    }
  );
}

export { verifyUserToken, verifyUserAccess };
