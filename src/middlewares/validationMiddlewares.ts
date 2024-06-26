import { StatusCodes } from "http-status-codes";
import { isSortCriteria, isSortOrder } from "../types/foodTypes";
import { isActivityLevel, isGender, isPlan } from "../services/userService";
import { InvalidDateFormat } from "../exceptions/InvalidDateFormat";
import { InvalidDate } from "../exceptions/InvalidDate";
import { isMealName } from "../services/mealService";

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

// TODO: Restrict the date to be in the past with at most 1 year
function isDateWithValidFormat(date) {
  const minimumYear = 2000;
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  if (!dateRegex.test(date)) throw new InvalidDateFormat();

  const parsedDate = new Date(date);
  if (!isNaN(parsedDate.getTime())) throw new InvalidDate();

  if (parsedDate.getFullYear() < minimumYear) throw new InvalidDate();

  return true;
}

// Unit validations
export function validateUnitConvert(req, res, next) {
  const { fromAbbrev, toAbbrev } = req.params;
  let amountOrRatio = req.params.amount || req.params.ratio;
  amountOrRatio = parseFloat(amountOrRatio);
  if (!fromAbbrev || !toAbbrev) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide both units",
    });
  } else if (!validateStrictPositiveNumber(amountOrRatio)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide a valid ratio",
    });
  } else if (
    !req.originalUrl.includes("/convert/") &&
    fromAbbrev === toAbbrev
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "From unit and to unit cannot be the same",
    });
  }
  req.params.amount = amountOrRatio;
  req.params.ratio = amountOrRatio;
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

export function validateUserDetails(req, res, next) {
  const { weight, height, age, plan, gender, activityLevel } = req.body;
  if (
    undefOrNull(weight) ||
    undefOrNull(height) ||
    undefOrNull(age) ||
    undefOrNull(plan) ||
    undefOrNull(gender) ||
    undefOrNull(activityLevel)
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  const numbers = [weight, height, age];
  if (numbers.some((number) => !validateStrictPositiveNumber(number))) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide valid numbers" });
  }

  if (!isPlan(plan)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid plan",
    });
  }

  if (!isGender(gender)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid gender",
    });
  }

  if (!isActivityLevel(activityLevel)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid activity level",
    });
  }

  next();
}

export function validateDateQuery(req, res, next) {
  const date = req.query.date as string;
  if (!date) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide a date",
    });
  }

  if (isDateWithValidFormat(date)) {
    // if not, an error is thrown
    next();
  }
}

export function validateDateBody(req, res, next) {
  const date = req.body.date;
  if (!date) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide a date",
    });
  }

  if (isDateWithValidFormat(date)) {
    // if not, an error is thrown
    next();
  }
}

export function validateMealCreate(req, res, next) {
  const { name, date } = req.body;
  if (!name || !date) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  if (!isMealName(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid meal name",
    });
  }

  if (isDateWithValidFormat(date)) {
    // if not, an error is thrown
    next();
  }
}

export function validateAddFood(req, res, next) {
  const { mealId, foodId, amount, unitAbbrev } = req.body;
  if (!mealId || !foodId || undefOrNull(amount) || !unitAbbrev) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  if (!validateStrictPositiveNumber(amount)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid amount",
    });
  }

  next();
}

export function validateMealItemId(req, res, next) {
  const mealItemId = req.params.mealItemId;
  if (!mealItemId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide a meal item id",
    });
  }

  next();
}

export function validateUpdateMealItem(req, res, next) {
  const { amount, unitAbbrev } = req.body;
  if (!undefOrNull(amount) && !validateStrictPositiveNumber(amount)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid amount",
    });
  }
  if (!unitAbbrev) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid unit abbreviation",
    });
  }

  next();
}

export function validateCreateExercise(req, res, next) {
  const { name, caloriesPerMinute } = req.body;
  if (!name || undefOrNull(caloriesPerMinute)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  if (!validateStrictPositiveNumber(caloriesPerMinute)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid calories per minute",
    });
  }

  next();
}

export function validateExerciseSearch(req, res, next) {
  let { name, limit, offset } = req.query;
  name = name as string;
  limit = parseInt(limit as string);
  offset = parseInt(offset as string);
  if (!name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide a name",
    });
  }
  console.log("Limit:", limit, "Offset:", offset);

  if (!isNaN(limit) && !validatePositiveNumber(limit)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid limit",
    });
  }

  if (!isNaN(offset) && !validatePositiveNumber(offset)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid offset",
    });
  }

  req.query.search = { name, limit, offset };

  next();
}

export function validateAddExercise(req, res, next) {
  const { name, duration } = req.body;
  if (!name || undefOrNull(duration)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  if (!validateStrictPositiveNumber(duration)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid duration",
    });
  }

  next();
}

export function validateExerciseNameBody(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  next();
}

export function validateExerciseNameQuery(req, res, next) {
  const { name } = req.query;
  if (!name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all fields",
    });
  }

  next();
}
