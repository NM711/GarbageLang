// consider renaming to GrammarTypes instead, since its no longer lexer specific
import LexerGrammarTypes from "../types/lexer.grammar.types";
import { callSyntaxError } from "./errors/syntax";
import AbstractSyntaxTreeTypes from "../types/ast.types";
import type LexerTokenTypes from "../types/lexer.tokens";
import FrontendErrors from "../types/errors.types";


class GarbageParser {
  private tokens: LexerTokenTypes.Token[];
  private holder: LexerTokenTypes.Token | null;
  private root: AbstractSyntaxTreeTypes.ProgramNode
  constructor () {
    this.tokens = [];
    // used to keep the state of certain tokens.
    this.holder = null;
    this.root = {
      type: AbstractSyntaxTreeTypes.Node.PROGRAM,
      body: []
    };
  };

  public set setTokens (tokens: LexerTokenTypes.Token[]) {
    this.tokens = tokens;
  };

  private eat (): LexerTokenTypes.Token {

    const token = this.tokens.shift();

    if (!token) {
      console.error(`Expected Token, but instead got ${undefined}`);
      process.exit(1);
    };

    return token;
  };

  private eatAndPushToHolder(): void {
    const consumed = this.eat();
    this.holder = consumed;
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

    return consumed;
  };

  private createAST (): void {
    while (this.tokens.length > 0) {
      this.eatAndPushToHolder();

      if (!this.holder || (this.holder && this.holder.id === LexerGrammarTypes.LangTokenIdentifier.EOF) ) {
        break;
      };
      switch (this.holder.id) {
        case LexerGrammarTypes.LangTokenIdentifier.VARIABLE:
        case LexerGrammarTypes.LangTokenIdentifier.CONSTANT:
          this.parseVarConst();
        continue;

        default:
          continue;
      };
    };
  };

  // Terminal Values = if, const, let, for, while, switch, etc.
  // NonTerminal Values = String, Array, Int, IdentifierValues.

  private parseVarConst () {
    let isConstant: boolean = false;
    // const/let foo <Type> = <TypeValue/Expression>;
    // removing first because we know it will, in fact be a let || const;
    
    if (this.holder && this.holder.lexeme === "const") {
      isConstant = true;
    };
    

    // we are gonna save the var name within the parseAssignment();
    this.holder = this.expected(LexerGrammarTypes.LangTokenIdentifier.LITERAL, `Expected Literal`);
    
    // Refactor
    // type checking

    this.parseAssignment(isConstant);
  };

  private parseExpression (): (null | AbstractSyntaxTreeTypes.ExpressionsType) {
    // here we must build the expression tree or return the semicolon;

   const assigned = this.holder;
    if (!assigned) {
      console.error("Unexpected, missing the assigned token!");
      process.exit(1);
    };

    const expression: LexerTokenTypes.Token[] = [assigned];

    const specialToken = this.eat();

    const isOperator = LexerGrammarTypes.OperatorKeywordMap[specialToken.lexeme];

    switch (true) {
      case isOperator !== undefined:
        expression.push(specialToken);
      break;

      case specialToken.id === LexerGrammarTypes.LangTokenIdentifier.SEMICOLON:
        return null

      default: {
        throw new FrontendErrors.ParserError({
          message: `Expected ending semicolon ";" or expression operator/operators!`,
          line: specialToken.line,
          char: specialToken.char,
          at: `${assigned.lexeme} ${specialToken.lexeme}`
        })
      };
    };
  };

  private parseString (): (string | null) {
    // use state machine

    let isStrOpened: boolean = false;

    let generatedStr: string[] = [];

    if (this.holder && this.holder.id === LexerGrammarTypes.LangTokenIdentifier.DOUBLE_QUOTE) {
      isStrOpened = true;
      this.eatAndPushToHolder();
    };

    if (this.holder && isStrOpened) {
      while (this.holder.id !== LexerGrammarTypes.LangTokenIdentifier.DOUBLE_QUOTE) {
        generatedStr.push(this.holder.lexeme);
        this.eatAndPushToHolder();
      };

      return generatedStr.join(" ");
    };

    return null;
  };

  private parseAssignment (isConstant: boolean): void {
    const assignerName = this.holder;
    const assignerType  = this.eat();

    if (assignerType && !LexerGrammarTypes.DataTypeKeywordMap[assignerType.lexeme]) {
      throw new FrontendErrors.ParserError({
        message: `Unexpected type "${assignerType.lexeme}"`,
        line: assignerType.line,
        char: assignerType.char,
        at: `${assignerName?.lexeme} ${assignerType.lexeme}`
      });
    };

    this.expected(LexerGrammarTypes.LangTokenIdentifier.EQUAL, "Expected assignment!");

    const assigned = this.eat();

    // here we error handle basically, match types and what not. But if we see any operators after the value assignment then we know
    // that the value will instead be an expression. So if this is the case we wil just call, parseExpression() to handle this.

    const expectType = (expected: string, assignerID: LexerGrammarTypes.LangTokenIdentifier, assignedID: LexerGrammarTypes.LangTokenIdentifier) => {
      if (assignerType.id === assignerID && assigned.id !== assignedID)  {
        throw new FrontendErrors.ParserError({
          message: `Type was set to "${assignerType.lexeme}" yet, no valid (${expected}) to be found!`,
          line: assigned.line,
          char: assigned.char,
          at: `${assignerType.lexeme} = ${assigned.lexeme}`
        });
      };
    };

    expectType(`"`, LexerGrammarTypes.LangTokenIdentifier.STRING, LexerGrammarTypes.LangTokenIdentifier.DOUBLE_QUOTE);
    expectType(`Int`, LexerGrammarTypes.LangTokenIdentifier.INT, LexerGrammarTypes.LangTokenIdentifier.INT);
    expectType(`Float`, LexerGrammarTypes.LangTokenIdentifier.FLOAT, LexerGrammarTypes.LangTokenIdentifier.FLOAT);

    this.holder = assigned;

    const generatedStr = this.parseString();

    const builtExpressionTree = this.parseExpression();

    if (!builtExpressionTree && generatedStr) {
        this.root.body.push({
          type: AbstractSyntaxTreeTypes.Node.DECLARATION_VARIABLE,
          identifier: {
            type: AbstractSyntaxTreeTypes.Node.IDENTIFIER,
            name: assignerName?.lexeme as string,
            identiferType: "String"
          },
          value: {
            type: AbstractSyntaxTreeTypes.Node.STRING_LITERAL,
            value: generatedStr
          },
          isConstant
        });
    };
  };

  public parse () {
    this.createAST();
    console.log(this.root)
    return this.root;
  };
};

export default GarbageParser;
