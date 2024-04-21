import express from "express";
import {
  createtUserPackage,
  deleteUserPackage,
  getAllPackages,
  getUserPackage,
} from "../controllers/package.controller";

const router = express.Router();

router.get("/admin/all", getAllPackages);

router.get("/:id([0-9a-f]{24})", getUserPackage);

router.post("/create", createtUserPackage);

router.delete("/delete/:id([0-9a-f]{24})", deleteUserPackage);

export = router;
