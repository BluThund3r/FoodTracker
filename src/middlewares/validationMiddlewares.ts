import { StatusCodes } from "http-status-codes";
import { isSortCriteria, isSortOrder } from "../types/foodTypes";

// Useful functions
function validateStrictPositiveNumber(number) {
  return !isNaN(number) && number > 0;
}

function validatePositiveNumber(number) {
  return !isNaN(number) && number >= 0;
}

function undefOrNull(value) {
  return value === undefined || value === null;
}

// Unit validations
export function validateUnitConvert(req, res, next) {
  const { fromUnitAbbrev, toUnitAbbrev } = req.body;
  let amountOrRatio = req.body.amount || req.body.ratio;
  amountOrRatio = parseFloat(amountOrRatio);
  if (!fromUnitAbbrev || !toUnitAbbrev) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide both units",
    });
  } else if (!validateStrictPositiveNumber(amountOrRatio)) {
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

// Food validations
export function validateFood(req, res, next) {
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
  if (
    undefOrNull(name) ||
    undefOrNull(baseServingSize) ||
    undefOrNull(baseServingUnitAbbrev) ||
    undefOrNull(calories) ||
    undefOrNull(protein) ||
    undefOrNull(carbs) ||
    undefOrNull(fat) ||
    undefOrNull(sugar)
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  const numbers = [baseServingSize, calories, protein, carbs, fat, sugar];
  if (numbers.some((number) => !validatePositiveNumber(number))) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide valid numbers" });
  }

  next();
}

export function validateQueryFood(req, res, next) {
  const { sortBy, sortOrder, limit, offset, filters } = req.body;
  if (!undefOrNull(sortBy) && !isSortCriteria(sortBy)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid sortBy criteria",
    });
  }
  if (!undefOrNull(sortOrder) && !isSortOrder(sortOrder)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid sortOrder criteria",
    });
  }
  if (!undefOrNull(limit) && !validatePositiveNumber(limit)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid limit",
    });
  }
  if (!undefOrNull(offset) && !validatePositiveNumber(offset)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid offset",
    });
  }
  if (!undefOrNull(filters) && typeof filters !== "object") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid filters",
    });
  }
  next();
}
