import type LexerGrammarTypes from "./lexer.grammar.types";

export interface LineInfo {
  lineNum: number,
  charNum: number
};

export type Token = {
  id: LexerGrammarTypes.LangTokenIdentifier,
  lexeme: string,
  line: number,
  char: number
};