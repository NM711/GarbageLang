import type LexerTokenTypes from "./lexer.tokens";

export interface LineInfo {
  lineNum: number,
  charNum: number
};

export interface IGarbageLangLexer {
  tokenize (fileData: string): void;
  getTokens(): LexerTokenTypes.Token[]
};
