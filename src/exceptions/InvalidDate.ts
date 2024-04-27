import { StatusCodes } from "http-status-codes";

export class InvalidDate extends Error {
  status = StatusCodes.BAD_REQUEST;
  constructor() {
    super("Invalid date");
    this.name = "InvalidDate";
  }
}
