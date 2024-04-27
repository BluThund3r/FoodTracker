import { StatusCodes } from "http-status-codes";

export class ExerciseNotFond extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor() {
    super("Exercise not found");
    this.name = "ExerciseNotFound";
  }
}
