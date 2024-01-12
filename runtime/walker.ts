import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageEnvironment from "./environment";
import type RuntimeTypes from "../types/runtime.types";
import { isNumber } from "../frontend/utils";

class GarbageTreeWalker {
  private environment: GarbageEnvironment;

  constructor () {
    this.environment = new GarbageEnvironment();
  };

  public evaluateProgram (program: AbstractSyntaxTreeTypes.ProgramNode): RuntimeTypes.RuntimeValue {
    let lastEvaled: RuntimeTypes.RuntimeValue = this.defaultNull();

    for (const stmnt of program.body) {
      lastEvaled = this.evaluate(stmnt);
    };

    return lastEvaled;
  };

  private evalBinaryExpr (expr: AbstractSyntaxTreeTypes.Expr): RuntimeTypes.RuntimeValue {
    let lhs = this.evaluate(expr.left);
    let rhs = this.evaluate(expr.right);
   
    let result: string | number = 0;

    if ( (lhs.type === "Int" || lhs.type === "Float") && (rhs.type === "Int" || rhs.type === "Float") ) {
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

     return this.defaultNum(result);

    } else if (lhs.type === "String" && rhs.type === "String" && expr.operator === "+") {
      result = lhs.value + rhs.value;
      return this.defaultStr(result);
    } else {
        console.error("Unexpected error when attempting to evaluate expression!");
        process.exit(1);
    };
  };

  private defaultNum(value: number = 0): RuntimeTypes.NumberValue {
    const stringifiedValue = value.toString();
    if (stringifiedValue.includes(".")) {
      return {
        type: "Float",
        value
      };
    } else {
      return {
        type: "Int",
        value
      };
    };
  };

  private defaultStr(value: string = ""): RuntimeTypes.StringValue {
    return {
      type: "String",
      value
    };
  };

  private defaultNull(): RuntimeTypes.NullValue {
    return {
      type: "Null",
      value: null
    };
  };

  private evalPrefix(node: AbstractSyntaxTreeTypes.ExpressionPrefixer) {
    const currentNodeValue = this.environment.obtain(node.left.name);

    if (currentNodeValue.typeDef !== "Int" && currentNodeValue.typeDef !== "Float") {
      console.error(`Expected an "INT" or "FLOAT"!`);
      process.exit(1);
    };

    let updatedResult: number = currentNodeValue.value.value as number;

    if (node.prefix === "++") {
      updatedResult = ++updatedResult;

    } else if (node.prefix === "--") {
      updatedResult = --updatedResult;
    };

    console.log(updatedResult);

    return this.environment.assign(node.left.name, {
      type: currentNodeValue.typeDef,
      value: updatedResult
    });
  };

  private evalVar(node: AbstractSyntaxTreeTypes.VariableDeclarationNode) {
    return this.environment.declare(node.assignment.left as AbstractSyntaxTreeTypes.IdentifierWithType, node.isConstant, this.evaluate(node.assignment.right));
  };

  private evaluate (node: AbstractSyntaxTreeTypes.TreeNodeType): RuntimeTypes.RuntimeValue {
    switch (node.type) {
      case AbstractSyntaxTreeTypes.NodeType.DECLARATION_VAR:
        return this.evalVar(node);

      case AbstractSyntaxTreeTypes.NodeType.NUM_LITERAL:
        return this.defaultNum(node.value);

      case AbstractSyntaxTreeTypes.NodeType.NULL_LITERAL:
        return this.defaultNull(); 
      
      case AbstractSyntaxTreeTypes.NodeType.STR_LITERAL:
        return this.defaultStr(node.value);
      
      case AbstractSyntaxTreeTypes.NodeType.EXPR_ASSIGN:
        const value = this.evaluate(node.right);
        return this.environment.assign(node.left.name, value);

      case AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY:
        return this.evalBinaryExpr(node);
     
      case AbstractSyntaxTreeTypes.NodeType.EXPR_PREFIXER:
        return this.evalPrefix(node);

      case AbstractSyntaxTreeTypes.NodeType.STATEMENT_END:
        return {
          type: "end",
          value: ";"
        };
        
      default: {
        console.error("Unexpected node type!");
        process.exit(1);
      };
    };
  };
};

export default GarbageTreeWalker;