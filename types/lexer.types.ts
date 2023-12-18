import type LexerTokenTypes from "./lexer.tokens";

export interface LineError {
  charNum?: number,
  where: string,
  what: string,
};

export interface LineInfo {
  lineNum: number,
  charNum: number
};

export interface IGarbageLangLexer {
  tokenize (fileData: string): void;
  getTokens(): LexerTokenTypes.Token[]
};
