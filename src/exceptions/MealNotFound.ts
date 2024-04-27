import { StatusCodes } from "http-status-codes";

export class MealNotFound extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor() {
    super("Meal not found");
    this.name = "MealNotFound";
  }
}
