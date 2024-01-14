import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageEnvironment from "./environment";
import type RuntimeTypes from "../types/runtime.types";

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
    
    const lhs = this.evaluate(expr.left);
    const rhs = this.evaluate(expr.right);
   
    let result: string | number = 0;


    if ( (lhs.type === "Int" || lhs.type === "Float") && (rhs.type === "Int" || rhs.type === "Float") ) {
      switch (expr.operator) {
        // case "=":
          // result = this.evaluate(expr.right).value as number
        // break;

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

        case ">":
          return this.defaultBool(lhs.value > rhs.value);

        case "<":
          return this.defaultBool(lhs.value < rhs.value);

        case ">=":
          return this.defaultBool(lhs.value >= rhs.value);

        case "<=":
          return this.defaultBool(lhs.value <= rhs.value);

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

  private defaultBool(value: boolean): RuntimeTypes.BooleanValue {
    return {
      type: "Boolean",
      value
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
    const currentNodeValue = this.environment.pubObtain(node.left.name);

    if (currentNodeValue.type !== "Int" && currentNodeValue.type !== "Float") {
      console.error(`Expected an "INT" or "FLOAT"!`);
      process.exit(1);
    };

    let updatedResult: number = currentNodeValue.value as number;
    

    // within the lexer trim the trailing whitespace that for some reason gets added onto the lexeme
    // then you can remove the trims here.
    if (node.prefix.trim() === "++") {
      updatedResult = ++updatedResult;

    } else if (node.prefix.trim() === "--") {
      updatedResult = --updatedResult;
    };

    return this.environment.assign(node.left.name, {
      type: currentNodeValue.type,
      value: updatedResult
    });
  };

  // Technically these returns are unecessary cos we arent really doing anything with it.
  // I will refactor later on.

  private evalForStmnt(node: AbstractSyntaxTreeTypes.ForStatementNode) {
    this.evaluate(node.info.initializer);

    let evaled: RuntimeTypes.RuntimeValue = this.defaultNull();

    while (this.evaluate(node.info.condition).value) {
      this.evaluate(node.info.updater);

      for (const stmnt of node.block.body) {
        evaled = this.evaluate(stmnt);
      };
    };

    return evaled;
  };

  private evalBlock(node: AbstractSyntaxTreeTypes.BlockStatementNode) {
    this.environment.pushEnvironment();
    for (const stmnt of node.body) {
      this.evaluate(stmnt);
    };
    this.environment.popEnvironment();
  };

  private evalIfStmnt(node: AbstractSyntaxTreeTypes.IFStatementNode) {
    if (this.evaluate(node.condition).value) {
      this.evalBlock(node.block);
    } else if (!this.evaluate(node.condition).value && node.alternate) {
      this.evalBlock(node.alternate.block); 
    };
  };

  private evalVar(node: AbstractSyntaxTreeTypes.VariableDeclarationNode) {
    return this.environment.declareVar(node.assignment.left as AbstractSyntaxTreeTypes.IdentifierWithType, node.isConstant, this.evaluate(node.assignment.right));
  };

  private evaluate (node: AbstractSyntaxTreeTypes.TreeNodeType): RuntimeTypes.RuntimeValue {
    // for statements that genuinely dont return anything i will just return null;
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
        this.environment.assign(node.left.name, value);
        return this.defaultNull();

      case AbstractSyntaxTreeTypes.NodeType.EXPR_BINARY:
        return this.evalBinaryExpr(node);
     
      case AbstractSyntaxTreeTypes.NodeType.EXPR_PREFIXER:
        this.evalPrefix(node);
        return this.defaultNull();
    
      case AbstractSyntaxTreeTypes.NodeType.FOR_STATEMENT:
        return this.evalForStmnt(node);

      case AbstractSyntaxTreeTypes.NodeType.IF_STATEMENT:
        this.evalIfStmnt(node);
        return this.defaultNull();

      case AbstractSyntaxTreeTypes.NodeType.STATEMENT_END:
        return {
          type: "end",
          value: ";"
        };

      case AbstractSyntaxTreeTypes.NodeType.IDENT:
        return this.environment.pubObtain(node.name);
        
      default: {
        console.error("Unexpected node type!");
        process.exit(1);
      };
    };
  };
};

export default GarbageTreeWalker;
