import { IdentifierType } from "./general.types";

namespace RuntimeTypes {
  export interface NumberValue {
    type: "Int" | "Float",
    value: number
  };

  export interface NullValue {
    type: "Null",
    value: null
  };

  export interface StringValue {
    type: "String",
    value: string
  };

  export interface StatementEnd {
    type: "end",
    value: ";"
  };


  export interface EnvironmentValue {
    typeDef: IdentifierType,
    value: RuntimeTypes.RuntimeValue
  };
  
  export type RuntimeValue = StatementEnd | NumberValue | NullValue | StringValue
};

export default RuntimeTypes;