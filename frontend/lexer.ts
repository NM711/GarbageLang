import LexerGrammarTypes from "../types/lexer/lexer.grammar.types";
import { isNumber, isAlphabet } from "./utils";
import type { LineInfo, Token } from "../types/lexer/lexer.types";

class GarbageLexer {
  private tokens: Token[];
  private key: string;
  private data: string[];
  private char: string | undefined;
  protected lineInfo: LineInfo;

  constructor() {
    this.tokens = [];
    this.data = [];
    this.key = "";
    this.lineInfo = this.resetLineInfo();
  };

  private look() {
    return this.data[0];
  };

  protected updateLineInfo(): void {
    ++this.lineInfo.charNum;

    if (this.look() === "\n") {
        this.lineInfo.charNum = 0;
      ++this.lineInfo.lineNum;
    };
  };

  private resetLineInfo() {
    return {
      lineNum: 1,
      charNum: 0
    };
  };

  public set setData(data: string) {
    this.data = data.split("");
  };

  private eat() {
    return this.data.shift();
  };

  private pushToken(lexeme: string, id: LexerGrammarTypes.LangTokenIdentifier, charNum: number = this.lineInfo.charNum) {
    this.tokens.push({
      id,
      lexeme,
      line: this.lineInfo.lineNum,
      char: charNum
    });
  };

  private pushTokenWithKeyAsLexeme(id: LexerGrammarTypes.LangTokenIdentifier) {
    this.pushToken(this.key, id);
    this.key = "";
  };

  private checkIfNumber(): void {

    while (isNumber(this.look())) {
      if (!this.look()) break;
      this.key += this.look();
      this.eat();
    };

    const isKeyNum: boolean = isNumber(this.key);

    if (isKeyNum) {
        if (this.key.includes(".")) {
          this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.FLOAT);
        } else {
          this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.INT);
        };
    };
  };

  private tokenize(): void {

    while (this.data.length > 0) {
      this.updateLineInfo();

      if (!this.look()) break;

      this.checkIfNumber();

      const lookups = {
        special: LexerGrammarTypes.SpecialCharKeywordMap[this.look()],
        operator: LexerGrammarTypes.OperatorKeywordMap[this.look()],
        type: LexerGrammarTypes.DataTypeKeywordMap[this.key],
        declared: LexerGrammarTypes.DeclarativeKeywordMap[this.key]
      };

      const isCharAlphabet: boolean = isAlphabet(this.look());

      if (isCharAlphabet) {
        this.key += this.look();
      };

      if (!isCharAlphabet || this.data.length === 1 && this.key.length > 0) {
          if (lookups.type || lookups.declared) {
            this.pushTokenWithKeyAsLexeme(lookups.type ?? lookups.declared);
          } else {
            this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.LITERAL);
          };
      };

      if (lookups.special || lookups.operator) {
        this.pushToken(this.look(), lookups.special ?? lookups.operator);
      };

      this.eat();
    };
    this.pushToken("EOF", LexerGrammarTypes.LangTokenIdentifier.EOF);
  };

  public getTokens(): Token[] {
    this.tokenize();
    const tokens = this.tokens;
    this.clean();
    return tokens;
  };

  private clean() {
    this.tokens = [];
    this.data = [];
    this.lineInfo = this.resetLineInfo();
    this.key = "";
  };
};

export default GarbageLexer;
