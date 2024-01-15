namespace LexerGrammarTypes {

  export enum LangTokenIdentifier {
    // Types
    FLOAT = 1,
    INT,
    STRING,
    ARRAY,
    OBJECT,
    BOOLEAN,
    NULL,
    ANY,
    // Singles + Operators

    LESSER,
    LESSER_OR_EQUAL,
    GREATER,
    GREATER_OR_EQUAL,
    OR,
    AND,
    EQUALITY,
    EQUAL,
    PREFIX_INCREMENT,
    PREFIX_DECREMENT,
    ADDITION,
    SUBTRACTION,
    MULTIPLICATION,
    DIVISION,
    SEMICOLON,
    RIGHT_PARENTHESES,
    LEFT_PARENTHESES,
    RIGHT_CURLY_BRACE,
    LEFT_CURLY_BRACE,
    DOUBLE_QUOTE,
    // Literals
    LITERAL,
    // End of file
    EOF,

    // Declaratives
    VARIABLE,
    CONSTANT,
    FUNCTION,
    FUNCTION_CALL,
    IF,
    ELSE,
    ELSE_IF,
    FOR
  };

  // Keyword Lookups

  export const DeclarativeKeywordMap: { [index: string]: LangTokenIdentifier } = {
    "func": LangTokenIdentifier.FUNCTION,
    "const": LangTokenIdentifier.CONSTANT,
    "let": LangTokenIdentifier.VARIABLE,
    "for": LangTokenIdentifier.FOR,
    "if": LangTokenIdentifier.IF,
    "call": LangTokenIdentifier.FUNCTION_CALL,
    "else if": LangTokenIdentifier.ELSE_IF,
    "else": LangTokenIdentifier.ELSE
  };

  export const DataTypeKeywordMap: { [index: string]: LangTokenIdentifier } = {
    "Null": LangTokenIdentifier.NULL,
    "String": LangTokenIdentifier.STRING,
    "Obj": LangTokenIdentifier.OBJECT,
    "Array": LangTokenIdentifier.ARRAY,
    "Boolean": LangTokenIdentifier.BOOLEAN,
    "Float": LangTokenIdentifier.FLOAT,
    "Int": LangTokenIdentifier.INT,
    "Any": LangTokenIdentifier.ANY
  };

  export const SpecialCharKeywordMap: { [index: string]: LangTokenIdentifier } = {
   "}": LangTokenIdentifier.RIGHT_CURLY_BRACE,
   "{": LangTokenIdentifier.LEFT_CURLY_BRACE,
   ")": LangTokenIdentifier.RIGHT_PARENTHESES,
   "(": LangTokenIdentifier.LEFT_PARENTHESES,
   ';': LangTokenIdentifier.SEMICOLON,
   '"': LangTokenIdentifier.DOUBLE_QUOTE
  };

  export const OperatorKeywordMap: { [index: string]: LangTokenIdentifier } = {
    ">": LangTokenIdentifier.GREATER,
    ">=": LangTokenIdentifier.GREATER_OR_EQUAL,
    "<": LangTokenIdentifier.LESSER,
    "<=": LangTokenIdentifier.LESSER_OR_EQUAL,
    "+": LangTokenIdentifier.ADDITION,
    "-": LangTokenIdentifier.SUBTRACTION,
    "*": LangTokenIdentifier.MULTIPLICATION,
    "/": LangTokenIdentifier.DIVISION,
    "=": LangTokenIdentifier.EQUAL,
    "===": LangTokenIdentifier.EQUALITY,
    "|": LangTokenIdentifier.OR,
    "&": LangTokenIdentifier.AND,
    "++": LangTokenIdentifier.PREFIX_INCREMENT,
    "--": LangTokenIdentifier.PREFIX_INCREMENT
  };
};

export default LexerGrammarTypes;
