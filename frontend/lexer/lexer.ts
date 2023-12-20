import LexerGrammarTypes from "../../types/lexer.grammar.types";
import LexerLine from "./lexer.line";
import { isNumber, isAlphabet } from "../utils";
import type LexerTokenTypes from "../../types/lexer.tokens";
import type { IGarbageLangLexer } from "../../types/lexer.types";

// 1. Check if declared string has a closing quote
// 2. Look for unexpected words or characters, for example if a word such as HELLO exists as a literal and no declarative
// token was generated before hand, throw an error because you cannot write a literal without a generated declarative.

class GarbageLexer extends LexerLine implements IGarbageLangLexer {
  private tokens: LexerTokenTypes.Token[];
  private key: string;
  constructor() {
    super();
    this.tokens = [];
    this.key = "";
  };

  private cleanKeyword (): void {
    this.key = "";
  };

  private pushToken(lexeme: string, id: LexerGrammarTypes.LangTokenIdentifier, charNum: number = this.lineInfo.charNum) {
    this.tokens.push({
      id,
      lexeme,
      line: this.lineInfo.lineNum,
      char: charNum
    });
  };

  private pushTokenWithKeyAsLexeme (id: LexerGrammarTypes.LangTokenIdentifier) {
    this.pushToken(this.key, id);
    this.cleanKeyword();
  };

  public tokenize(data: string): void {
    for (let i = 0; i < data.length; i++) {
      const char: string = data[i];
      const nextChar: string = data[i + 1];
      const prevChar: string = data[i - 1];

      this.updateLineInfo(char);

      const isCharNum: boolean = isNumber(char);
      const isPrevCharNum: boolean = isNumber(prevChar);


      const isSpecialChar = LexerGrammarTypes.SpecialCharKeywordMap[char];
      const isOperator = LexerGrammarTypes.OperatorKeywordMap[char];

      switch (true) {
        // Numbers
        case isCharNum:
          this.key += char;
        continue;
        case !isCharNum && isPrevCharNum:
          if (this.key.includes(".")) {
             this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.FLOAT);
          } else this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.INT);
        continue;

        // Lookup Check

        case isOperator !== undefined:
         this.pushToken(char, isOperator);
        continue;

        case isSpecialChar !== undefined:
          this.pushToken(char, isSpecialChar);
        continue;

        case !char || !nextChar:
          this.pushToken("EOF", LexerGrammarTypes.LangTokenIdentifier.EOF);
        break;

        default: {
          if (isAlphabet(char)) {
            this.key += char;
            
            const isDeclarative = LexerGrammarTypes.DeclarativeKeywordMap[this.key];
            const isType = LexerGrammarTypes.DataTypeKeywordMap[this.key];

            if (isDeclarative || isType) {
             this.pushTokenWithKeyAsLexeme(isDeclarative ?? isType);
            };


            if (!isAlphabet(nextChar) && this.key !== "") {
              this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.LITERAL);
            };
          };
        };
      };
    };
  };

  public getTokens(): LexerTokenTypes.Token[] {
    return this.tokens;
  };
};

export default GarbageLexer;
