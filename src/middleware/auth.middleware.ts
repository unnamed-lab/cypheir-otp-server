import Express from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

export interface IGetUserAuthInfoRequest extends Express.Request {
  user: string;
}

export function verifyToken(
  req: any,
  res: any,
  next: Express.NextFunction
) {
  const token = req.header("Authorization");
  const secret = process.env.JWT_SECRET_KEY as string;

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "string") {
      req.user = decoded?.userId;
      next();
    } else {
      req.user = decoded;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token: " + error });
  }
}
