import AbstractSyntaxTreeTypes from "../types/ast.types";
import GarbageErrors from "../types/errors.types";
import RuntimeTypes from "../types/runtime.types";


/**
 * @class GarbageEnvironment
 * @description
 * The environment in the context of interpreters, is the data structure that holds onto different statements and manages variable value bindings.
 * Examples could range from assignment, to re-assignment, and its even possible for this to do type checking. 
 **/

// TODO:
// Type checking

class GarbageEnvironment {
  private variables: Map<string, RuntimeTypes.EnvironmentValue>
  private constants: Set<string>;

  constructor () {
    this.variables = new Map();
    this.constants = new Set();
  };

  private checkDef (ident: string) {
    if (this.variables.has(ident)) {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable that has been attempted to be defined "${ident}", already exists within the runtime environment!`);
    }; 
  };

  private checkIfConst (ident: string) {
    if (this.variables.has(ident)) {

      if (this.constants.has(ident)) {
        throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable you are trying to re-assign, is constant!`);
      };

    } else {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable with identifier "${ident}" you are trying to assign does not exist!`);
    };
  };

  public declare(ident: AbstractSyntaxTreeTypes.IdentifierWithType, isConstant: boolean, value: RuntimeTypes.RuntimeValue) {
    
    this.checkDef(ident.name);

    this.variables.set(ident.name, {
      typeDef: ident.identiferType,
      value
    });

    if (isConstant) {
      this.constants.add(ident.name);
    };

    return value;
  };

  public obtain(ident: string): RuntimeTypes.EnvironmentValue {
    if (!this.variables.has(ident)) {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`The variable with identifier "${ident}" is undefined within the environment!`);
    };

    return this.variables.get(ident) as RuntimeTypes.EnvironmentValue;
  };

  public assign(ident: string, value: RuntimeTypes.RuntimeValue) {
    this.checkIfConst(ident); 

    const variable = this.variables.get(ident) as RuntimeTypes.EnvironmentValue;


    // I know the chained condition looks weird but, it is necessary for situations in which you an expression such as
    // 10.3 + 1.7 within a variable of a type of Float, if you dont convert the value into a Float that is valid, the interpreter will throw
    // a runtime error. So in this case we just do a quick type conversion, I know its a hack but, I tried different in having node
    // return an actual float as x.00 when the type is set to float but, nah it always cuts away the decimal if there is nothing but 0s.

    if (variable.typeDef === value.type) {
      this.variables.set(ident, { typeDef: variable.typeDef, value });
    } else if (variable.typeDef === "Float" && value.type === "Int") {
      this.variables.set(ident, { typeDef: variable.typeDef, value: { type: "Float", value: value.value } });
    } else {
      throw new GarbageErrors.RuntimeErrors.EnvironmentError(`Attempted to perform cross type assignment on variable "${ident}", "${ident}" is supposed to be of type "${variable.typeDef}"!`); 
    };

    return this.obtain(ident).value;
  };

};

export default GarbageEnvironment;