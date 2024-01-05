namespace RuntimeTypes {
  export type ValueType = "number" | "string" | "null";

  export interface NumberValue {
    type: "number",
    value: number
  };

  export interface NullValue {
    type: "null",
    value: null
  };

  export interface StringValue {
    type: "string",
    value: string
  };
  
  export type RuntimeValue = NumberValue | NullValue | StringValue
};

export default RuntimeTypes;