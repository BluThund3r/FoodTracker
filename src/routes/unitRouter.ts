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

const unitRouter = express.Router();

unitRouter.post(
  "/create",
  isLoggedIn,
  isAdmin,
  validateUnitCreate,
  (req, res, next) => {
    const { name, abbreviation } = req.body;
    const unitCreate: ServingUnit = {
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
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
  .get((req, res, next) => {
    const { abbr } = req.params;
    getUnitByAbbrev(abbr)
      .then((unit) => {
        res.status(StatusCodes.OK).json(unit);
      })
      .catch(next);
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
    updateUnit(abbr, unitUpdate)
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
  .route("/unitConversion/:abbr1/:abbr2")
  .get((req, res, next) => {
    const { abbr1, abbr2 } = req.params;
    getConversionByAbbrevs(abbr1, abbr2)
      .then((conversion) => {
        res.status(StatusCodes.OK).json(conversion);
      })
      .catch(next);
  })
  .put(isLoggedIn, isAdmin, validateUnitConvert, async (req, res, next) => {
    const { abbr1, abbr2 } = req.params;
    const { ratio } = req.body;

    let conversionUpdate;
    try {
      conversionUpdate = await getConversionByAbbrevs(abbr1, abbr2);
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
    const { abbr1, abbr2 } = req.params;
    try {
      const conversionDelete = await getConversionByAbbrevs(abbr1, abbr2);
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
