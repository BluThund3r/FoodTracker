export class ConversionNotFound extends Error {
  status: number = 404;
  constructor(message: string = "Conversion not found") {
    super(message);
    this.name = "ConversionNotFound";
  }
}
