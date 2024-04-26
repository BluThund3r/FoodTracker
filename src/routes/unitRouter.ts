import express from "express";
import { isLoggedIn, isAdmin } from "../middlewares/usefulMiddlewares";
import {
  validateUnitConvert,
  validateUnitCreate,
} from "../middlewares/validationMiddlewares";
import {
  convertByAbbrevs,
  createConversionByAbbrevs,
  createUnit,
  deleteConversion,
  deleteUnit,
  getConversionByAbbrevs,
  getUnitByAbbrev,
  getUnitById,
  updateConversion,
  updateUnit,
} from "../services/unitService";
import { ServingUnit } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { UnitNotFound } from "../exceptions/UnitNotFound";

const unitRouter = express.Router();

unitRouter.post(
  "/create",
  isLoggedIn,
  isAdmin,
  validateUnitCreate,
  (req, res, next) => {
    const { name, abbreviation } = req.body;
    const unitCreate = {
      name,
      abbreviation,
    };
    createUnit(unitCreate)
      .then((unit) => {
        res.status(StatusCodes.CREATED).json(unit);
      })
      .catch(next);
  }
);

unitRouter.post(
  "/createConversion",
  isLoggedIn,
  isAdmin,
  validateUnitConvert,
  (req, res, next) => {
    const { fromUnitAbbrev, toUnitAbbrev, ratio } = req.body;
    createConversionByAbbrevs(fromUnitAbbrev, toUnitAbbrev, ratio)
      .then((conversion) => {
        res.status(StatusCodes.CREATED).json(conversion);
      })
      .catch(next);
  }
);

unitRouter.get("/convert", validateUnitConvert, (req, res, next) => {
  const { fromUnitAbbrev, toUnitAbbrev, amount } = req.body;
  convertByAbbrevs(fromUnitAbbrev, toUnitAbbrev, amount)
    .then((converted) => {
      res.status(StatusCodes.OK).json(converted);
    })
    .catch(next);
});

unitRouter
  .route("/:abbr")
  .get(async (req, res, next) => {
    const { abbr } = req.params;
    try {
      const unit = await getUnitByAbbrev(abbr);
      if (!unit) throw new UnitNotFound();
      res.status(StatusCodes.OK).json(unit);
    } catch (e) {
      next(e);
    }
  })
  .put(isLoggedIn, isAdmin, validateUnitCreate, async (req, res, next) => {
    const { name, abbreviation } = req.body;
    const { abbr } = req.params;

    const unitUpdate: ServingUnit = await getUnitByAbbrev(abbr);
    if (!unitUpdate) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Unit not found",
      });
      return;
    }
    unitUpdate.name = name;
    unitUpdate.abbreviation = abbreviation;

    updateUnit(unitUpdate.id, unitUpdate)
      .then((unit) => {
        res.status(StatusCodes.OK).json(unit);
      })
      .catch(next);
  })
  .delete(isLoggedIn, isAdmin, async (req, res, next) => {
    const { abbr } = req.params;
    const unitDelete = await getUnitByAbbrev(abbr);
    if (!unitDelete) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Unit not found",
      });
      return;
    }
    try {
      return res.status(StatusCodes.OK).json(deleteUnit(unitDelete.id));
    } catch (e) {
      next(e);
    }
  });

unitRouter
  .route("/unitConversion/:fromAbbr/:toAbbr")
  .get((req, res, next) => {
    const { fromAbbr, toAbbr } = req.params;
    getConversionByAbbrevs(fromAbbr, toAbbr)
      .then((conversion) => {
        res.status(StatusCodes.OK).json(conversion);
      })
      .catch(next);
  })
  .put(isLoggedIn, isAdmin, validateUnitConvert, async (req, res, next) => {
    const { fromAbbr, toAbbr } = req.params;
    const { ratio } = req.body;

    let conversionUpdate;
    try {
      conversionUpdate = await getConversionByAbbrevs(fromAbbr, toAbbr);
    } catch (e) {
      next(e);
    }

    updateConversion(
      conversionUpdate.fromUnitId,
      conversionUpdate.toUnitId,
      ratio
    )
      .then((conversion) => {
        res.status(StatusCodes.OK).json(conversion);
      })
      .catch(next);
  })
  .delete(isLoggedIn, isAdmin, async (req, res, next) => {
    const { fromAbbr, toAbbr } = req.params;
    try {
      const conversionDelete = await getConversionByAbbrevs(fromAbbr, toAbbr);
      return res
        .status(StatusCodes.OK)
        .json(
          deleteConversion(
            conversionDelete.fromUnitId,
            conversionDelete.toUnitId
          )
        );
    } catch (e) {
      next(e);
    }
  });

export default unitRouter;
