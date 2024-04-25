import express from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { verifyUserAccess, verifyUserToken } from "../middleware/verification";
import {
  createUser,
  deleteUser,
  getUser,
  signIn,
  updateUser,
} from "../controllers/user.controller";
require("dotenv").config();

const router = express.Router();

router.get("/:id([0-9a-f]{24})", getUser);

router.post("/login", signIn);

router.post("/create", createUser);

router.post(
  "/update/:id([0-9a-f]{24})",
  updateUser
);

router.delete(
  "/delete/:id([0-9a-f]{24})",
  deleteUser
);

export = router;
