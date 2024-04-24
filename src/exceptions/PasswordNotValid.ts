import { StatusCodes } from "http-status-codes";

export class PasswordNotValid extends Error {
  status = StatusCodes.BAD_REQUEST;
  constructor(message: string = "Password not valid") {
    super(message);
    this.name = "PasswordNotValid";
  }
}
