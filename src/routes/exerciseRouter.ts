import express from "express";
import { StatusCodes } from "http-status-codes";
import {
  addExerciseToUser,
  createExercise,
  deleteExercise,
  getAllExercises,
  getExerciseById,
  getUserExerciseByDetails,
  getUserExercisesForDate,
  removeExerciseFromUser,
  searchExercises,
  updateExercise,
  updateUserExercise,
} from "../services/exerciseService";
import { isAdmin, isLoggedIn } from "../middlewares/usefulMiddlewares";
import {
  validateAddExercise,
  validateCreateExercise,
  validateDateBody,
  validateDateQuery,
  validateExerciseNameBody,
  validateExerciseSearch,
} from "../middlewares/validationMiddlewares";
const exerciseRouter = express.Router();

exerciseRouter.get("/", async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json(await getAllExercises());
  } catch (error) {
    next(error);
  }
});

exerciseRouter.post(
  "/create",
  isLoggedIn,
  isAdmin,
  validateCreateExercise,
  async (req, res, next) => {
    const { name, description, caloriesPerMinute } = req.body;
    try {
      res
        .status(StatusCodes.CREATED)
        .json(await createExercise({ name, description, caloriesPerMinute }));
    } catch (error) {
      next(error);
    }
  }
);

exerciseRouter.get(
  "/search",
  validateExerciseSearch,
  async (req, res, next) => {
    const { name, limit, offset } = req.query.search as any;
    try {
      res
        .status(StatusCodes.OK)
        .json(await searchExercises(name, limit, offset));
    } catch (error) {
      next(error);
    }
  }
);

exerciseRouter.post(
  "/add",
  isLoggedIn,
  validateAddExercise,
  validateDateBody,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const { name, duration, date } = req.body;
    try {
      res
        .status(StatusCodes.CREATED)
        .json(await addExerciseToUser(username, name, duration, date));
    } catch (error) {
      next(error);
    }
  }
);

exerciseRouter.patch(
  "/update",
  isLoggedIn,
  validateAddExercise,
  validateDateBody,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const { name, duration, date } = req.body;
    try {
      res
        .status(StatusCodes.OK)
        .json(await updateUserExercise(username, name, duration, date));
    } catch (error) {
      next(error);
    }
  }
);

exerciseRouter.delete(
  "/remove",
  isLoggedIn,
  validateExerciseNameBody,
  validateDateBody,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const { name, date } = req.body;
    try {
      res
        .status(StatusCodes.OK)
        .json(await removeExerciseFromUser(username, name, date));
    } catch (error) {
      next(error);
    }
  }
);

exerciseRouter.get(
  "/userExerciseForDate",
  validateExerciseNameBody,
  validateDateBody,
  isLoggedIn,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const { date, name } = req.body;
    try {
      res
        .status(StatusCodes.OK)
        .json(await getUserExerciseByDetails(username, name, date));
    } catch (error) {
      next(error);
    }
  }
);

exerciseRouter.get(
  "/allUserExercisesForDate",
  validateDateQuery,
  isLoggedIn,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const date = req.query.date as string;
    try {
      res
        .status(StatusCodes.OK)
        .json(await getUserExercisesForDate(username, date));
    } catch (error) {
      next(error);
    }
  }
);

// ! This should be the last route
exerciseRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      res.status(StatusCodes.OK).json(await getExerciseById(req.params.id));
    } catch (error) {
      next(error);
    }
  })
  .put(isLoggedIn, isAdmin, validateCreateExercise, async (req, res, next) => {
    const { name, description, caloriesPerMinute } = req.body;
    try {
      res.status(StatusCodes.OK).json(
        await updateExercise(req.params.id, {
          name,
          description,
          caloriesPerMinute,
        })
      );
    } catch (error) {
      next(error);
    }
  })
  .delete(isLoggedIn, isAdmin, async (req, res, next) => {
    try {
      res.status(StatusCodes.OK).json(await deleteExercise(req.params.id));
    } catch (error) {
      next(error);
    }
  });

export default exerciseRouter;
