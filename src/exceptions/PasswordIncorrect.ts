import { StatusCodes } from "http-status-codes";

export class PasswordIncorrect extends Error {
  status = StatusCodes.UNAUTHORIZED;
  constructor(message: string = "Password not correct") {
    super(message);
    this.name = "PasswordIncorrect";
  }
}
