import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  signIn,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";
require("dotenv").config();

const router = express.Router();

router.get("/:id([0-9a-f]{24})", getUser);

router.post("/login", signIn);

router.post("/create", createUser);

router.post("/update/:id([0-9a-f]{24})", verifyToken, updateUser);

router.delete("/delete/:id([0-9a-f]{24})", verifyToken, deleteUser);

export = router;
