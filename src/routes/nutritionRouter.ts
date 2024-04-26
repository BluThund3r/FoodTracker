import express from "express";
import { isLoggedIn } from "../middlewares/usefulMiddlewares";
import { StatusCodes } from "http-status-codes";
import {
  getMetricsForUser,
  getUserIdealNutrition,
} from "../services/nutritionService";
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

export default nutritionRouter;
