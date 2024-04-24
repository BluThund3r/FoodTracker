import express from "express";
import dotenv from "dotenv";
import { logger } from "./middlewares/basicMiddlewares";
import authRouter from "./routes/authRouter";

dotenv.config();
const app = express();

// Add middleware to the application
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add routers to the application
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
