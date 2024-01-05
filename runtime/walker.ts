import AbstractSyntaxTreeTypes from "../types/ast.types";
import type RuntimeTypes from "../types/runtime.types";

class GarbageTreeWalker {
  constructor () {};

  public evaluateProgram (program: AbstractSyntaxTreeTypes.ProgramNode): RuntimeTypes.RuntimeValue {
    let lastEvaled: RuntimeTypes.RuntimeValue = {
      type: "null",
      value: null
    };

    for (const stmnt of program.body) {
      lastEvaled = this.evaluate(stmnt);
    };

    return lastEvaled;
  };

  private returnNum (value: number): RuntimeTypes.NumberValue {
    return {
      type: "number",
      value
    };
  };

  private evalBinaryExpr (expr: AbstractSyntaxTreeTypes.Expr): RuntimeTypes.RuntimeValue {
    let lhs = this.evaluate(expr.left);
    let rhs = this.evaluate(expr.right);
   
    let result: string | number = 0;

    if (lhs.type === "number" && rhs.type === "number") {
      switch (expr.operator) {
        case "+":
          result = lhs.value + rhs.value;
        break;
        case "-":
          result = lhs.value - rhs.value;
        break;

        case "*":
          result = lhs.value * rhs.value;
        break;

        case "/":
          result = lhs.value / rhs.value;
        break;
      };

      return this.returnNum(result);
    } else if (lhs.type === "string" && rhs.type === "string") {
      result = lhs.value + rhs.value;
      return {
        type: "string",
        value: result
      };
    } else {
        console.error("Unexpected error when attempting to evaluate expression!");
        process.exit(1);
    };
  };

  private evaluate (node: AbstractSyntaxTreeTypes.TreeNodeType): RuntimeTypes.RuntimeValue {
    switch (node.type) {
      case AbstractSyntaxTreeTypes.NodeType.NUM_LITERAL:
        return {
          type: "number",
          value: node.value
        };

      case AbstractSyntaxTreeTypes.NodeType.NULL_LITERAL:
        return {
          type: "null",
          value: node.value
        };
      
      case AbstractSyntaxTreeTypes.NodeType.STR_LITERAL:
        return {
          type: "string",
          value: node.value
        };
      case AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY:
        return this.evalBinaryExpr(node);
      
      default: {
        console.error("Unexpected node type!");
        process.exit(1);
      };
    };
  };
};

export default GarbageTreeWalker;