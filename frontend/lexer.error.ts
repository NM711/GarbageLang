export class SyntaxError extends Error {
  message: string;
  constructor (message: string) {
    super();
    this.name = "SyntaxError";
    this.message = message;
  };
};
