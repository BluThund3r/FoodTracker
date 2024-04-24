import { StatusCodes } from "http-status-codes";

export class UserAlreadyExists extends Error {
  status = StatusCodes.CONFLICT;
  constructor() {
    super("User already exists");
    this.name = "UserAlreadyExists";
  }
}
