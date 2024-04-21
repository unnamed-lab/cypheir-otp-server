import express from "express";
import { User } from "../models/user.model";

const router = express.Router();

router.get("/", async (req: any, res: any): Promise<void> => {
  try {
    await User.find().then(data => {
        console.log()
    })
  } catch (error) {
    console.error(error);
  }
});

export = router;
