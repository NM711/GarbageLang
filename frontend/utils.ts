import type LexerTokenTypes from "../types/lexer.tokens";
import LexerGrammarTypes from "../types/lexer.grammar.types";

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
  const isTrue = /^[A-Za-z]+$/.test(char);
  return isTrue;
};


export function isNumId (token: LexerTokenTypes.Token): boolean {
  if (token.id === LexerGrammarTypes.LangTokenIdentifier.INT || token.id === LexerGrammarTypes.LangTokenIdentifier.FLOAT) {
    return true;
  };

  return false;
};
