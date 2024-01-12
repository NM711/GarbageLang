import LexerGrammarTypes from "../types/lexer/lexer.grammar.types";
import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageErrors from "../types/errors.types";
import type { IdentifierType } from "../types/general.types";
import type { Token } from "../types/lexer/lexer.types";

interface ExpectedErrorParams {
  id: LexerGrammarTypes.LangTokenIdentifier
  token: Token
  mssg: string
  at?: string
};

/**
 * @class GarbageParser
 * @description
 * My implementation of a recursive decent parser,
 */

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
    });
  };

  private expectSemicolon() {
    if (this.look().id !== LexerGrammarTypes.LangTokenIdentifier.SEMICOLON) {
      throw this.expected({ id: LexerGrammarTypes.LangTokenIdentifier.SEMICOLON, mssg: "Expected ending semicolon!", token: this.look() });
    };
  };

  // private parseForLoop(): AbstractSyntaxTreeTypes.ForStatementNode {
  //   this.eat();

  //   this.expected({
  //     id: LexerGrammarTypes.LangTokenIdentifier.LEFT_PARENTHESES,
  //     mssg: "Expected an opening parenthesis!",
  //     token: this.eat()
  //   });

  //   this.parse();
  //   this.expectSemicolon();
  //   this.parseExpr();
  //   this.expectSemicolon();
    
    
  // };

  private parseVar (): AbstractSyntaxTreeTypes.VariableDeclarationNode {
    let isConstant: boolean = false;

    if (this.look().id === LexerGrammarTypes.LangTokenIdentifier.CONSTANT) {
      isConstant = true;
    };

    this.eat();

    const assignmentNode = this.parseAssignment(true);

    return {
      type: AbstractSyntaxTreeTypes.NodeType.DECLARATION_VAR,
      isConstant,
      assignment: assignmentNode
    };
  };

  private parseAssignment(isDeclaring: boolean): AbstractSyntaxTreeTypes.ExpressionAssignmentNode {
    let varType: IdentifierType | null = null;

    if (this.look().id !== LexerGrammarTypes.LangTokenIdentifier.LITERAL) {
      throw this.expected({
        id: LexerGrammarTypes.LangTokenIdentifier.LITERAL,
        token: this.look(),
        mssg: "Expected literal!"
      });
    };    

    const ident = this.eat();
    
    if (isDeclaring) {
      const isType = LexerGrammarTypes.DataTypeKeywordMap[this.look().lexeme];
      if (!isType) {
        throw new GarbageErrors.FrontendErrors.ParserError({
          message: "Expected a valid type after variable identifier!",
          char: this.look().char,
          line: this.look().line,
          at: this.look().lexeme
        });
      };

      varType = this.eat().lexeme as IdentifierType;
    };

    if (this.look().id === LexerGrammarTypes.LangTokenIdentifier.EQUAL && isDeclaring && varType) {
      this.eat();
      const exprValue = this.parseExpr() as AbstractSyntaxTreeTypes.Expr | AbstractSyntaxTreeTypes.Literal;
      this.expectSemicolon();
      return {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_ASSIGN,
        left: {
          type: AbstractSyntaxTreeTypes.NodeType.IDENT,
          name: ident.lexeme,
          identiferType: varType
        },
        right: exprValue
      }

    } else if (this.look().id === LexerGrammarTypes.LangTokenIdentifier.EQUAL) {
      this.eat();
      const exprValue = this.parseExpr() as AbstractSyntaxTreeTypes.Expr | AbstractSyntaxTreeTypes.Literal;
      this.expectSemicolon();
      return {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_ASSIGN,
        left: {
          type: AbstractSyntaxTreeTypes.NodeType.IDENT,
          name: ident.lexeme
        },
        right: exprValue
      };
    } else {
      this.eat();
      this.expectSemicolon();
      return {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_ASSIGN,
        left: {
          type: AbstractSyntaxTreeTypes.NodeType.IDENT,
          name: ident.lexeme
        },
        right: this.parsePrimary()
      };
    };
  };

  // make a helper class to dump non parser related methods.

  private isMultiplicative(): boolean {
    return [
      LexerGrammarTypes.LangTokenIdentifier.MULTIPLICATION,
      LexerGrammarTypes.LangTokenIdentifier.DIVISION
    ].includes(this.look().id);
  };

  private isPrefix(): boolean {
    return [
      LexerGrammarTypes.LangTokenIdentifier.PREFIX_INCREMENT,
      LexerGrammarTypes.LangTokenIdentifier.PREFIX_DECREMENT
    ].includes(this.look().id);
  };

  private isAdditive(): boolean {
    return [
      LexerGrammarTypes.LangTokenIdentifier.ADDITION,
      LexerGrammarTypes.LangTokenIdentifier.SUBTRACTION
    ].includes(this.look().id);
  };

  private parsePrefix(): AbstractSyntaxTreeTypes.ExpressionPrefixer | AbstractSyntaxTreeTypes.Literal {
    if (this.look() && this.isPrefix()) {
      
      const prefixOperator = this.eat();
     
        if (this.look().id !== LexerGrammarTypes.LangTokenIdentifier.LITERAL) {
          throw this.expected({ id: LexerGrammarTypes.LangTokenIdentifier.LITERAL, token: this.look(), mssg: "Expected valid identifier!" });
        };
      
      const ident = this.eat();

      this.expectSemicolon()

      return {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_PREFIXER,
        left: {
          type: AbstractSyntaxTreeTypes.NodeType.IDENT,
          name: ident.lexeme,
        },
        prefix: prefixOperator.lexeme as AbstractSyntaxTreeTypes.PrefixOperators
      };
    };
    
    return this.parsePrimary();
  };

  private parseMultiplicative (): AbstractSyntaxTreeTypes.TreeNodeType {
    let left: AbstractSyntaxTreeTypes.TreeNodeType = this.parsePrefix();
    console.log(left)
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

  private parseAdditive(): AbstractSyntaxTreeTypes.TreeNodeType {
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
        return {
          type: AbstractSyntaxTreeTypes.NodeType.NUM_LITERAL,
          value: parseInt(this.eat().lexeme)
        };
      case LexerGrammarTypes.LangTokenIdentifier.FLOAT:
        return {
          type: AbstractSyntaxTreeTypes.NodeType.NUM_LITERAL,
          value: parseFloat(this.eat().lexeme)
        };
      case LexerGrammarTypes.LangTokenIdentifier.STRING:
        return {
          type: AbstractSyntaxTreeTypes.NodeType.STR_LITERAL,
          value: this.eat().lexeme
        };
      // since the semicolon kinda gets pushed into the expr
      case LexerGrammarTypes.LangTokenIdentifier.SEMICOLON:
        return {
          type: AbstractSyntaxTreeTypes.NodeType.STATEMENT_END,
          value: this.eat().lexeme as ";"
        };

      default:
        throw new GarbageErrors.FrontendErrors.ParserError({
          message: "Unexpected token found while parsing the expression!",
          at: this.look().lexeme,
          line: this.look().line,
          char: this.look().char
        });
    };
  };

  private parseExpr() {
    return this.parseAdditive();
  };

  private parse(): AbstractSyntaxTreeTypes.TreeNodeType {
    switch (this.look().id) {
       case LexerGrammarTypes.LangTokenIdentifier.VARIABLE:
       case LexerGrammarTypes.LangTokenIdentifier.CONSTANT:
         return this.parseVar();
      //  case LexerGrammarTypes.LangTokenIdentifier.FOR:
        //  return this.parseForLoop();

       case LexerGrammarTypes.LangTokenIdentifier.LITERAL:
          // if a literal is straight up being called, we are supposing its a variable looking for reassingment
          // if not an error will be thrown 
          return this.parseAssignment(false);
       

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

      //console.log(JSON.stringify(root, null, 2))
      return root;
  };
};

export default GarbageParser;