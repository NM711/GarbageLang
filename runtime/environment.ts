import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageNativeFunctions from "./native";
import GarbageErrors from "../types/errors.types";
import RuntimeTypes from "../types/runtime.types";

// #TODO
//
// Create a environment stack

/**
 * @class GarbageEnvironment
 * @description
 * The environment in the context of interpreters, is the data structure that holds onto different statements and manages variable value bindings.
 * Examples could range from assignment, to re-assignment, and its even possible for this to do type checking. 
 **/

// An environment can only have a single block. New blocks represent new environments.

class GarbageEnvironment {
  private environments: Map<string, RuntimeTypes.EnvironmentValue>[];
  private constants: Set<string>;
  private current: number;

  constructor () {
    // current env = 0, global;
    this.current = 0;
    this.environments = [new Map()]
    this.constants = new Set();
    // initializer
    new GarbageNativeFunctions(this.environments[0]).initalize();
  };

  public pushEnvironment() {
    ++this.current;
    this.environments.push(new Map());
  };

  public popEnvironment() {
    if (this.environments.length === 1) {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`You are unable to pop the global environment!`);
    };
    return this.environments.pop();
  };

  private checkDef (ident: string, current: number = this.current) {
    if (this.environments[current].has(ident)) {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable that has been attempted to be defined "${ident}", already exists within the runtime environment!`);
    };
  };

  private checkIfConst (ident: string, current: number = this.current) {
    if (this.environments[current].has(ident)) {

      if (this.constants.has(ident)) {
        throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable you are trying to re-assign, is constant!`);
      };

    } else {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable with identifier "${ident}" you are trying to assign does not exist!`);
    };
  };

  public declareFn(node: AbstractSyntaxTreeTypes.FunctionDeclarationNode) {
    if (this.environments.length > 0) {
      for (let i = this.environments.length - 1; i >= 0; i--) {
        this.current = i;
        this.checkDef(node.identifier.name);
      };
    } else this.checkDef(node.identifier.name);

    this.environments[this.current].set(node.identifier.name, {
      type: "EnvironmentFunction",
      value: node
    });
  };

  public declareVar(ident: AbstractSyntaxTreeTypes.IdentifierWithType, isConstant: boolean, value: RuntimeTypes.RuntimeValue) {
    // when declaring a variable, we want to check if it has been defined in any environment before the current environment.
    if (this.environments.length > 0) {
      for (let i = this.environments.length - 1; i >= 0; i--) {
        this.current = i;
        this.checkDef(ident.name);
      };
    } else this.checkDef(ident.name);

    if (value.type !== ident.identifierType) {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`Attempted to perform cross type assignment on variable "${ident.name}", "${ident.name}" is supposed to be of type "${ident.identifierType}" but instead was given type of "${value.type}"!`); 
    };

    this.environments[this.current].set(ident.name, {
      type:"EnvironmentVariable",
      typeDef: ident.identifierType,
      value
    });

    if (isConstant) {
      this.constants.add(ident.name);
    };

    this.current = 0;

    return value;
  };

  private obtain(ident: string): RuntimeTypes.EnvironmentValue {
    for (const env of this.environments) {
        if (env.has(ident)){
          return env.get(ident) as RuntimeTypes.EnvironmentValue;
        };
    };

    throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable with identifier "${ident}" is undefined within the environment!`);
  };

  /**
  * @method pubObtain
  * @description
  * Method that returns a value from the environment but, instead of returning the environment value we return
  * a runtime value with the set environment value
  **/

  public pubObtain(ident: string): RuntimeTypes.RuntimeValue | RuntimeTypes.EnvironmentValue {
    const obtained = this.obtain(ident);
    if (obtained.type === "EnvironmentFunction" || obtained.type === "NativeFunction") {
      return obtained;
    } else {
      return {
        type: obtained.typeDef,
        value: obtained.value.value
      } as RuntimeTypes.RuntimeValue;
    };
  };

  public assign(ident: string, value: RuntimeTypes.RuntimeValue) {

    let symbol: undefined | RuntimeTypes.EnvironmentValue;
    let env: undefined | Map<string, RuntimeTypes.EnvironmentValue>;

    for (let i = this.environments.length - 1; i >= 0; i--) {
      if (this.environments[i].has(ident)) {
        this.current = i;
        env = this.environments[i];
        symbol = env.get(ident);
      };
    };

    this.checkIfConst(ident);

    // check if const checks and will throw error for us so we know that for a fact env, and symbol must be filled by the time they reach
    // here.

    if (symbol && env && symbol.type === "EnvironmentVariable") {
      // I know the chained condition looks weird but, it is necessary for situations in which you an expression such as
      // 10.3 + 1.7 within a variable of a type of Float, if you dont convert the value into a Float that is valid, the interpreter will throw
      // a runtime error. So in this case we just do a quick type conversion, I know its a hack but, I tried different in having node
      // return an actual float as x.00 when the type is set to float but, nah it always cuts away the decimal if there is nothing but 0s.

      if (symbol.typeDef === value.type) {
        env.set(ident, { type: "EnvironmentVariable",  typeDef: symbol.typeDef, value });
      } else if (symbol.typeDef === "Float" && value.type === "Int") {
        env.set(ident, { type: "EnvironmentVariable", typeDef: symbol.typeDef, value: { type: "Float", value: value.value } });
      } else {
        throw new GarbageErrors.RuntimeErrors.EnvironmentError(`Attempted to perform cross type assignment on variable "${ident}", "${ident}" is supposed to be of type "${symbol.typeDef}"!`); 
      };
    };

    this.current = 0;
  };
};

export default GarbageEnvironment;
