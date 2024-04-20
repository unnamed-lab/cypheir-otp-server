import express from "express";

const router = express.Router();

router.get("/:id", (res: any, req: any): void => {
  const { id } = req.params;
  req.status(200).send("Response sent!");
});

export = router;
