import express from "express";
import { User, IUser } from "../models/user.model";

const router = express.Router();

router.get("/:id([0-9a-f]{24})", async (req: any, res: any): Promise<void> => {
  const { id } = req.params;
  try {
    const hasUser = await User.findById(String(id));

    if (hasUser) return res.status(200).send(hasUser);
    else return res.status(200).send("User not found");
  } catch (error) {
    console.error("Error with parameters");
  }
});

router.post("/create", async (req: any, res: any): Promise<void> => {
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
      console.log(data);
      return res.send("User created successfully!");
    })
    .catch((error: any) => {
      console.error(error);
    });
});

router.get("/getUser", async (req:string))

export = router;
