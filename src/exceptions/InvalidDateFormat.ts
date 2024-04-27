import { StatusCodes } from "http-status-codes";

export class InvalidDateFormat extends Error {
  status: StatusCodes.BAD_REQUEST;
  constructor() {
    super("Invalid date format");
    this.name = "InvalidDateFormat";
  }
}
