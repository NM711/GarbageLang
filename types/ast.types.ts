import type { IdentifierType } from "./general.types";

namespace AbstractSyntaxTreeTypes {

  export enum NodeType {
    PROGRAM = "Program",
    IDENT = "Identifier",
    STR_LITERAL = "StringLiteral",
    NUM_LITERAL = "NumberLiteral",
    NULL_LITERAL = "NullLiteral",
    STATEMENT_END = "EndStatement",
    DECLARATION_VAR = "DeclarationVariable",
    DECLARATION_FN = "DeclarationFunction",
    FOR_STATEMENT = "ForStatement",
    IF_STATEMENT = "IfStatement",
    SWITCH_STATEMENT = "SwitchStatement",
    EXPR_STATEMENT = "ExpressionStatement",
    EXPR_CALL = "ExpressionCall",
    EXPR_ASSIGN = "ExpressionAssignment",
    EXPR_BINARY = "ExpressionBinary",
    EXPR_UNARY = "ExpressionUnary",
    EXPR_PREFIXER = "ExpressionPrefixer"
  };

  export type PrefixOperators = "++" | "--"
  export type ExpressionOperator = "===" | "|" | "&" | ">" | "<" | ">=" | "<=" | "+" | "-" | "/" | "*" | PrefixOperators;

  export interface Identifier {
    type: NodeType.IDENT
    name: string
  };

  export interface IdentifierWithType extends Identifier {
    identiferType: IdentifierType
  };

  type LiteralValue<X = void, Y = void> = {
    type: X,
    value: Y
  };

  export type StringLiteral = LiteralValue<NodeType.STR_LITERAL, string>;

  export type NumberLiteral = LiteralValue<NodeType.NUM_LITERAL, number>;

  export type NullLiteral = LiteralValue<NodeType.NULL_LITERAL, null>;

  export type StatementEnd = LiteralValue<NodeType.STATEMENT_END, ";">;

  export type Literal = StringLiteral | NumberLiteral | NullLiteral | StatementEnd;

  export type ExpressionBaseType<T, L, R> = {
    type: T,
    left: L,
    operator: ExpressionOperator,
    right: R
  };

  export type UnaryExpr = ExpressionBaseType<NodeType.EXPR_UNARY, Literal, Literal>;
  export type BinaryExpr = ExpressionBaseType<NodeType.EXPR_BINARY, UnaryExpr | Literal, UnaryExpr | Literal>;
  export type Expr = UnaryExpr | BinaryExpr;
  
  // Nodes

  export interface ProgramNode {
    type: NodeType.PROGRAM;
    body: TreeNodeType[];
  };

  export interface ExpressionAssignmentNode {
    type: NodeType.EXPR_ASSIGN,
    left: Identifier | IdentifierWithType,
    right: Expr | Literal
  };

  export interface ExpressionPrefixer {
    type: NodeType.EXPR_PREFIXER;
    prefix: PrefixOperators; 
    left: Identifier;
  };

  export interface VariableDeclarationNode {
    type: NodeType.DECLARATION_VAR;
    isConstant: boolean;
    assignment: ExpressionAssignmentNode;
  };

  export interface FunctionDeclarationNode {
    type: NodeType.DECLARATION_FN;
    identifier: Identifier;
    params: IdentifierWithType[];
    body: TreeNodeType[];
  };

  interface ForLoopExpressions {
    initializer: VariableDeclarationNode;
    condition: Expr;
    iterator: Expr;
  };

  export interface ForStatementNode {
    type: NodeType.FOR_STATEMENT;
    initializer: VariableDeclarationNode;
    info: ForLoopExpressions;
    body: TreeNodeType[];
  };

  export interface IFStatementNode {
    type: NodeType.IF_STATEMENT;
    test: Expr;
  };

  export type TreeNodeType =
   | Literal 
   | Expr 
   | IFStatementNode
   | ForStatementNode 
   | ExpressionAssignmentNode
   | FunctionDeclarationNode 
   | VariableDeclarationNode 
   | ExpressionPrefixer
   | ExpressionAssignmentNode
   | ProgramNode;

};

export default AbstractSyntaxTreeTypes;
