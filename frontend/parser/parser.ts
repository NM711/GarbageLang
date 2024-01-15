import ParserHelpers from "./helper";
import LexerGrammarTypes from "../../types/lexer/lexer.grammar.types";
import AbstractSyntaxTreeTypes from "../../types/ast.types";
import GarbageErrors from "../../types/errors.types";
import type { IdentifierType } from "../../types/general.types";
import type { Token } from "../../types/lexer/lexer.types";

/**
 * @class GarbageParser
 * @description
 * My implementation of a recursive decent parser,
 */

class GarbageParser {
  private tokens: Token[];
  private helpers: ParserHelpers;

  constructor () {
    this.tokens = [];
    this.helpers = new ParserHelpers();
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

  // we need to parse block first

  private parseBlock(): AbstractSyntaxTreeTypes.BlockStatementNode {
    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.LEFT_CURLY_BRACE, token: this.eat(), mssg: "Expected block statement opening!" })

    const body: AbstractSyntaxTreeTypes.TreeNodeType[] = [];

    while (this.look().id !== LexerGrammarTypes.LangTokenIdentifier.RIGHT_CURLY_BRACE) {
      body.push(this.parse());
    };

    this.helpers.expect({id: LexerGrammarTypes.LangTokenIdentifier.RIGHT_CURLY_BRACE, token: this.eat(), mssg: "Expected block statement end!"});

