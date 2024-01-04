import LexerGrammarTypes from "../types/lexer.grammar.types";
import AbstractSyntaxTreeTypes from "../types/ast.types";
import FrontendErrors from "../types/errors.types";
import type LexerTokenTypes from "../types/lexer.tokens";
import {isNumId, isNumber, isOperator} from "./utils";

class GarbageParser {
  private tokens: LexerTokenTypes.Token[];

  constructor () {
    this.tokens = [];
  };

  public set setTokens (tokens: LexerTokenTypes.Token[]) {
    this.tokens = tokens;
  };

  private look() {
    return this.tokens[0] as LexerTokenTypes.Token;
  };

  private eat(): LexerTokenTypes.Token {

    const token = this.tokens.shift();

    if (!token) {
      console.error(`Expected Token, but instead got ${undefined}`);
      process.exit(1);
    };
    console.log(this.tokens)
    return token;
  };

  private expected (id: LexerGrammarTypes.LangTokenIdentifier, errorMssg: string) {
    if (!this.look() || this.look().id !== id) {
      throw new FrontendErrors.ParserError({
        message: `Expected token id of ${id}, instead got token id of ${this.look().id} => ${errorMssg}`,
        line: this.look().line || 0,
        char: this.look().char || 0,
        at: `${this.look().lexeme}`
      })
    };
  };

  private parseVar () {

  };

  private isMultiplicative (): boolean {
    return [LexerGrammarTypes.LangTokenIdentifier.MULTIPLICATION, LexerGrammarTypes.LangTokenIdentifier.DIVISION].includes(this.look().id);
  };

  private isAdditive (): boolean {
    return [LexerGrammarTypes.LangTokenIdentifier.ADDITION, LexerGrammarTypes.LangTokenIdentifier.SUBTRACTION].includes(this.look().id);
  };

  // 300 + 200 * 2

  private parseMultiplicative () {
    let left: AbstractSyntaxTreeTypes.DeclarationLiteralValue | AbstractSyntaxTreeTypes.Expr = this.parsePrimary();

    while (this.look() && this.isMultiplicative()) {
      const operator = this.eat();
      const right = this.parsePrimary();

      left = {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY,
        left: left as AbstractSyntaxTreeTypes.DeclarationLiteralValue,
        right,
        operator: operator.lexeme as AbstractSyntaxTreeTypes.ExpressionOperator
      };
    };

    return left;
  };

  private parseAdditive () {
    let left = this.parseMultiplicative();
    while (this.look() && this.isAdditive()) {
      const operator = this.eat();
      const right = this.parseMultiplicative();

      left = {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY,
        left: left as AbstractSyntaxTreeTypes.DeclarationLiteralValue,
        right,
        operator: operator.lexeme as AbstractSyntaxTreeTypes.ExpressionOperator
      };
    };

    return left;
  };

  private parsePrimary (): AbstractSyntaxTreeTypes.DeclarationLiteralValue {

    switch (this.look().id) {
      case LexerGrammarTypes.LangTokenIdentifier.INT:
      case LexerGrammarTypes.LangTokenIdentifier.FLOAT:
        return {
          type: AbstractSyntaxTreeTypes.NodeType.NUM_LITERAL,
          value: parseInt(this.eat().lexeme)
        };

      case LexerGrammarTypes.LangTokenIdentifier.STRING:
        return {
          type: AbstractSyntaxTreeTypes.NodeType.STR_LITERAL,
          value: this.eat().lexeme
        };
      default:

        throw new FrontendErrors.ParserError({
          message: "Unexpected token found while parsing the expression!",
          at: this.look().lexeme,
          line: this.look().line,
          char: this.look().char
        });
    };
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

      while (this.look().id !== LexerGrammarTypes.LangTokenIdentifier.EOF) {
        root.body.push(this.parse());
      };

      //console.log(JSON.stringify(root.body, null, 2))
      console.log(root.body)
    
      return root;
  };
};

export default GarbageParser;
