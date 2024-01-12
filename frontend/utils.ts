import LexerGrammarTypes from "../types/lexer/lexer.grammar.types";
import type { Token } from "../types/lexer/lexer.types";

export function isNumber(char: string): boolean {
  const num = Number(char);

  // When "0" is tested as a number, the output will be false. So in this case we check the char;
  // "." to search for floats.
  if (num || char === "0" || char === ".") {
    return true;
  } else {
    return false;
  };
};

export function isAlphabet(char: string): boolean {
  if (!char) return false;
  return /^[A-Za-z]+$/.test(char);
};

export function isNumId (token: Token): boolean {
  return token.id === LexerGrammarTypes.LangTokenIdentifier.INT || token.id === LexerGrammarTypes.LangTokenIdentifier.FLOAT
};

export const isOperator = (operator: string) => LexerGrammarTypes.OperatorKeywordMap[operator];
