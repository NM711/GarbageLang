/**
 * @class GarbageEnvironment
 * @description
 * The environment in the context of interpreters, is the data structure that holds onto different statements, manages variable value bindings,
 * and holds onto different levels of scope during the runtime.
 * @example
 * -- top level or global variable
 
 * let myGlobal: string = "hello";

 * -- top level function" myFn"
 * function myFn() {
 *   -- nested / scoped variable
 *   let myScoped: string = "world";
 * }
 * 
 * A data structure of this may be represented as the following example:
 * 
 * {
 *   type: Variable,
 *   level: 0,
 *   ident: myGlobal,
 *   varType: string,
 *   value: hello,
 * }
 *  // --- fn
 * {
 *  type: Function,
 *  level: 0,
 *  ident: myFn,
 *  body: [
 *    {
 *      type: Variable,
 *      level: 1,
 *      ident: myScoped,
 *      varType: string,
 *      value: world
 *    }
 *  ]
 * }
 */

import GarbageErrors from "../types/errors.types";
import RuntimeTypes from "../types/runtime.types";

class GarbageEnvironment {
  private variables: Map<string, RuntimeTypes.RuntimeValue>
  private constants: Set<string>;

  constructor () {
    this.variables = new Map();
    this.constants = new Set();
  };

  private checkDef (ident: string) {
    if (this.variables.has(ident)) {
      throw new GarbageErrors.RuntimeErrors.RuntimeError(`The variable that has been attempted to be defined "${ident}", already exists within the runtime environment!`);
    }; 
  };

  public declare(ident: string, isConstant: boolean, value: RuntimeTypes.RuntimeValue) {
    this.checkDef(ident);

    this.variables.set(ident, value);

    if (isConstant) {
      this.constants.add(ident);
    };

    return value;
  };

  public obtain(ident: string) {
    if (!this.variables.has(ident)) {
      throw new GarbageErrors.RuntimeErrors.RuntimeError(`The variable "${ident}" is undefined within the environment!`);
    };

    return this.variables.get(ident)
  };

  public assign(ident: string, value: RuntimeTypes.RuntimeValue) {
    this.checkDef(ident);

    if (this.constants.has(ident)) {
      throw new GarbageErrors.RuntimeErrors.RuntimeError("Cannot reassing declared constant!");
    };

    this.variables.set(ident, value);
  };

};

export default GarbageEnvironment;