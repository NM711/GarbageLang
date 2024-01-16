import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageEnvironment from "./environment";
import RuntimeTypes from "../types/runtime.types";
import GarbageErrors from "../types/errors.types";

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

  private evalFn(node: AbstractSyntaxTreeTypes.FunctionDeclarationNode) {
    // within x scope the evaluated declared fn will hold the object that was assigned during the parsing process.
    this.environment.declareFn(node);
  };

  private checkParamLenMatch(node: AbstractSyntaxTreeTypes.CallExpressionNode, called: RuntimeTypes.EnvironmentFunction | RuntimeTypes.NativeFunction) {
    const message = "Number of given arguments does not match with the number of required arguments!";
    if (called.type === "EnvironmentFunction" && node.arguments.length !== called.value.params.length) {
      throw new GarbageErrors.RuntimeErrors.RuntimeError(message);
    } else if (called.type === "NativeFunction" && node.arguments.length !== called.params.length) {
      throw new GarbageErrors.RuntimeErrors.RuntimeError(message);
    };
  };

  private checkArgAndParamMatch(arg: RuntimeTypes.RuntimeValue, param: AbstractSyntaxTreeTypes.IdentifierWithType, condition: boolean = arg.type !== param.identifierType) {
     if (condition) {
       throw new GarbageErrors.RuntimeErrors.RuntimeError("The type of the given argument and the expected param do not match!");
     };
  };

  private evalNativeFnCall(node: AbstractSyntaxTreeTypes.CallExpressionNode, called: RuntimeTypes.NativeFunction) {
    const args: any[] = []

    for (let i = 0; i < called.params.length; i++) {
      const argument = node.arguments[i];
      const param = called.params[i];

      let argValue: RuntimeTypes.RuntimeValue | RuntimeTypes.EnvironmentValue = this.defaultNum();

      if (argument.type === AbstractSyntaxTreeTypes.NodeType.IDENT) {
        argValue = this.environment.pubObtain(argument.name) as RuntimeTypes.RuntimeValue;
      } else {
      argValue = this.evaluate(argument);
      };

      this.checkArgAndParamMatch(argValue, param, argValue.type !== param.identifierType && param.identifierType !== "Any");

      args.push(argValue.value);
    };

    if (node.calle.name) {
      called.call.apply(null, args);
    };
  };

  private evalDefinedFnCall(node: AbstractSyntaxTreeTypes.CallExpressionNode, called: RuntimeTypes.EnvironmentFunction) {
    this.environment.pushEnvironment();
    
    for (let i = 0; i < called.value.params.length; i++) {
      const argument = node.arguments[i];
      const param = called.value.params[i];

      if (argument.type === AbstractSyntaxTreeTypes.NodeType.IDENT) {
        const argumentValue = this.environment.pubObtain(argument.name);
      
        if (argumentValue.type !== param.identifierType) {
          throw new GarbageErrors.RuntimeErrors.RuntimeError("The type of the given argument and the expected param do not match!");
        };

        const argValue = this.environment.pubObtain(argument.name) as RuntimeTypes.RuntimeValue;
        this.environment.declareVar(param, false, argValue);
      } else {
          this.environment.declareVar(param, false, this.evaluate(argument));
        };
      };

      this.evalBlock(called.value.body, false);
  };

  private evalFnCall(node: AbstractSyntaxTreeTypes.CallExpressionNode) {
    const called = this.environment.pubObtain(node.calle.name) as RuntimeTypes.EnvironmentFunction | RuntimeTypes.NativeFunction;
    this.checkParamLenMatch(node, called);

    if (called.type === "NativeFunction") {
      this.evalNativeFnCall(node, called);
    } else {
      this.evalDefinedFnCall(node, called);
    };
  };

  private evalBinaryExpr (expr: AbstractSyntaxTreeTypes.Expr): RuntimeTypes.RuntimeValue {
    
    const lhs = this.evaluate(expr.left);
    const rhs = this.evaluate(expr.right);
   
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
      this.evalBlock(node.block);
    };

    return evaled;
  };

  private evalBlock(node: AbstractSyntaxTreeTypes.BlockStatementNode, pushNew: boolean = true) {
    if (pushNew) {
      this.environment.pushEnvironment();
    };

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
    
      case AbstractSyntaxTreeTypes.NodeType.DECLARATION_FN:
        this.evalFn(node);
        return this.defaultNull();

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

      case AbstractSyntaxTreeTypes.NodeType.EXPR_CALL:
        this.evalFnCall(node);
        return this.defaultNull();

      case AbstractSyntaxTreeTypes.NodeType.IDENT:
        return this.environment.pubObtain(node.name) as RuntimeTypes.RuntimeValue;
        
      default: {
        console.log(node)
        console.error("Unexpected node type!");
        process.exit(1);
      };
    };
  };
};

export default GarbageTreeWalker;
