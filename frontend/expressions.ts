import AbstractSyntaxTreeTypes from "../types/ast.types";
import LexerGrammarTypes from "../types/lexer.grammar.types";
import { isNumId } from "./utils";
import type LexerTokenTypes from "../types/lexer.tokens"

class ExpressionTrees {
  private expression: LexerTokenTypes.Token[];

  constructor () {
    this.expression = [];
  };

  public set setExpression(expr: LexerTokenTypes.Token[]) {
    this.expression = expr;
  }

  private leftRightCheck (side: LexerTokenTypes.Token): AbstractSyntaxTreeTypes.DeclarationLiteralValue {

    if (isNumId(side)) {
      const obj: AbstractSyntaxTreeTypes.DeclarationLiteralValue = {
        type: AbstractSyntaxTreeTypes.Node.NUMBER_LITERAL,
        value: Number(side.lexeme)
      };
      return obj;
    } else {
      const obj: AbstractSyntaxTreeTypes.DeclarationLiteralValue = {
        type: AbstractSyntaxTreeTypes.Node.STRING_LITERAL,
        value: side.lexeme
      };
      return obj;
    };
  };

  // 5 + 10 - 5
  // 0 1 0  1 0
  private generateBinaryExpressionTree(): AbstractSyntaxTreeTypes.BinaryExpressionType {
    const unaryStack: AbstractSyntaxTreeTypes.UnaryExpressionType[] = [];
    for (let i = 1; i < this.expression.length; i ++) {
      const prev = this.expression[i - 1];
      const current = this.expression[i];
      const next = this.expression[i + 1];
      
      const isOperator = LexerGrammarTypes.OperatorKeywordMap[current.lexeme];

      if (isNumId(prev) && isOperator && isNumId(next)) {
        // remember that 0 defaults to a falsy value
        unaryStack.push({
          type: AbstractSyntaxTreeTypes.Node.EXPRESSION_UNARY,
          left: {
            type: AbstractSyntaxTreeTypes.Node.NUMBER_LITERAL,
            value: Number(prev.lexeme)
          },
          right: {
            type: AbstractSyntaxTreeTypes.Node.NUMBER_LITERAL,
            value: Number(next.lexeme)
          },
          operator: current.lexeme as AbstractSyntaxTreeTypes.ExpressionOperator
        })
      };
    };

    console.log(unaryStack)
  };

  private generateUnaryExpressionTree (expr: LexerTokenTypes.Token[]): AbstractSyntaxTreeTypes.UnaryExpressionType {
    const left = expr[0];
    const operator = expr[1];
    const right = expr[2];

    const unaryExpression: AbstractSyntaxTreeTypes.UnaryExpressionType = {
      type: AbstractSyntaxTreeTypes.Node.EXPRESSION_UNARY,
      left: this.leftRightCheck(left),
      operator: operator.lexeme as AbstractSyntaxTreeTypes.ExpressionOperator,
      right: this.leftRightCheck(right)
    };

    return unaryExpression;
  };

  public generate (): AbstractSyntaxTreeTypes.ExpressionsType | null {
    console.log(this.expression)
    if (this.expression.length > 1 && this.expression.length === 3) {
      return this.generateUnaryExpressionTree(this.expression);
    } else if (this.expression.length > 3) {
      return this.generateBinaryExpressionTree();
    };
    return null;
  };
};

export default ExpressionTrees;
