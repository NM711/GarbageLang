namespace AbstractSyntaxTreeTypes {

  export enum NodeType {
    PROGRAM = "Program",
    IDENT = "Identifier",
    STR_LITERAL = "StringLiteral",
    NUM_LITERAL = "NumberLiteral",
    NULL_LITERAL = "NullLiteral",
    DECLARATION_VAR = "DeclarationVariable",
    DECLARATION_FN = "DeclarationFunction",
    FOR_STATEMENT = "ForStatement",
    IF_STATEMENT = "IfStatement",
    SWITCH_STATEMENT = "SwitchStatement",
    EXPR_CALL = "ExpressionCall",
    EXPR_ASSIGN = "ExpressionAssignment",
    EXPR_BINARY = "ExpressionBinary",
    EXPR_UNARY = "ExpressionUnary"
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

  type LiteralValue<X = void, Y = void> = {
    type: X,
    value: Y
  };

  export type StringLiteral = LiteralValue<NodeType.STR_LITERAL, string>;

  export type NumberLiteral = LiteralValue<NodeType.NUM_LITERAL, number>;

  export type NullLiteral = LiteralValue<NodeType.NULL_LITERAL, null>;

  export type Literal = StringLiteral | NumberLiteral | NullLiteral;

  export type ExpressionBaseType<T, L, R> = {
    type: T,
    left: L,
    operator: ExpressionOperator,
    right: R
  };

  export type UnaryExpr = ExpressionBaseType<NodeType.EXPR_UNARY, Literal, Literal>;
  export type BinaryExpr = ExpressionBaseType<NodeType.EXPR_BINARY, UnaryExpr | Literal, UnaryExpr | Literal>
  export type Expr = UnaryExpr | BinaryExpr
  
  // Nodes

  export interface ProgramNode {
    type: NodeType.PROGRAM
    body: TreeNodeType[]
  };

  export interface AssignmentExprNode {
    type: NodeType.EXPR_ASSIGN,
    value: Expr | Literal
  };

  export interface VariableDeclarationNode {
    type: NodeType.DECLARATION_VAR,
    isConstant: boolean,
    identifier: DeclarationIdentiferWithType
    value?: Literal | Expr
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

  export type TreeNodeType =
   | Literal 
   | Expr 
   | IFStatementNode
   | ForStatementNode 
   | FunctionDeclarationNode 
   | VariableDeclarationNode 
   | ProgramNode;

};

export default AbstractSyntaxTreeTypes;
