import LexerGrammarTypes from "../types/lexer/lexer.grammar.types";
import { isNumber, isAlphabet } from "./utils";
import GarbageErrors from "../types/errors.types";
import type { LineInfo, Token } from "../types/lexer/lexer.types";

// Whenever I have time im gonna scrap this entire lexer and rebuilt it from the ground up.

interface LookupMap {
  special: LexerGrammarTypes.LangTokenIdentifier;
  operator: LexerGrammarTypes.LangTokenIdentifier;
  type: LexerGrammarTypes.LangTokenIdentifier; 
  declared: LexerGrammarTypes.LangTokenIdentifier;
};

class GarbageLexer {
  private tokens: Token[];
  private key: string;
  private data: string[];
  private char: string | undefined;
  private inString: boolean;
  private inLiteral: boolean;
  protected lineInfo: LineInfo;
  
  constructor() {
    this.tokens = [];
    this.data = [];
    this.key = "";
    this.inString = false;
    this.inLiteral = false;
    this.lineInfo = this.resetLineInfo();
  };

  protected updateLineInfo(): void {
    this.char = this.eat();
    ++this.lineInfo.charNum;

    if (this.char === "\n") {
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
    if (this.key !== "" && this.key !== " ") {
      this.key = this.key.trim();
      this.pushToken(this.key, id);
      this.key = "";
    };
  };

  private checkIfNumber(): void {
    while (isNumber(this.char as string)) {
      this.key += this.char;
      this.updateLineInfo();
    };

    if (isNumber(this.key)) {
        if (this.key.includes(".")) {
          this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.FLOAT);
        } else {
          this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.INT);
        };
    };
  };
  
  private checkIfLiteral(): void {
    if (isAlphabet(this.char as string)) {
      this.inLiteral = true;
    };

    while (this.inString) {
      if (!this.char) {
        throw this.syntaxError("Unexpectedly reached end of file before string closure!", this.key);
      } else if (this.char === "\n") {
        throw this.syntaxError("Unexpected line break before string closure!", `${this.key}${this.char}`)
      };
          
      if (this.char === '"') {
        this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.STRING);
        this.inString = false;
        this.updateLineInfo();
        break;
      };

      this.key += this.char;
      this.updateLineInfo();
    };

    while (this.inLiteral) {
      // const hello world - Invalid
      // const hello - Valid
      // break out when a literal contains something other than a number or 

      if (!isAlphabet(this.char as string) && !isNumber(this.char as string)) {
        break;
      };

      this.key += this.char;
      this.updateLineInfo();

      this.key = this.key.trim();
      if (this.key.length > 0 && !isAlphabet(this.key.charAt(0))) {
        this.syntaxError("Literals must commence with a valid alphabet character!", `${this.key}`);
      };
    };

    this.inLiteral = false;
  };

  private lookup(): LookupMap {
    return {
      special: LexerGrammarTypes.SpecialCharKeywordMap[this.char as string],
      operator: LexerGrammarTypes.OperatorKeywordMap[this.char as string],
      type: LexerGrammarTypes.DataTypeKeywordMap[this.key],
      declared: LexerGrammarTypes.DeclarativeKeywordMap[this.key]
    };
  };

  private syntaxError(message: string, at: string) {
    throw new GarbageErrors.FrontendErrors.SyntaxError({
      message,
      char: this.lineInfo.charNum,
      line: this.lineInfo.lineNum,
      at
    })
  };

  private tokenize(): void {

    while (this.data.length > 0) {
      this.updateLineInfo();

      if (!this.char) {
        break;
      };

      if (this.char === "\n") {
        continue;
      };

      this.checkIfNumber();
      this.checkIfLiteral();
      const lookup = this.lookup();
      
      if (lookup.declared || lookup.type) {
        if (lookup.declared && lookup.declared === LexerGrammarTypes.LangTokenIdentifier.FUNCTION_CALL) {
          this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.FUNCTION_CALL);
        } else this.pushTokenWithKeyAsLexeme(lookup.declared ?? lookup.type);
      } else {
        this.pushTokenWithKeyAsLexeme(LexerGrammarTypes.LangTokenIdentifier.LITERAL);
      };

      if (lookup.special) {
        if (lookup.special && lookup.special === LexerGrammarTypes.LangTokenIdentifier.DOUBLE_QUOTE) {
          this.inString = true;
          // since we changed the state we now want to rerun the literal tokenizer above
          // so it can execute the string generator within it.
          continue;
        };
        this.pushToken(this.char, lookup.special);
      } else if (lookup.operator) {
          // inital update
          while (this.lookup().operator) {
            this.key += this.char;
            this.updateLineInfo();
          };

          const operatorId = LexerGrammarTypes.OperatorKeywordMap[this.key.trim()];
          this.pushTokenWithKeyAsLexeme(operatorId);

          // update the key with the value that comes after the prefix
          this.key += this.char
      };
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
