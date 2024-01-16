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
    ELSE_STATEMENT = "ElseStatement",
    BLOCK_STATEMENT = "BlockStatement",
    SWITCH_STATEMENT = "SwitchStatement",
    EXPR_STATEMENT = "ExpressionStatement",
    EXPR_CALL = "ExpressionCall",
    EXPR_ASSIGN = "ExpressionAssignment",
    EXPR_BINARY = "ExpressionBinary",
    EXPR_UNARY = "ExpressionUnary",
    EXPR_PREFIXER = "ExpressionPrefixer"
  };

  export type PrefixOperators = "++" | "--"
  export type ExpressionOperator = "===" | "=" | "|" | "&" | ">" | "<" | ">=" | "<=" | "+" | "-" | "/" | "*" | PrefixOperators;

  export interface Identifier {
    type: NodeType.IDENT
    name: string
  };

  export interface IdentifierWithType extends Identifier {
    identifierType: IdentifierType
  };

  type LiteralValue<X = void, Y = void> = {
    type: X,
    value: Y
  };

  export type StringLiteral = LiteralValue<NodeType.STR_LITERAL, string>;

  export type NumberLiteral = LiteralValue<NodeType.NUM_LITERAL, number>;

  export type NullLiteral = LiteralValue<NodeType.NULL_LITERAL, null>;

  export type StatementEnd = LiteralValue<NodeType.STATEMENT_END, ";">;

  export type Literal = StringLiteral | NumberLiteral | NullLiteral | StatementEnd | Identifier | IdentifierWithType;

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

  export interface BlockStatementNode {
    type: NodeType.BLOCK_STATEMENT,
    body: TreeNodeType[]
  };

  export interface FunctionDeclarationNode {
    type: NodeType.DECLARATION_FN;
    identifier: Identifier;
    params: IdentifierWithType[];
    body: BlockStatementNode;
  };
  
  export interface CallExpressionNode {
    type: NodeType.EXPR_CALL;
    calle: Identifier;
    arguments: (Identifier | Literal)[];
  };

  interface ForLoopExpressions {
    initializer: VariableDeclarationNode | Identifier;
    condition: Expr;
    updater: ExpressionPrefixer;
  };

  export interface ForStatementNode {
    type: NodeType.FOR_STATEMENT;
    info: ForLoopExpressions;
    block: BlockStatementNode;
  };

  export interface ElseStatementNode {
    type: NodeType.ELSE_STATEMENT;
    block: BlockStatementNode;
  };

  export interface IFStatementNode {
    type: NodeType.IF_STATEMENT;
    condition: Expr;
    block: BlockStatementNode;
    alternate?: ElseStatementNode;
  };

  export type TreeNodeType =
   | Literal 
   | Expr 
   | IFStatementNode
   | ForStatementNode 
   | ExpressionAssignmentNode
   | FunctionDeclarationNode 
   | BlockStatementNode
   | VariableDeclarationNode 
   | ExpressionPrefixer
   | ExpressionAssignmentNode
   | CallExpressionNode
   | ProgramNode;


  export type IdentOrLiteral = AbstractSyntaxTreeTypes.IdentifierWithType | AbstractSyntaxTreeTypes.Identifier | AbstractSyntaxTreeTypes.Literal;
};

export default AbstractSyntaxTreeTypes;
