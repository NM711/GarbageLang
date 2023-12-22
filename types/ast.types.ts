namespace AbstractSyntaxTreeTypes {

  export enum Node {
    PROGRAM = "Program",
    IDENTIFIER = "Identifier",
    STRING_LITERAL = "StringLiteral",
    NUMBER_LITERAL = "NumberLiteral",
    DECLARATION_VARIABLE = "DeclarationVariable",
    DECLARATION_FUNCTION = "DeclarationFunction",
    STATEMENT_FOR = "StatementFor",
    STATEMENT_IF = "StatementIf",
    STATEMENT_SWITCH = "StatementSwitch",
    EXPRESSION_CALL = "ExpressionCall",
    EXPRESSION_STATEMENT = "ExpressionStatement",
    EXPRESSION_BINARY = "ExpressionBinary",
    EXPRESSION_UNARY = "ExpressionUnary"
  };

  export type IdentifierType = "String" | "Null" | "Obj" | "Boolean" | "Float" | "Array" | "Int";

  export type ExpressionOperator = "===" | "|" | "&" | ">" | "<" | ">=" | "<=" | "+" | "-" | "/" | "*";

  interface DeclarationIdentifer {
    type: Node.IDENTIFIER
    name: string
  };

  interface DeclarationIdentiferWithType extends DeclarationIdentifer {
    identiferType: IdentifierType
  };

  type DeclarationValue<X = void, Y = void> = {
    type: X,
    value: Y
  };

  type DeclarationValueString = DeclarationValue<Node.STRING_LITERAL, string>;

  type DeclarationValueNumber = DeclarationValue<Node.NUMBER_LITERAL, number>;

  export type DeclarationLiteralValue = DeclarationValueNumber | DeclarationValueString | null;

 export type ExpressionBaseType<T, L, R> = {
    type: T,
    left: L,
    operator: ExpressionOperator | null,
    right: R
  };

 export type UnaryExpressionType = ExpressionBaseType<Node.EXPRESSION_UNARY, DeclarationLiteralValue, DeclarationLiteralValue>;

 export type BinaryExpressionType = ExpressionBaseType<Node.EXPRESSION_BINARY, UnaryExpressionType, UnaryExpressionType>;

 export type ExpressionsType = UnaryExpressionType | BinaryExpressionType;

  // Nodes

  export interface ProgramNode {
    type: Node.PROGRAM
    body: TreeNodeType[]
  };

  export interface VariableDeclarationNode {
    type: Node.DECLARATION_VARIABLE,
    isConstant: boolean,
    identifier: DeclarationIdentiferWithType
    value: DeclarationLiteralValue | ExpressionsType
  };

  export interface FunctionDeclarationNode {
    type: Node.DECLARATION_FUNCTION
    identifier: DeclarationIdentifer
    params: DeclarationIdentiferWithType[]
    body: TreeNodeType[]
  };


  interface ForLoopExpressions {
    initializer: VariableDeclarationNode
    condition: ExpressionsType
    iterator: UnaryExpressionType
  };

  export interface ForStatementNode {
    type: Node.STATEMENT_FOR,
    initializer: VariableDeclarationNode,
    info: ForLoopExpressions
    body: TreeNodeType[]
  };

  export interface IFStatementNode {
    type: Node.STATEMENT_IF,
    test: ExpressionsType
  };

  type TreeNodeType = IFStatementNode | ForStatementNode | FunctionDeclarationNode | VariableDeclarationNode | ProgramNode;

  interface ITreeNode {
  }
};

export default AbstractSyntaxTreeTypes;
