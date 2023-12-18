import type LexerGrammarTypes from "./lexer.grammar.types"

namespace LexerTokenTypes {
  // added line + char nums just in case we cannot spot any errors in the lexer, then the parser has something to work with.
  export type Token = {
    id: LexerGrammarTypes.LangTokenIdentifier,
    lexeme: string,
    line: number,
    char: number
  };
};

export default LexerTokenTypes;
