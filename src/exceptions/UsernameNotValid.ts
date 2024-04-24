export class UsernameNotValid extends Error {
  constructor(message: string = "Username not valid") {
    super(message);
    this.name = "UsernameNotValid";
  }
}
