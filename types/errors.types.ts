namespace FrontendErrors {

  export interface IFrontendErrorParams {
    message: string
    line: number
    char: number
    at: string
  };

  export class SyntaxError extends Error {
    private char: number;
    private line: number;
    private at: string
    constructor ({ message, at, line, char }: IFrontendErrorParams) {
      super(message);
      this.name = "SyntaxError";
      this.line = line;
      this.char = char;
      this.at = at;
    };
  };

  export class ParserError extends Error {
    private char: number;
    private line: number;
    private at: string;
    constructor ({ message, at, line, char }: IFrontendErrorParams) {
      super(message);
      this.name = "ParserError";
      this.line = line;
      this.char = char;
      this.at = at;
    };
  };
};

export default FrontendErrors;
