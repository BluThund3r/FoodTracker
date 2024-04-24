import { StatusCodes } from "http-status-codes";

export class UsernameNotValid extends Error {
  status = StatusCodes.BAD_REQUEST;
  constructor(message: string = "Username not valid") {
    super(message);
    this.name = "UsernameNotValid";
  }
}
