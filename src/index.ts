import express from "express";
import dotenv from "dotenv";
import { errorHandler, logger } from "./middlewares/usefulMiddlewares";
import authRouter from "./routes/authRouter";
import unitRouter from "./routes/unitRouter";
import foodRouter from "./routes/foodRouter";
import userRouter from "./routes/userRouter";
import mealRouter from "./routes/mealRouter";
import nutritionRouter from "./routes/nutritionRouter";

dotenv.config();
const app = express();

// Add middlewares to the application
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

// Add routers to the application
app.use("/auth", authRouter);
app.use("/units", unitRouter);
app.use("/food", foodRouter);
app.use("/users", userRouter);
app.use("/meals", mealRouter);
app.use("/nutrition", nutritionRouter);

// Add the error handler middleware
app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
