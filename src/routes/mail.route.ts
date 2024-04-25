import express from "express";
import { sendMailController } from "../controllers/mail.controller";

const router = express.Router();

router.post("/send", sendMailController);

export = router;
