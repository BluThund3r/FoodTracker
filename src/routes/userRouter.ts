import express from "express";
import { isLoggedIn } from "../middlewares/usefulMiddlewares";
import { validateUserDetails } from "../middlewares/validationMiddlewares";
const userRouter = express.Router();

userRouter.get(
  "/addDetails",
  isLoggedIn,
  validateUserDetails,
  (req, res, next) => {}
);

export default userRouter;
