import { StatusCodes } from "http-status-codes";

export class UserNotFound extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor() {
    super("User not found");
    this.name = "UserNotFound";
  }
}
