class PasswordNotValid extends Error {
  constructor(message: string = "Password not valid") {
    super(message);
    this.name = "PasswordNotValid";
  }
}
