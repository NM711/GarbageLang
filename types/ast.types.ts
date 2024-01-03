namespace AbstractSyntaxTreeTypes {

  export enum NodeType {
    PROGRAM = "Program",
    IDENT = "Identifier",
    STR_LITERAL = "StringLiteral",
    NUM_LITERAL = "NumberLiteral",
    DECLARATION_VAR = "DeclarationVariable",
    DECLARATION_FN = "DeclarationFunction",
    FOR_STATEMENT = "ForStatement",
    IF_STATEMENT = "IfStatement",
    SWITCH_STATEMENT = "SwitchStatement",
    EXPR_CALL = "ExpressionCall",
    EXPR_BINARY = "ExpressionBinary",
    EXPR_UNARY = "ExpressionUnary",
  };

  export enum PresedenceLevels {
    LOWEST,
    MID,
    MAX
  };

  export type IdentifierType = "String" | "Null" | "Obj" | "Boolean" | "Float" | "Array" | "Int";

  export type ExpressionOperator = "===" | "|" | "&" | ">" | "<" | ">=" | "<=" | "+" | "-" | "/" | "*";

  interface DeclarationIdentifer {
    type: NodeType
    name: string
  };

  interface DeclarationIdentiferWithType extends DeclarationIdentifer {
    identiferType: IdentifierType
  };

  type DeclarationValue<X = void, Y = void> = {
    type: X,
    value: Y
  };

  type DeclarationValueString = DeclarationValue<NodeType.STR_LITERAL, string>;

  type DeclarationValueNumber = DeclarationValue<NodeType.NUM_LITERAL, number>;

  export type DeclarationLiteralValue = DeclarationValueNumber | DeclarationValueString | null;

  export type ExpressionBaseType<T, L, R> = {
    type: T,
    left: L,
    operator: ExpressionOperator | null,
    right: R
  };

  export type ExpressionType = ExpressionBaseType<NodeType.EXPR_UNARY, DeclarationLiteralValue, DeclarationLiteralValue>;
  export type Expr = ExpressionBaseType<NodeType.EXPR_BINARY,  ExpressionType | DeclarationLiteralValue | null, ExpressionType | DeclarationLiteralValue | null>
  
  // Nodes

  export interface ProgramNode {
    type: NodeType.PROGRAM
    body: TreeNodeType[]
  };

  export interface VariableDeclarationNode {
    type: NodeType.DECLARATION_VAR,
    isConstant: boolean,
    identifier: DeclarationIdentiferWithType
    value: DeclarationLiteralValue | Expr
  };

  export interface FunctionDeclarationNode {
    type: NodeType.DECLARATION_FN
    identifier: DeclarationIdentifer
    params: DeclarationIdentiferWithType[]
    body: TreeNodeType[]
  };

  interface ForLoopExpressions {
    initializer: VariableDeclarationNode
    condition: Expr
    iterator: Expr
  };

  export interface ForStatementNode {
    type: NodeType.FOR_STATEMENT,
    initializer: VariableDeclarationNode,
    info: ForLoopExpressions
    body: TreeNodeType[]
  };

  export interface IFStatementNode {
    type: NodeType.IF_STATEMENT,
    test: Expr
  };

  type TreeNodeType = IFStatementNode | ForStatementNode | FunctionDeclarationNode | VariableDeclarationNode | ProgramNode;

};

export default AbstractSyntaxTreeTypes;
