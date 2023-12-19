import FrontendErrors from "../../types/errors.types";

export function callSyntaxError ({ where, what, line, char }: FrontendErrors.LineError): SyntaxError {
  return new SyntaxError(`${what} ' ${where} ' at ===> (line: ${line} | char: ${char})`);
};
