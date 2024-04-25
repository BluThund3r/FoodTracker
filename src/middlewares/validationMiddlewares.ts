import { StatusCodes } from "http-status-codes";

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
