namespace AbstractSyntaxTreeTypes {

  export enum Node {
    PROGRAM,
    IDENTIFIER,
    STRING_LITERAL,
    NUMBER_LITERAL,
    DECLARATION_VARIABLE,
    DECLARATION_FUNCTION,
    STATEMENT_FOR,
    STATEMENT_IF,
    STATEMENT_SWITCH,
    EXPRESSION_CALL,
    EXPRESSION_STATEMENT,
    EXPRESSION_BINARY,
    EXPRESSION_UNARY
  };

  type IdentifierType = "String" | "Null" | "Obj" | "Boolean" | "Float" | "Array" | "Int";

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

  type DeclarationLiteralValue = DeclarationValueNumber | DeclarationValueString;

  type LeftOrRightBinaryExpressionType = DeclarationIdentiferWithType | DeclarationLiteralValue | BinaryExpression;

  interface BinaryExpression {
    type: Node.EXPRESSION_BINARY
    left: LeftOrRightBinaryExpressionType
    operator: string
    right: LeftOrRightBinaryExpressionType
  };

  // Nodes

  export interface ProgramNode {
    type: Node.PROGRAM
    body: TreeNodeType[]
  };

  export interface VariableDeclarationNode {
    type: Node.DECLARATION_VARIABLE,
    isConstant: boolean,
    identifier: DeclarationIdentiferWithType
    value: DeclarationLiteralValue
  };

  export interface FunctionDeclarationNode {
    type: Node.DECLARATION_FUNCTION
    identifier: DeclarationIdentifer
    params: DeclarationIdentiferWithType[]
    body: TreeNodeType[]
  };

  // type -> for
  // initializer -> for (let i = 0;)
  // binaryExpr1 -> for (let i = 0; i < 5;)
  // binaryExpr2 -> for (let i = 0; i < 5; i + 1)
  // body => 
  // for (let i = 0; i < 5; i + 1) {
  // }

  export interface ForStatementNode {
    type: Node.STATEMENT_FOR,
    initializer: VariableDeclarationNode,
    binaryExpr1: BinaryExpression,
    binaryExpr2: BinaryExpression,
    body: TreeNodeType[]
  };

  export interface IFStatementNode {
    type: Node.STATEMENT_IF,
    test: BinaryExpression;
  };

  type TreeNodeType = IFStatementNode | ForStatementNode | FunctionDeclarationNode | VariableDeclarationNode | ProgramNode;

  interface ITreeNode {
  }
};

export default AbstractSyntaxTreeTypes;
