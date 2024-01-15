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
    `);
  };

  public testTwo() {
    this.execute(`
      func helloWorld (param String, param2 String) {
        const hi String = "greeting!";
        let x Int = 0;
        x = 10 * 5 - 3;
      };

      func greeting (param Int, param2 String) {
        const hi Int = 0;

        call println(param2);
      };

      let x Int = 300;

      call greeting(x, "hello world");

      const newX String = "myNumberHEllo";
      call println(newX);

      for (let i Int = 0; i < 5; ++i;) {

        if (i > 3) {
          call println("i greater than 3!");
        } else {
          call println("i is NOT greater than 3!"); 
        };
      };

      let expr Float = 10 * 5 + 3 - 1 / 9;

      call println(expr);
    `)
  };
};

const test = new GarbageTests();

test.testTwo();
