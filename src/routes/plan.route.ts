import express from "express";
import { User } from "../models/user.model";
import {
  createPlan,
  deletePlan,
  getOnePlan,
  getPlans,
  updatePlan,
} from "../controllers/plan.controller";

const router = express.Router();

router.get("/", getPlans);

router.get("/:id([0-9a-f]{24})", getOnePlan);

router.post("/create", createPlan);

router.post("/update/:id([0-9a-f]{24})", updatePlan);

router.delete("/delete/:id([0-9a-f]{24})", deletePlan);

export = router;
