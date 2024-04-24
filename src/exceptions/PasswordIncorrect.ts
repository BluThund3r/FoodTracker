export class PasswordIncorrect extends Error {
  constructor(message: string = "Password not correct") {
    super(message);
    this.name = "PasswordIncorrect";
  }
}
