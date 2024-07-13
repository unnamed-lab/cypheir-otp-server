import Express from "express";
import Plan from "../models/plan.model";
require("dotenv").config();

const getPlans = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  try {
    await Plan.find().then((data) => {
      console.log(data);
      res.status(200).send(data);
    });
  } catch (error) {
    console.error(error);
  }
};

const getOnePlan = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await Plan.findById(id).then((data) => {
      console.log(data);
      res.status(200).send(data);
    });
  } catch (error) {
    console.error(error);
  }
};

const createPlan = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { name, price, otp, bulk, perks } = req.body;
  try {
    const allPlans = (await Plan.find()).length;
    const hasPlan = await Plan.findOne({ name });
    if (hasPlan) {
      res.send("Plan already exists!");
      return;
    } else {
      (
        await Plan.create({
          name,
          price,
          perks,
          otp,
          bulk,
          index: allPlans ? allPlans + 1 : 0,
        })
      )
        .save()
        .then(data => {
          console.log("Created new plan: " + data);
          return res.status(200).send("Plan created successfully!");
        })
        .catch(error=> {
          console.error(error);
        });
    }
  } catch (error) {
    console.error(error);
  }
};

const updatePlan = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { id } = req.params;
  const { name, index, price, otp, bulk, perks } = req.body;

  try {
    await Plan.findByIdAndUpdate(id, {
      name,
      index,
      price,
      otp,
      bulk,
      perks,
    })
      .then((docs) => {
        console.log("Updated plan: " + docs);
        res.status(200).send("Plan updated!");
      })
      .catch((err) => {
        return console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
};

const deletePlan = async (
  req: Express.Request,
  res: Express.Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await Plan.findByIdAndDelete(id)
      .then((docs) => {
        console.log("Deleted plan: " + docs);
        res.status(200).send("Plan deleted!");
      })
      .catch((err) => {
        return console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
};

export { getPlans, getOnePlan, createPlan, updatePlan, deletePlan };
