import mongoose from "mongoose";
import express from "express";

require("dotenv").config();

const app = express();
const PORT = 3000;
const API_URI = process.env.MONGODB_URI;

app.use("/api/", require("./routes/otp.route"));

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
      process.exit(1)
    }
  }
  
});

export = {};
