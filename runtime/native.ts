import AbstractSyntaxTreeTypes from "../types/ast.types";
import RuntimeTypes from "../types/runtime.types";

class GarbageNativeFunctions {
  private global: Map<string, RuntimeTypes.EnvironmentValue>;

  constructor (globalEnv: Map<string, RuntimeTypes.EnvironmentValue>) {
    this.global = globalEnv
  };

  public initalize() {
    this.global.set("println", {
      type: "NativeFunction",
      params: [{
        type: AbstractSyntaxTreeTypes.NodeType.IDENT,
        name: "text",
        identifierType: "Any"
      }],
      call: (...args: any[]) => {
        console.log(...args);
      }
    });
  };

  public get retreive() {
    return this.global;
  };
};

export default GarbageNativeFunctions;
