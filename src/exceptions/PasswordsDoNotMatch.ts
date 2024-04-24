import { StatusCodes } from "http-status-codes";

export class PasswordsDoNotMatch extends Error {
  status = StatusCodes.BAD_REQUEST;
  constructor() {
    super("Passwords do not match");
    this.name = "PasswordsDoNotMatch";
  }
}
