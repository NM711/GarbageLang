import AbstractSyntaxTreeTypes from "./ast.types";
import { IdentifierType } from "./general.types";

namespace RuntimeTypes {
  export interface NumberValue {
    type: "Int" | "Float";
    value: number;
  };

  export interface NullValue {
    type: "Null";
    value: null;
  };

  export interface StringValue {
    type: "String";
    value: string;
  };

  export interface BooleanValue {
    type: "Boolean";
    value: boolean;
  };

  export interface StatementEnd {
    type: "end";
    value: ";";
  };

  export interface EnvironmentVariable {
    type: "EnvironmentVariable";
    typeDef: IdentifierType;
    value: RuntimeTypes.RuntimeValue;
  };

  export interface EnvironmentFunction {
    type: "EnvironmentFunction";
    value: AbstractSyntaxTreeTypes.FunctionDeclarationNode;
  };

  export interface NativeFunction {
    type:"NativeFunction";
    params: AbstractSyntaxTreeTypes.IdentifierWithType[];
    call: (args: any[]) => any;
  };

  export type EnvironmentValue = NativeFunction | EnvironmentVariable | EnvironmentFunction;
    
  export type RuntimeValue = StatementEnd | NumberValue | NullValue | StringValue | BooleanValue;
};

export default RuntimeTypes;
