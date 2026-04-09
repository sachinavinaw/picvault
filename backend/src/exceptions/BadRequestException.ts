export class BadRequestException extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestException";
    this.status = 400;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
