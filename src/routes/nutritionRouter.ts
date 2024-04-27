import express from "express";
import { isLoggedIn } from "../middlewares/usefulMiddlewares";
import { StatusCodes } from "http-status-codes";
import {
  getMetricsForUser,
  getUserIdealNutrition,
  getUserNutritionForDay,
  getUserNutritionRemainingForDay,
} from "../services/nutritionService";
import { validateDateQuery } from "../middlewares/validationMiddlewares";
const nutritionRouter = express.Router();

nutritionRouter.get("/myMetrics", isLoggedIn, async (req, res, next) => {
  const username = (req as any).user.username;
  try {
    return res.status(StatusCodes.OK).json(await getMetricsForUser(username));
  } catch (err) {
    next(err);
  }
});

nutritionRouter.get("/idealNutrition", isLoggedIn, async (req, res, next) => {
  const username = (req as any).user.username;
  try {
    res.status(StatusCodes.OK).json(await getUserIdealNutrition(username));
  } catch (err) {
    next(err);
  }
});

// TODO: update for the exercise
nutritionRouter.get(
  "/remainingNutrition",
  isLoggedIn,
  validateDateQuery,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const date = req.query.date as string;
    try {
      res
        .status(StatusCodes.OK)
        .json(await getUserNutritionRemainingForDay(username, date));
    } catch (err) {
      next(err);
    }
  }
);

nutritionRouter.get(
  "/nutrition",
  isLoggedIn,
  validateDateQuery,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const date = req.query.date as string;
    try {
      res
        .status(StatusCodes.OK)
        .json(await getUserNutritionForDay(username, date));
    } catch (err) {
      next(err);
    }
  }
);

export default nutritionRouter;