    return {
      type: AbstractSyntaxTreeTypes.NodeType.BLOCK_STATEMENT,
      body
    };
  };
  
  // Last day of this project, there is a lot of terrible code. May or may not refactor later.

  private parseParams(argsMode: boolean = false): (AbstractSyntaxTreeTypes.IdentifierWithType | AbstractSyntaxTreeTypes.Identifier | AbstractSyntaxTreeTypes.Literal)[] {
    const params: (AbstractSyntaxTreeTypes.IdentifierWithType | AbstractSyntaxTreeTypes.Identifier | AbstractSyntaxTreeTypes.Literal)[] = [];

    const t = new Set([
      LexerGrammarTypes.LangTokenIdentifier.LITERAL,
      LexerGrammarTypes.LangTokenIdentifier.STRING,
      LexerGrammarTypes.LangTokenIdentifier.INT,
      LexerGrammarTypes.LangTokenIdentifier.FLOAT
    ]);

    while (t.has(this.look().id)) {

      if (this.look().id === LexerGrammarTypes.LangTokenIdentifier.LITERAL) {
        const ident = this.eat();
        let identType: undefined | IdentifierType;
        if (!argsMode) {
          identType = this.helpers.checkType(this.eat());
        };

        params.push({
          type: AbstractSyntaxTreeTypes.NodeType.IDENT,
          name: ident.lexeme,
          identifierType: identType
        });
      } else {
        params.push(this.parsePrimary());
      };
    };

    // console.log(params, this.look())

    return params;
  };

  private parseFn(): AbstractSyntaxTreeTypes.FunctionDeclarationNode {

    // since the lexer doesnt really process wether a fn is a fn declaration or a call, parser will be the one to predict that here.
    this.eat();

    const ident = this.eat();

    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.LEFT_PARENTHESES, token: this.eat(), mssg: "Expected an opening parenthesis!" });
 
    const params = this.parseParams() as AbstractSyntaxTreeTypes.IdentifierWithType[];
    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.RIGHT_PARENTHESES, token: this.eat(), mssg: "Expected a closing parenthesis!" });
  
    const fnBlock = this.parseBlock();
    
    this.helpers.expectSemicolon(this.eat());

    return {
      type: AbstractSyntaxTreeTypes.NodeType.DECLARATION_FN,
      identifier: {
        type: AbstractSyntaxTreeTypes.NodeType.IDENT,
        name: ident.lexeme
      },
      params,
      body: fnBlock
    };
  };

  private parseIfStmnt(): AbstractSyntaxTreeTypes.IFStatementNode {
    this.eat();
    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.LEFT_PARENTHESES, token: this.eat(), mssg: "Expected an opening parenthesis!" });
    const condition = this.parseExpr();
    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.RIGHT_PARENTHESES, token: this.eat(), mssg: "Expected a closing parenthesis!" });
    const ifBlock = this.parseBlock();

    let alternate: undefined | AbstractSyntaxTreeTypes.ElseStatementNode = undefined;

    if (this.look().id === LexerGrammarTypes.LangTokenIdentifier.ELSE) {
      this.eat();
      const elseBlock = this.parseBlock();
      alternate = {
        type: AbstractSyntaxTreeTypes.NodeType.ELSE_STATEMENT,
        block: elseBlock
      } as AbstractSyntaxTreeTypes.ElseStatementNode
    } else this.helpers.expectSemicolon(this.eat());

    return {
      type: AbstractSyntaxTreeTypes.NodeType.IF_STATEMENT,
      condition: condition as AbstractSyntaxTreeTypes.Expr,
      block: ifBlock,
      alternate
    };
  };

  private parseForStmnt(): AbstractSyntaxTreeTypes.ForStatementNode {
    this.eat();

    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.LEFT_PARENTHESES, token: this.eat(), mssg: "Expected an opening parenthesis!" });

    const initializer = this.parse();
    const condition = this.parseExpr();
    this.helpers.expectSemicolon(this.eat());
    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.PREFIX_INCREMENT, token: this.look(), mssg: "Expected a prefix on the loop updater!"});
    const updater = this.parsePrefix();
    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.RIGHT_PARENTHESES, token: this.eat(), mssg: "Expected a closing parenthesis!" });

    const loopBlock = this.parseBlock();

    return {
      type: AbstractSyntaxTreeTypes.NodeType.FOR_STATEMENT,
      info: {
        initializer: initializer as AbstractSyntaxTreeTypes.VariableDeclarationNode | AbstractSyntaxTreeTypes.Identifier,
        condition: condition as AbstractSyntaxTreeTypes.Expr,
        updater: updater as AbstractSyntaxTreeTypes.ExpressionPrefixer
      },
      block: loopBlock
    };
  };

  private parseVar (): AbstractSyntaxTreeTypes.VariableDeclarationNode {
    let isConstant: boolean = false;

    if (this.look().id === LexerGrammarTypes.LangTokenIdentifier.CONSTANT) {
      isConstant = true;
    };

    this.eat();

    const assignment = this.parseAssignment(true) as AbstractSyntaxTreeTypes.ExpressionAssignmentNode;
    this.helpers.expectSemicolon(this.eat());

    return {
      type: AbstractSyntaxTreeTypes.NodeType.DECLARATION_VAR,
      isConstant,
      assignment
    };
  };

  private parseExprCall(): AbstractSyntaxTreeTypes.CallExpressionNode {
    this.eat();
    const ident = this.eat();
    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.LEFT_PARENTHESES, token: this.eat(), mssg: "Expected an opening parenthesis!" });
    
    const args = this.parseParams(true);

    this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.RIGHT_PARENTHESES, token: this.eat(), mssg: "Expected a closing parenthesis!" });

    return {
      type: AbstractSyntaxTreeTypes.NodeType.EXPR_CALL,
      calle: {
        type: AbstractSyntaxTreeTypes.NodeType.IDENT,
        name: ident.lexeme
      },
      arguments: args
    };
  };

  private parseAssignment(isDeclaring: boolean): AbstractSyntaxTreeTypes.ExpressionAssignmentNode | AbstractSyntaxTreeTypes.TreeNodeType {

    // normally this would be the identifier
    let left: AbstractSyntaxTreeTypes.TreeNodeType = this.parsePrefix();

    // 1. get ident or return value from primary
    // 2. (OPTIONAL) if declaring is set to true, get a valid type
    // 3. check wether the current operator is in fact of EQUAL
    // 4. if it is, reassign the left hand side to create a binary expression
    // 5. Left hand can be old left, Right hand can be a new this.parse(), and the operator can be "="

    let identType: IdentifierType | null = null;

    if (isDeclaring) {
      identType = this.helpers.checkType(this.eat());
    };

    switch (true) {
      case this.look().id === LexerGrammarTypes.LangTokenIdentifier.EQUAL && isDeclaring && identType !== undefined:
        this.eat();
        left = {
          type: AbstractSyntaxTreeTypes.NodeType.EXPR_ASSIGN,
          left: { ...left, identifierType: identType as IdentifierType } as AbstractSyntaxTreeTypes.IdentifierWithType,
          right: this.parseExpr() as AbstractSyntaxTreeTypes.Literal, 
        };
      break;


      case this.look().id === LexerGrammarTypes.LangTokenIdentifier.EQUAL && !isDeclaring:
        this.eat();
        left = {
          type: AbstractSyntaxTreeTypes.NodeType.EXPR_ASSIGN,
          left: left as AbstractSyntaxTreeTypes.Identifier,
          right: this.parseExpr() as AbstractSyntaxTreeTypes.Literal,
        };
      break;
    };

    return left;
  };


  private parseInequality(): AbstractSyntaxTreeTypes.TreeNodeType {
    let left = this.parsePrefix();
    while (this.look() && this.helpers.isInequality(this.look())) {
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

  // presedence hiearchy -
  // level 5: ++ | --
  // level 4: = : This we will call whenever we NEED to parse assignment, so for example in parseVar
  // level 3: > | < | >= | <=
  // level 2: * | /
  // level 1: + | -

  private parsePrefix(): AbstractSyntaxTreeTypes.TreeNodeType | AbstractSyntaxTreeTypes.ExpressionPrefixer {
    if (this.look() && this.helpers.isPrefix(this.look())) {
      const prefixOperator = this.eat();
        
      const ident = this.helpers.expect({ id: LexerGrammarTypes.LangTokenIdentifier.LITERAL, token: this.eat(), mssg: "Expected valid identifier!" })
      this.helpers.expectSemicolon(this.eat());
      return {
        type: AbstractSyntaxTreeTypes.NodeType.EXPR_PREFIXER,
        left: {
          type: AbstractSyntaxTreeTypes.NodeType.IDENT,
          name: ident.lexeme,
        },
        prefix: prefixOperator.lexeme as AbstractSyntaxTreeTypes.PrefixOperators
      };
    } else return this.parsePrimary();
  };

  private parseMultiplicative (): AbstractSyntaxTreeTypes.TreeNodeType {
    let left: AbstractSyntaxTreeTypes.TreeNodeType = this.parseInequality();
    while (this.look() && this.helpers.isMultiplicative(this.look())) {
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
    while (this.look() && this.helpers.isAdditive(this.look())) {
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
      case LexerGrammarTypes.LangTokenIdentifier.LITERAL:
        return {
          type: AbstractSyntaxTreeTypes.NodeType.IDENT,
          name: this.eat().lexeme
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

       case LexerGrammarTypes.LangTokenIdentifier.FUNCTION:
         return this.parseFn();

       case LexerGrammarTypes.LangTokenIdentifier.FUNCTION_CALL:
         return this.parseExprCall();

       case LexerGrammarTypes.LangTokenIdentifier.FOR:
         return this.parseForStmnt();

       case LexerGrammarTypes.LangTokenIdentifier.IF:
         return this.parseIfStmnt();

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
    
      // console.log(JSON.stringify(root, null, 2))
      return root;
  };
};

export default GarbageParser;
