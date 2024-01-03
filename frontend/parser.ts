// consider renaming to GrammarTypes instead, since its no longer lexer specific
import LexerGrammarTypes from "../types/lexer.grammar.types";
import AbstractSyntaxTreeTypes from "../types/ast.types";
import FrontendErrors from "../types/errors.types";
import { isNumId, isOperator } from "./utils";
import type LexerTokenTypes from "../types/lexer.tokens";

class GarbageParser {
  private tokens: LexerTokenTypes.Token[];
  private expression: LexerTokenTypes.Token[];

  constructor () {
    this.tokens = [];
    this.expression = [];
  };

  public set setTokens (tokens: LexerTokenTypes.Token[]) {
    this.tokens = tokens;
  };

  private look() {
    return this.tokens[0] as LexerTokenTypes.Token;
  };

  private peekExpr() {
    return this.expression[1] as LexerTokenTypes.Token;
  };

  private lookExpr(){
    return this.expression[0] as LexerTokenTypes.Token;
  };

  private eat(): LexerTokenTypes.Token {

    const token = this.tokens.shift();

    if (!token) {
      console.error(`Expected Token, but instead got ${undefined}`);
      process.exit(1);
    };

    return token;
  };

  private expected (id: LexerGrammarTypes.LangTokenIdentifier, errorMssg: string) {
    const consumed = this.eat();

    if (!consumed || consumed.id !== id) {
      throw new FrontendErrors.ParserError({
        message: `Expected token id of ${id}, instead got token id of ${consumed?.id} => ${errorMssg}`,
        line: consumed?.line || 0,
        char: consumed?.char || 0,
        at: `${consumed?.lexeme}`
      })
    };
  };

  private parseVar () {

  };

  private parseMultiplicative() {
    let left = this.eat();

    while (this.look().id === LexerGrammarTypes.LangTokenIdentifier.MULTIPLICATION && this.look().id === LexerGrammarTypes.LangTokenIdentifier.DIVISION)  {
      const operator = this.eat();
      let right = this.eat();

      left = {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY,
        left,
        right,
        operator
      };
    };

    return left;
  };

  private parseAdditive () {
    let left = this.parseMultiplicative();

    while (this.look().id === LexerGrammarTypes.LangTokenIdentifier.ADDITION || this.look().id === LexerGrammarTypes.LangTokenIdentifier.SUBTRACTION) {
      const operator = this.eat();
      let right = this.eat();

      left = {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY,
        left,
        right,
        operator
      };

      console.log(left);
    };
    return left;
  };

  private parseExpr () {
    return this.parseAdditive();
  };

  private parse () {
    switch (this.look().id) {
      case LexerGrammarTypes.LangTokenIdentifier.VARIABLE:
      case LexerGrammarTypes.LangTokenIdentifier.CONSTANT:
      break;

      default: {
        return this.parseExpr()
      };
    };
  };

  public generateAST(): AbstractSyntaxTreeTypes.ProgramNode {
      const root: AbstractSyntaxTreeTypes.ProgramNode = {
        type: AbstractSyntaxTreeTypes.NodeType.PROGRAM,
        body: []
      };

      while (this.tokens.length > 0) {
        root.body.push(this.parse());
      };

      return root;
  };
};

export default GarbageParser;
