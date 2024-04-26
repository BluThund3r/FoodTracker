import express from "express";
import { isAdmin, isLoggedIn } from "../middlewares/usefulMiddlewares";
import {
  validateFood,
  validateQueryFood,
} from "../middlewares/validationMiddlewares";
import {
  createFood,
  deleteFood,
  getAllFood,
  getFood,
  getFoodById,
  getFoodByName,
  updateFood,
} from "../services/foodService";
import { StatusCodes } from "http-status-codes";
import { getUnitByAbbrev } from "../services/unitService";
const foodRouter = express.Router();

foodRouter.post(
  "/create",
  isLoggedIn,
  isAdmin,
  validateFood,
  async (req, res, next) => {
    const {
      name,
      baseServingSize,
      baseServingUnitAbbrev,
      calories,
      protein,
      carbs,
      fat,
      sugar,
    } = req.body;
    try {
      const baseServingUnitId = (await getUnitByAbbrev(baseServingUnitAbbrev))
        .id;
      res.status(StatusCodes.CREATED).json(
        await createFood({
          name,
          baseServingSize,
          baseServingUnitId,
          calories,
          protein,
          carbs,
          fat,
          sugar,
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

foodRouter.get("/", async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json(await getAllFood());
  } catch (error) {
    next(error);
  }
});

foodRouter.get("/queryFood", validateQueryFood, async (req, res, next) => {
  const { sortBy, sortOrder, limit, offset, filters } = req.body;
  try {
    res
      .status(StatusCodes.OK)
      .json(await getFood({ sortBy, sortOrder, limit, offset, filters }));
  } catch (error) {
    next(error);
  }
});

foodRouter.get("/search", async (req, res, next) => {
  try {
    const name = req.query.name as string;
    if (!name) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Name query parameter is required" });
      return;
    }
    res.status(StatusCodes.OK).json(await getFoodByName(name));
  } catch (error) {
    next(error);
  }
});

foodRouter
  .route("/:id")
  .get(async (req, res, next) => {
    const foodId = req.params.id;
    try {
      res.status(StatusCodes.OK).json(await getFoodById(foodId));
    } catch (error) {
      next(error);
    }
  })
  .put(isLoggedIn, isAdmin, validateFood, async (req, res, next) => {
    const foodId = req.params.id;
    const {
      name,
      baseServingSize,
      baseServingUnitAbbrev,
      calories,
      protein,
      carbs,
      fat,
      sugar,
    } = req.body;
    try {
      const baseServingUnitId = (await getUnitByAbbrev(baseServingUnitAbbrev))
        .id;
      res.status(StatusCodes.OK).json(
        await updateFood(foodId, {
          name,
          baseServingSize,
          baseServingUnitId,
          calories,
          protein,
          carbs,
          fat,
          sugar,
        })
      );
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    const foodId = req.params.id;
    try {
      res.status(StatusCodes.OK).send(await deleteFood(foodId));
    } catch (error) {
      next(error);
    }
  });

export default foodRouter;
