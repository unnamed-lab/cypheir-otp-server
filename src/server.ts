import mongoose from "mongoose";
import bodyParser from "body-parser";
import express from "express";
import { rateLimiterMiddleware } from "./middleware/requestLimiter";

require("dotenv").config();

const app = express();
const PORT = 3000;
const API_URI = process.env.MONGODB_URI;

//  Server Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
// app.use(rateLimiterMiddleware)

//  Server Routes
app.use("/api/otp/", require("./routes/otp.route"));
app.use("/api/user/", require("./routes/user.route"));
app.use("/api/subscription/", require("./routes/plan.route"));
app.use("/api/package/", require("./routes/package.route"));
app.use("/api/mail/", require("./routes/package.route"));

//  Server Listener
app.listen(PORT, async (): Promise<void> => {
  console.log(`The server is running on ${PORT}`);

  if (!API_URI) throw new Error("Input your MongoDB URI key");
  else {
    try {
      const connect = await mongoose.connect(API_URI);
      if (connect) {
        return console.log("MongoDB connected!");
      }
    } catch (error) {
      console.log("MongoDB couldn't connect :(");
      console.error(error);
      process.exit(1);
    }
  }
});

export = {};
