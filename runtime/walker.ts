import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageEnvironment from "./environment";
import type RuntimeTypes from "../types/runtime.types";

class GarbageTreeWalker {
  private environment: GarbageEnvironment;

  constructor () {
    this.environment = new GarbageEnvironment();
  };

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
    } else if (lhs.type === "string" && rhs.type === "string" && expr.operator === "+") {
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

  private defaultNum (value: number = 0): RuntimeTypes.NumberValue {
    return {
      type: "number",
      value
    };
  };

  private defaultStr(value: string = ""): RuntimeTypes.StringValue {
    return {
      type: "string",
      value
    };
  };

  private defaultNull(): RuntimeTypes.NullValue {
    return {
      type: "null",
      value: null
    };
  };

  private evalVar(node: AbstractSyntaxTreeTypes.VariableDeclarationNode) {
    /**
    * When a variable is declared without assignment, depending on the type it will default to a specific value of that type.
    */

    if (!node.value) {
      switch (node.identifier.identiferType) {
        case "Int":
        case "Float":
          return this.environment.declare(node.identifier.name, node.isConstant, this.defaultNum())
        case "String":
          return this.environment.declare(node.identifier.name, node.isConstant, this.defaultStr());
      };
    } else {
      
    };
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