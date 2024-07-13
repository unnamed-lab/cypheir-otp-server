import Express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import Package from "../models/package.model";
import { salt } from "../utils/hash";
import Plan from "../models/plan.model";
import bcrypt from "bcrypt";

require("dotenv").config();

export interface IGetUserAuthInfoRequest extends Express.Request {
  user: string;
}

const getUser = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const hasUser = await User.findById(String(id));

    if (hasUser) {
      res.status(200).send(hasUser);
      return;
    } else {
      res.status(200).send("User not found");
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

const signIn = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }, ["-_v"]);

    if (!user) {
      res.status(401).json({ error: "Authentication failed" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Authentication failed" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      String(process.env.JWT_SECRET_KEY),
      { expiresIn: "1h" }
    );

    const output = JSON.stringify({ user, token });
    console.log("Retrieved user data: " + output);
    res.send(200).send(output);
    return;
  } catch (error) {
    console.error(error);
  }
};

const createUser = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { username, firstname, lastname, email, password } = req.body;
  const hasUser = await User.findOne({ email, password });
  const getPlans = await Plan.find();

  const hashPassword = await bcrypt.hash(password, 10);

  if (hasUser) {
    res.send("User already exists");
    return;
  }

  const newUser = await User.create({
    username,
    firstname,
    lastname,
    email,
    password: hashPassword,
    plan: getPlans
      ? getPlans.filter((el) => {
          return el.index === 0;
        })[0]._id
      : undefined,
  });

  newUser
    .save()
    .then(async (data) => {
      console.log("Created user: " + data);
      res.status(200).send("User created successfully!");

      const hashedData = salt(JSON.stringify(data), <string>data?._id);
      (await Package.create({ user: data._id, key: hashedData }))
        .save()
        .then((data) => {
          console.log("Package created: " + data);
        })
        .catch((err) => {
          console.error("Failed to create pacakge: ", err);
        });
    })
    .catch((error) => {
      console.error(error);
    });
};

const updateUser = async (
  req: any,
  res: any
): Promise<void> => {
  // const { id } = req.params;
  const id = req.user;

  const { username, firstname, lastname, email, password } = req.body;
  const getPlans = await Plan.find();
  const getUserPlan = (await User.findOne({ id }))?.plan;

  console.log(getPlans, getUserPlan);
  try {
    await User.findByIdAndUpdate(id, {
      username,
      firstname,
      lastname,
      email,
      password,
      plan:
        getPlans.length > 0 && !getUserPlan
          ? getPlans.filter((el) => {
              return el.index === 0;
            })[0]._id
          : !getUserPlan
          ? undefined
          : getUserPlan,
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

const deleteUser = async (
  req: any,
  res: any
): Promise<void> => {
  // const { id } = req.params;
  const id = req.user;

  try {
    await User.findByIdAndDelete(id)
      .then(async (docs) => {
        console.log("Deleted user: " + docs);
        await Package.findOneAndDelete({ user: id })
          .then((data) => console.log("Package deleted: " + data))
          .catch((err) => {
            return console.error(err);
          });
        res.status(200).send("User deleted!");
      })
      .catch((err) => {
        return console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
};

export { getUser, signIn, createUser, updateUser, deleteUser };
