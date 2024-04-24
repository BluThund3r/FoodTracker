class PasswordsDoNotMatch extends Error {
  constructor() {
    super("Passwords do not match");
    this.name = "PasswordsDoNotMatch";
  }
}
