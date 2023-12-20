import { callSyntaxError } from "../errors/syntax";
import type { LineInfo } from "../../types/lexer.types"

class LexerLine {
  protected lineInfo: LineInfo;
  constructor () {
    this.lineInfo = {
      lineNum: 1,
      charNum: 0
    };
  };

  protected updateLineInfo (char: string): void {
    ++this.lineInfo.charNum;

    if (char === "\n") {
        this.lineInfo.charNum = 0;
      ++this.lineInfo.lineNum;
    };
  };

 // protected syntaxError (where: string, what: string, charNum: number = this.lineInfo.charNum) {
 //   return callSyntaxError({ what, where, line: this.lineInfo.lineNum, char: charNum });
 // };
};

export default LexerLine;
