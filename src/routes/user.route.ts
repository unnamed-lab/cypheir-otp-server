import express from "express";

const router = express.Router();

router.get("/", (res:any, req:any): void => {
    req.status(200).send("Response sent!")
})

export = router;