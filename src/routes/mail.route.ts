import express from "express";
import {
  sendMailController,
  sendBulkMailController,
} from "../controllers/mail.controller";

const router = express.Router();

router.post("/send", sendMailController);

router.post("/bulk", sendBulkMailController);

export = router;
