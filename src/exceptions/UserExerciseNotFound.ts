import { StatusCodes } from "http-status-codes";

export class UserExerciseNotFond extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor() {
    super("User Exercise not found");
    this.name = "UserExerciseNotFond";
  }
}
