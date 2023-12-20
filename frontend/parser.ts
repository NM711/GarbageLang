// consider renaming to GrammarTypes instead, since its no longer lexer specific
import LexerGrammarTypes from "../types/lexer.grammar.types";
import { callSyntaxError } from "./errors/syntax";
import AbstractSyntaxTreeTypes from "../types/ast.types";
import type LexerTokenTypes from "../types/lexer.tokens";
import FrontendErrors from "../types/errors.types";


class GarbageParser {
  private tokens: LexerTokenTypes.Token[];

  constructor () {
    this.tokens = [];
  };

  public set setTokens (tokens: LexerTokenTypes.Token[]) {
    this.tokens = tokens;
  };

  private eat (): (LexerTokenTypes.Token | undefined) {
    console.log(this.tokens)
    return this.tokens.shift();
  };

  private expected(id: LexerGrammarTypes.LangTokenIdentifier, errorMssg: string) {
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

  private createAST (): AbstractSyntaxTreeTypes.ProgramNode {

    const root: AbstractSyntaxTreeTypes.ProgramNode = {
      type: AbstractSyntaxTreeTypes.Node.PROGRAM,
      body: []
    };

    for (let i = 0; i < this.tokens.length; i++) {
      const currentToken = this.tokens[i];

      if (!currentToken || (currentToken && currentToken.id === LexerGrammarTypes.LangTokenIdentifier.EOF ) ) {
        break;
      };

      switch (currentToken.id) {
        case LexerGrammarTypes.LangTokenIdentifier.VARIABLE:
        case LexerGrammarTypes.LangTokenIdentifier.CONSTANT:
          this.parseVarConst()
        continue;
      };
    };

     return root;
  };

  // Terminal Values = if, const, let, for, while, switch, etc.
  // NonTerminal Values = String, Array, Int, IdentifierValues.

  private parseVarConst () {
    let isConstant: boolean = false;
    // const/let foo <Type> = <TypeValue/Expression>;
    // removing first because we know it will, in fact be a let || const;
    const first = this.eat();

    if (first?.lexeme === "const") {
      isConstant = true;
    };

    this.expected(LexerGrammarTypes.LangTokenIdentifier.LITERAL, `Expected Literal`);

    const varConstType = this.eat();

    if (varConstType && !LexerGrammarTypes.DataTypeKeywordMap[varConstType.lexeme]) {
      throw new FrontendErrors.ParserError({
        message: `Expected a valid type id, instead got id ${varConstType?.id}`,
        line: varConstType.line,
        char: varConstType.char,
        at: varConstType.lexeme
      });
    };

    this.expected(LexerGrammarTypes.LangTokenIdentifier.EQUAL, "Expected assignment!");

  };

  private parseExpression () {
    // here return the value of the expression
    const consumed = this.eat();

    switch (consumed?.id) {
      case LexerGrammarTypes.LangTokenIdentifier.INT:
      case LexerGrammarTypes.LangTokenIdentifier.FLOAT:
       // so now, if its a number, we expect the next character to either A === Operator or B === Semicolon END
        

      break;

    };
  };

  private parseAssignment (type: LexerGrammarTypes.LangTokenIdentifier) {

    const expressionOutput = this.parseExpression();

    // here compare the value with the declared variable/constant type
  };

  public parse () {
    this.createAST();
  };
};

export default GarbageParser;
