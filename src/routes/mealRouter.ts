import express from "express";
import {
  addFoodToMeal,
  createMeal,
  deleteMealItem,
  getMealsForDay,
  updateMealItem,
} from "../services/mealService";
import { isLoggedIn } from "../middlewares/usefulMiddlewares";
import { StatusCodes } from "http-status-codes";
import {
  validateAddFood,
  validateDateQuery,
  validateMealCreate,
  validateMealItemId,
  validateUpdateMealItem,
} from "../middlewares/validationMiddlewares";
const mealRouter = express.Router();

mealRouter.get("/", isLoggedIn, validateDateQuery, async (req, res, next) => {
  try {
    const mealsForDate = await getMealsForDay(
      (req as any).user.username,
      req.query.date as string
    );
    return res.status(StatusCodes.OK).json(mealsForDate);
  } catch (e) {
    next(e);
  }
});

mealRouter.post(
  "/create",
  isLoggedIn,
  validateMealCreate,
  async (req, res, next) => {
    try {
      const username = (req as any).user.username;
      const { name, date } = req.body;
      return res
        .status(StatusCodes.CREATED)
        .json(await createMeal(username, name, date));
    } catch (e) {
      next(e);
    }
  }
);

mealRouter.post(
  "/addFood",
  isLoggedIn,
  validateAddFood,
  async (req, res, next) => {
    try {
      const { mealId, foodId, amount, unitId } = req.body;
      res
        .status(StatusCodes.OK)
        .json(await addFoodToMeal(mealId, foodId, amount, unitId));
    } catch (e) {
      next(e);
    }
  }
);

mealRouter.delete(
  "/delete/:mealItemId",
  isLoggedIn,
  validateMealItemId,
  async (req, res, next) => {
    try {
      const username = (req as any).user.username;
      const mealItemId = req.params.mealItemId;
      return res
        .status(StatusCodes.OK)
        .json(await deleteMealItem(username, mealItemId));
    } catch (e) {
      next(e);
    }
  }
);

mealRouter.patch(
  "/update/:mealItemId",
  isLoggedIn,
  validateMealItemId,
  validateUpdateMealItem,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const mealItemId = req.params.mealItemId;
    const { amount, unitAbbrev } = req.body;
    try {
      return res
        .status(StatusCodes.OK)
        .json(await updateMealItem(username, mealItemId, amount, unitAbbrev));
    } catch (e) {
      next(e);
    }
  }
);

export default mealRouter;
