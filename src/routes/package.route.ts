import express from "express";

const router = express.Router();

router.get("/:id([0-9a-f]{24})");

router.post("create");

router.delete("delete/:id([0-9a-f]{24})");

export = router;
