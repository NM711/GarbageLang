import { SyntaxError } from "./lexer.error";
import type { LineInfo, LineError} from "../types/lexer.types";

class LexerLine {
  protected lineInfo: LineInfo;
  constructor () {
    this.lineInfo = {
      lineNum: 1,
      charNum: 1
    };
  };

  protected updateLineInfo (char: string): void {
    ++this.lineInfo.charNum;

    if (char === "\n") {
        this.lineInfo.charNum = 0;
      ++this.lineInfo.lineNum;
    };
  };

  protected syntaxError ({ charNum = this.lineInfo.charNum, where, what }: LineError) {
    throw new SyntaxError(`${what} ' ${where} ' at/around ===> (line: ${this.lineInfo.lineNum} | char: ${charNum})`);
  };
};

export default LexerLine;
