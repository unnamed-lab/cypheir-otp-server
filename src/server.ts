import mongoose from "mongoose";
import express from "express";

require("dotenv").config();

const app = express();
const PORT = 3000;
const API_URI = process.env.MONGODB_URI;

app.use("/api/", require("./routes/codes"));

app.listen(PORT, async (): Promise<void> => {
  console.log(`The server is running on ${PORT}`);

  if (!API_URI) console.log("Input your MongoDB URI key");
  else {
    const connectDB = async () => {
      return await mongoose.connect(API_URI);
    };
    const isConnected = await connectDB();

    try {
      if (isConnected) {
        return console.log("MongoDB connected!");
      }
      return console.log("MongoDB couldn't connect :(")
    } catch (error) {
      console.error(error);
    }
  }
});

export = {};
