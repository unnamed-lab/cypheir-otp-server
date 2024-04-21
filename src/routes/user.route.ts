import express from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { verifyUserAccess, verifyUserToken } from "../middleware/verification";
require("dotenv").config();

const router = express.Router();

router.get("/:id([0-9a-f]{24})", async (req: any, res: any): Promise<void> => {
  const { id } = req.params;
  try {
    const hasUser = await User.findById(String(id));

    if (hasUser) return res.status(200).send(hasUser);
    else return res.status(200).send("User not found");
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req: any, res: any): Promise<void> => {
  const { email, password } = req.body;
  try {
    await User.findOne({ email, password }, ["-_v"])
      .then((docs) => {
        const token = jwt.sign(
          {data: docs},
          String(process.env.JWT_SECRET_KEY),
          { expiresIn: "1h" }
        );

        const output = JSON.stringify({ data: docs, token });
        console.log("Retrieved user data: " + output);
        res.send("User data fetched!");
      })
      .catch((err) => {
        return console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
});

router.post(
  "/create",
  verifyUserToken,
  verifyUserAccess,
  async (req: any, res: any): Promise<void> => {
    const { username, firstname, lastname, email, password } = req.body;
    const hasUser = await User.findOne({ email, password });

    if (hasUser) return res.send("User already exists");
    const newUser = await User.create({
      username,
      firstname,
      lastname,
      email,
      password,
    });

    newUser
      .save()
      .then((data) => {
        console.log("Created user: " + data);
        return res.status(200).send("User created successfully!");
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
);

router.post(
  "/update/:id([0-9a-f]{24})",
  verifyUserToken,
  verifyUserAccess,
  async (req: any, res: any): Promise<void> => {
    const { _id } = req.user;
    console.log("User id: " + _id);

    const { id } = req.params;
    const { username, firstname, lastname, email, password } = req.body;

    try {
      await User.findByIdAndUpdate(id, {
        username,
        firstname,
        lastname,
        email,
        password,
      })
        .then((docs) => {
          console.log("Updated user: " + docs);
          res.status(200).send("User updated!");
        })
        .catch((err) => {
          return console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  }
);

router.delete(
  "/delete/:id([0-9a-f]{24})",
  verifyUserToken,
  verifyUserAccess,
  async (req: any, res: any): Promise<void> => {
    const { id } = req.params;

    try {
      await User.findByIdAndDelete(id)
        .then((docs) => {
          console.log("Deleted user: " + docs);
          res.status(200).send("User deleted!");
        })
        .catch((err) => {
          return console.error(err);
        });
    } catch (error) {}
  }
);

export = router;
