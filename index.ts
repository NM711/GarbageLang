import GarbageLexer from "./frontend/lexer";
import GarbageParser from "./frontend/parser/parser";
import GarbageTreeWalker from "./runtime/walker";
import fs from "fs";
import process from "process";

class InterpretationCall {
  private lexer: GarbageLexer;
  private parser: GarbageParser;
  private walker: GarbageTreeWalker;

  constructor () {
    this.lexer = new GarbageLexer();
    this.parser = new GarbageParser();
    this.walker = new GarbageTreeWalker();
  };

  private reader (filePath: string): string {
    return fs.readFileSync(filePath, { encoding: "utf-8" });
  };

  public readCmdArgs() {

    const args = process.argv;
    if (args[2] !== "-e" && args[2] !== "--exec") {
      throw new Error("Invalid Command Line Argument!");
    };

    for (let i = 3; i < args.length; i++) {
      const path = args[i];

      if (!path.endsWith(".gb")) {
        throw new Error(`Attemted to read from invalid file type, expected files ending with ".gb"`);
      };

      const data = this.reader(path);

      this.lexer.setData = data;

      const tokens = this.lexer.getTokens();

      this.parser.setTokens = tokens;
      
      const program = this.parser.generateAST();

      this.walker.evaluateProgram(program);
    };
  };
};

const call = new InterpretationCall();

call.readCmdArgs();
