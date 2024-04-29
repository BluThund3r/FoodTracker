import { StatusCodes } from "http-status-codes";

export class UserDetailsNotAdded extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor() {
    super("User details not added");
    this.name = "UserDetailsNotAdded";
  }
}
