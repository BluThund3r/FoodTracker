import express from "express";
import { loginUser, registerUser } from "../services/authService";
const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  const registerInfo = {
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  try {
    const user = await registerUser(registerInfo);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

authRouter.post("/login", async (req, res, next) => {
  const loginInfo = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const token = await loginUser(loginInfo);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

export default authRouter;
