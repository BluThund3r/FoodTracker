import { StatusCodes } from "http-status-codes";

export class MealNotBelongToUser extends Error {
  status = StatusCodes.FORBIDDEN;
  constructor() {
    super("Meal does not belong to user");
    this.name = "MealNotBelongToUser";
  }
}
