import { StatusCodes } from "http-status-codes";
import { isSortCriteria, isSortOrder } from "../types/foodTypes";

function validateNumber(number) {
  return !isNaN(number) && number > 0;
}

export function validateUnitConvert(req, res, next) {
  const { fromUnitAbbrev, toUnitAbbrev } = req.body;
  let amountOrRatio = req.body.amount || req.body.ratio;
  amountOrRatio = parseFloat(amountOrRatio);
  if (!fromUnitAbbrev || !toUnitAbbrev) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide both units",
    });
  } else if (isNaN(amountOrRatio) || amountOrRatio <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide a valid ratio",
    });
  } else if (fromUnitAbbrev === toUnitAbbrev) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "From unit and to unit cannot be the same",
    });
  }
  req.body.amount = amountOrRatio;
  req.body.ratio = amountOrRatio;
  next();
}

export function validateUnitCreate(req, res, next) {
  const { name, abbreviation } = req.body;
  if (!name || !abbreviation) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }
  next();
}

export function validateFood(req, res, next) {
  const {
    name,
    baseServingSize,
    baseServingUnitId,
    calories,
    protein,
    carbs,
    fat,
    sugar,
  } = req.body;
  if (
    !name ||
    !baseServingSize ||
    !baseServingUnitId ||
    !calories ||
    !protein ||
    !carbs ||
    !fat ||
    !sugar
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  const numbers = [baseServingSize, calories, protein, carbs, fat, sugar];
  if (numbers.some((number) => !validateNumber(number))) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide valid numbers" });
  }

  next();
}

export function validateQueryFood(req, res, next) {
  const { sortBy, sortOrder, limit, offset, filters } = req.body;
  if (sortBy && !isSortCriteria(sortBy)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid sortBy criteria",
    });
  }
  if (sortOrder && !isSortOrder(sortOrder)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid sortOrder criteria",
    });
  }
  if (limit && !validateNumber(limit)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid limit",
    });
  }
  if (offset && !validateNumber(offset)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid offset",
    });
  }
  if (filters && typeof filters !== "object") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid filters",
    });
  }
  next();
}
