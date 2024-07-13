import Express  from "express";
import Package from "../models/package.model";
import { hmac } from "../utils/hash";

const getUserPackage = async (req: Express.Request, res: Express.Response): Promise<void> => {
  const { id } = req.params;
  try {
    await Package.findById(id)
      .then((data) => {
        console.log("Package data: ", data);
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        res.send("Package was not found");
      });
  } catch (error) {
    console.error(error);
  }
};

const getAllPackages = async (req: Express.Request, res: Express.Response): Promise<void> => {
  try {
    await Package.find().then((data) => {
      console.log("Package data: ", data);
      res.send(data);
    });
  } catch (error) {
    console.error(error);
  }
};

const createtUserPackage = async (req: Express.Request, res: Express.Response): Promise<void> => {
  const { user } = req.body;
  const timestamp = new Date().toUTCString();

  try {
    const key = hmac(user, timestamp);
    (await Package.create({ user, key }))
      .save()
      .then(data => {
        console.log("Created package: " + data);
        return res.status(200).send("Package created successfully!");
      })
      .catch(error => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
};

const deleteUserPackage = async (req: Express.Request, res: Express.Response): Promise<void> => {
  const { id } = req.params;
  try {
    await Package.findByIdAndDelete(id)
      .then((docs) => {
        console.log("Deleted package: " + docs);
        res.status(200).send("Package deleted!");
      })
      .catch((err) => {
        return console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllPackages,
  getUserPackage,
  createtUserPackage,
  deleteUserPackage,
};
