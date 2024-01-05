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
    // Singles + Operators

    LESSER,
    LESSER_OR_EQUAL,
    GREATER,
    GREATER_OR_EQUAL,
    OR,
    AND,
    EQUALITY,
    EQUAL,
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
    LINE_BREAK,
    
    // Literals
    LITERAL,
    // End of file
    EOF,

    // Declaratives
    VARIABLE,
    CONSTANT,
    FUNCTION,
    CLASS,
    PARAMETER,
    IF,
    ELSE,
    ELSE_IF,
    SWITCH,
    FOR,
    WHILE,
    LOG
  };

  // Keyword Lookups

  export const DeclarativeKeywordMap: { [index: string]: LangTokenIdentifier } = {
    "func": LangTokenIdentifier.FUNCTION,
    "const": LangTokenIdentifier.CONSTANT,
    "let": LangTokenIdentifier.VARIABLE,
    "for": LangTokenIdentifier.FOR,
    "while": LangTokenIdentifier.WHILE,
    "switch": LangTokenIdentifier.SWITCH,
    "log": LangTokenIdentifier.LOG,
    "if": LangTokenIdentifier.IF,
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
  };

  export const SpecialCharKeywordMap: { [index: string]: LangTokenIdentifier } = {
   "}": LangTokenIdentifier.RIGHT_CURLY_BRACE,
   "{": LangTokenIdentifier.LEFT_CURLY_BRACE,
   ")": LangTokenIdentifier.RIGHT_PARENTHESES,
   "(": LangTokenIdentifier.LEFT_PARENTHESES,
   ';': LangTokenIdentifier.SEMICOLON,
   '\n': LangTokenIdentifier.LINE_BREAK,
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
  };
};

export default LexerGrammarTypes;
