namespace FrontendErrors {
  export class SyntaxError extends Error {
    message: string;
    constructor (message: string) {
      super();
      this.name = "SyntaxError";
      this.message = message;
    };
  };

  export interface LineError {
    char: number,
    line: number,
    where: string,
    what: string,
  };
};

export default FrontendErrors;
