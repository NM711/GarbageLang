import LexerGrammarTypes from "../../types/lexer.grammar.types";
import { isNumber, isAlphabet } from "../utils";
import type { LineInfo } from "../../types/lexer.types";
import type LexerTokenTypes from "../../types/lexer.tokens";

class GarbageLexer {
  private tokens: LexerTokenTypes.Token[];
  private key: string;
  private data: string[];
  private char: string | undefined;
  protected lineInfo: LineInfo;

  constructor() {
    this.tokens = [];
    this.data = [];
    this.key = "";
    this.char = "";
    this.lineInfo = {
      lineNum: 1,
      charNum: 0
    };
  };

  protected updateLineInfo (): void {
    ++this.lineInfo.charNum;

    if (this.char === "\n") {
        this.lineInfo.charNum = 0;
      ++this.lineInfo.lineNum;
    };
  };

  public set setData(data: string) {
    this.data = data.split("");
  };

  private eat() {
    return this.data.shift();
  };

  private cleanKeyword(): void {
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

  private checkIfNumber(): void {

    while (isNumber(this.char as string)) {
      if (!this.char) break;
      this.key += this.char;
      this.char = this.eat();
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

      this.char = this.eat();

      this.updateLineInfo();

      if (!this.char) break;

      this.checkIfNumber();

      const lookups = {
        special: LexerGrammarTypes.SpecialCharKeywordMap[this.char],
        operator: LexerGrammarTypes.OperatorKeywordMap[this.char],
        type: LexerGrammarTypes.DataTypeKeywordMap[this.key],
        declared: LexerGrammarTypes.DeclarativeKeywordMap[this.key]
      };


      const isCharAlphabet: boolean = isAlphabet(this.char);

      if (isCharAlphabet) {
        this.key += this.char;
        continue;
      };
  
      if (!isCharAlphabet && this.key.length > 0) {
          if (lookups.type || lookups.declared) {
            this.pushTokenWithKeyAsLexeme(lookups.type ?? lookups.declared);
          } else {
            this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.LITERAL);
          };
      };

      if (lookups.special) {
        this.pushToken(this.char, lookups.special);
        continue;
      } else if (lookups.operator) {
        this.pushToken(this.char, lookups.operator);
        continue;
      };
    };
    this.pushToken("EOF", LexerGrammarTypes.LangTokenIdentifier.EOF);
  };

  public getTokens(): LexerTokenTypes.Token[] {
    this.tokenize();
    return this.tokens;
  };
};

export default GarbageLexer;
