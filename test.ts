import GarbageLexer from "./frontend/lexer";
import GarbageParser from "./frontend/parser/parser";
import GarbageTreeWalker from "./runtime/walker";

class GarbageTests {
  private lexer: GarbageLexer;
  private parser: GarbageParser;
  private walker: GarbageTreeWalker;

  constructor () {
    this.lexer = new GarbageLexer();
    this.parser = new GarbageParser();
    this.walker = new GarbageTreeWalker();
  };

  private execute(data: string) {
    this.lexer.setData = data;
    const tokens = this.lexer.getTokens();
    this.parser.setTokens = tokens;
    const tree = this.parser.generateAST();
    this.walker.evaluateProgram(tree);
  };

  public testOne() {
    this.execute(`
    let x Int = 0;
    if (3 < 1) {
      let x Int = 5;

      const greeting String = "Hello";
    } else {
      x = 10;
      let b String = "hello";
    };

    x = 200;

    const hello String = "hello";
    `)
  };
};

const test = new GarbageTests();

test.testOne();
