namespace GarbageErrors {

  export namespace RuntimeErrors {
    
  };

  export namespace FrontendErrors {

    export interface IFrontendErrorParams {
      message: string
      line: number
      char: number
      at: string
    };
  
    class FrontendInterpreterError extends Error {
      private char: number;
      private line: number;
      private at: string;
  
      constructor(name: string, fee: IFrontendErrorParams) {
        super(fee.message);
        this.name = name;
        this.line = fee.line,
        this.char = fee.char,
        this.at = fee.at
      };
    };
  
    export class SyntaxError extends FrontendInterpreterError {
      constructor (fee: IFrontendErrorParams) {
        super("SyntaxError", fee);
      };
    };
  
    export class ParserError extends FrontendInterpreterError {
      constructor (fee: IFrontendErrorParams) {
        super("ParserError", fee);
      };
    };
  };
};


export default GarbageErrors