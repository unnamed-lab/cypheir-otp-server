import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import Package from "../models/package.model";
import { salt } from "../utils/hash";
require("dotenv").config();

const getUser = async (req: any, res: any): Promise<void> => {
  const { id } = req.params;
  try {
    const hasUser = await User.findById(String(id));

    if (hasUser) return res.status(200).send(hasUser);
    else return res.status(200).send("User not found");
  } catch (error) {
    console.error(error);
  }
};

const signIn = async (req: any, res: any): Promise<void> => {
  const { email, password } = req.body;
  try {
    await User.findOne({ email, password }, ["-_v"])
      .then((docs) => {
        const token = jwt.sign(
          { data: docs },
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
};

const createUser = async (req: any, res: any): Promise<void> => {
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
    .then(async (data) => {
      console.log("Created user: " + data);
      res.status(200).send("User created successfully!");

      const hashedData = salt(JSON.stringify(data), data._id);
      (await Package.create({ user: data._id, key: hashedData }))
        .save()
        .then((data: any) => {
          console.log("Package created: " + data);
        })
        .catch((err: any) => {
          console.error("Failed to create pacakge");
        });
    })
    .catch((error: any) => {
      console.error(error);
    });
};

const updateUser = async (req: any, res: any): Promise<void> => {
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
};

const deleteUser = async (req: any, res: any): Promise<void> => {
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
};

export { getUser, signIn, createUser, updateUser, deleteUser };
