import GarbageErrors from "../../types/errors.types";
import {IdentifierType} from "../../types/general.types";
import LexerGrammarTypes from "../../types/lexer/lexer.grammar.types";
import type { Token } from "../../types/lexer/lexer.types";

interface ExpectedErrorParams {
  id: LexerGrammarTypes.LangTokenIdentifier
  token: Token
  mssg: string
  at?: string
};

class ParserHelpers {
  constructor () {};

  public expected ({ id, token, mssg, at }: ExpectedErrorParams) {
    throw new GarbageErrors.FrontendErrors.ParserError({
      message: `Expected token id of ${id}, instead got token id of ${token.id} => ${mssg}`,
      line: token.line,
      char: token.char,
      at: at ?? token.lexeme
    });
  };

  public expect({ id, token, mssg, at }: ExpectedErrorParams) {
    if (token.id !== id) {
      throw this.expected({ id, token, mssg, at });
    };

    return token;
  };

  public expectSemicolon(look: Token) {
    this.expect({ id: LexerGrammarTypes.LangTokenIdentifier.SEMICOLON, token: look, mssg: "Expected ending semicolon!" });
  };

  public checkType(token: Token): IdentifierType {
    const isType = LexerGrammarTypes.DataTypeKeywordMap[token.lexeme];
    if (!isType) {
      throw new GarbageErrors.FrontendErrors.ParserError({
        message: "Expected a valid type!",
        char: token.char,
        line: token.line,
        at: token.lexeme
      });
    };
    return token.lexeme as IdentifierType; 
  };

  public isAdditive(token: Token): boolean {
    return [
      LexerGrammarTypes.LangTokenIdentifier.ADDITION,
      LexerGrammarTypes.LangTokenIdentifier.SUBTRACTION
    ].includes(token.id);
  };

  public isMultiplicative(token: Token): boolean {
    return [
      LexerGrammarTypes.LangTokenIdentifier.MULTIPLICATION,
      LexerGrammarTypes.LangTokenIdentifier.DIVISION
    ].includes(token.id);
  };

  public isPrefix(token: Token): boolean {
    return [
      LexerGrammarTypes.LangTokenIdentifier.PREFIX_INCREMENT,
      LexerGrammarTypes.LangTokenIdentifier.PREFIX_DECREMENT
    ].includes(token.id);
  };

  public isInequality(token: Token): boolean {
    return [
      LexerGrammarTypes.LangTokenIdentifier.GREATER,
      LexerGrammarTypes.LangTokenIdentifier.GREATER_OR_EQUAL,
      LexerGrammarTypes.LangTokenIdentifier.LESSER,
      LexerGrammarTypes.LangTokenIdentifier.LESSER_OR_EQUAL
    ].includes(token.id);
  };
};

export default ParserHelpers;
