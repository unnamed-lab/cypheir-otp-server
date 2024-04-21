import jwt from "jsonwebtoken";
require("dotenv").config();

function verifyUserToken(req: any, res: any, next: any) {
  const bearerHeader = req.header["authorization"];
  console.log(JSON.stringify(req.header));
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearToken = bearer[1];
    req.token = bearToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

function verifyUserAccess(req: any, res: any, next: any) {
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
