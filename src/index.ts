import express from "express";
import dotenv from "dotenv";
import { errorHandler, logger } from "./middlewares/usefulMiddlewares";
import authRouter from "./routes/authRouter";
import unitRouter from "./routes/unitRouter";

dotenv.config();
const app = express();

// Add middlewares to the application
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

// Add routers to the application
app.use("/auth", authRouter);
app.use("/units", unitRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Add the error handler middleware
app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
