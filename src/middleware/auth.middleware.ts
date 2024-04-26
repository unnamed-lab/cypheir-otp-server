import jwt from "jsonwebtoken";
require("dotenv").config();

function verifyToken(req: any, res: any, next: any) {
  const token = req.header("Authorization");

  console.log(token)

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET_KEY));
    if (typeof decoded !== "string") {
      req.user = decoded?.userId;
      next();
    } else {
      req.user = decoded;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export = verifyToken;
