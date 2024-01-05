import LexerGrammarTypes from "../types/lexer/lexer.grammar.types";
import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageErrors from "../types/errors.types";
import type { Token } from "../types/lexer/lexer.types";

interface ExpectedErrorParams {
  id: LexerGrammarTypes.LangTokenIdentifier
  token: Token
  mssg: string
  at?: string
};

class GarbageParser {
  private tokens: Token[];

  constructor () {
    this.tokens = [];
  };

  public set setTokens (tokens: Token[]) {
    this.tokens = tokens;
  };

  private look() {
    return this.tokens[0] as Token;
  };

  private eat(): Token {

    const token = this.tokens.shift();

    if (!token) {
      console.error(`Expected Token, but instead got ${undefined}`);
      process.exit(1);
    };
    return token;
  };

  private expected ({ id, token, mssg, at }: ExpectedErrorParams) {
    throw new GarbageErrors.FrontendErrors.ParserError({
      message: `Expected token id of ${id}, instead got token id of ${token.id} => ${mssg}`,
      line: token.line,
      char: token.char,
      at: at ?? token.lexeme
    })
  };

  private generateString(): AbstractSyntaxTreeTypes.StringLiteral {
    this.eat();

    let value: string = "";

    while (true) {
      const current = this.eat();

      value += current.lexeme;

      const next = this.eat();
      
      if (next.id === LexerGrammarTypes.LangTokenIdentifier.DOUBLE_QUOTE) break;

      if (next.id === LexerGrammarTypes.LangTokenIdentifier.LINE_BREAK || next.id === LexerGrammarTypes.LangTokenIdentifier.EOF) {
        throw this.expected({
          id: LexerGrammarTypes.LangTokenIdentifier.DOUBLE_QUOTE,
          token: next,
          mssg: "String was initialized but is missing closing double quote!",
          at: `${current.lexeme} ${next.lexeme}`
        });
      };

      value += next.lexeme;
    };

    return {
      type: AbstractSyntaxTreeTypes.NodeType.STR_LITERAL,
      value
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

  private parseMultiplicative (): AbstractSyntaxTreeTypes.Expr | AbstractSyntaxTreeTypes.Literal {
    let left: AbstractSyntaxTreeTypes.Literal | AbstractSyntaxTreeTypes.Expr = this.parsePrimary();

    while (this.look() && this.isMultiplicative()) {
      const operator = this.eat();
      const right = this.parsePrimary();

      left = {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY,
        left: left as AbstractSyntaxTreeTypes.Literal,
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
        left: left as AbstractSyntaxTreeTypes.Literal,
        right,
        operator: operator.lexeme as AbstractSyntaxTreeTypes.ExpressionOperator
      } as AbstractSyntaxTreeTypes.BinaryExpr;
    };

    return left;
  };

  private parsePrimary (): AbstractSyntaxTreeTypes.Literal {
    switch (this.look().id) {
      case LexerGrammarTypes.LangTokenIdentifier.INT:
      case LexerGrammarTypes.LangTokenIdentifier.FLOAT:
        return {
          type: AbstractSyntaxTreeTypes.NodeType.NUM_LITERAL,
          value: parseInt(this.eat().lexeme)
        };


      // generate string
      case LexerGrammarTypes.LangTokenIdentifier.DOUBLE_QUOTE:
        return this.generateString(); 
      
      default:
        throw new GarbageErrors.FrontendErrors.ParserError({
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

  private parse (): AbstractSyntaxTreeTypes.TreeNodeType {
    switch (this.look().id) {
      // case LexerGrammarTypes.LangTokenIdentifier.VARIABLE:
      // case LexerGrammarTypes.LangTokenIdentifier.CONSTANT:
      // break;

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

      console.log(JSON.stringify(root.body, null, 2))
      return root;
  };
};

export default GarbageParser;
