import express from "express";
import { isLoggedIn } from "../middlewares/usefulMiddlewares";
import { validateUserDetails } from "../middlewares/validationMiddlewares";
import { StatusCodes } from "http-status-codes";
import {
  addUserDetails,
  getUserDetailsByUsername,
  updateUserDetails,
} from "../services/userService";
import { getMetricsForUser } from "../services/nutritionService";
const userRouter = express.Router();

userRouter.post(
  "/addDetails",
  isLoggedIn,
  validateUserDetails,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const userDetails = req.body;
    try {
      res
        .status(StatusCodes.OK)
        .json(await addUserDetails(username, userDetails));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get("/getDetails", isLoggedIn, async (req, res, next) => {
  const username = (req as any).user.username;
  try {
    res.status(StatusCodes.OK).json(await getUserDetailsByUsername(username));
  } catch (err) {
    next(err);
  }
});

userRouter.put(
  "/updateDetails",
  isLoggedIn,
  validateUserDetails,
  async (req, res, next) => {
    const username = (req as any).user.username;
    const userDetails = req.body;
    try {
      res
        .status(StatusCodes.OK)
        .json(await updateUserDetails(username, userDetails));
    } catch (err) {
      next(err);
    }
  }
);

export default userRouter;
