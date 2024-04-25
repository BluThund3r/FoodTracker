import { StatusCodes } from "http-status-codes";

export class UnitNotFound extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor() {
    super("Unit not found");
    this.name = "UnitNotFound";
  }
}
