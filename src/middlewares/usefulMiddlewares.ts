import { verifyToken } from "../services/jwtService";

export function logger(req, res, next) {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
}

export function isLoggedIn(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const user = verifyToken(token);
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
}

export function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send("Forbidden");
  }
}

export function errorHandler(err, req, res, next) {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  } else {
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
}
