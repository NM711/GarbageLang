import readline from "node:readline";
import fs from "node:fs";
import GarbageLexer from "./frontend/lexer";
import GarbageParser from "./frontend/parser/parser";
import GarbageTreeWalker from "./runtime/walker";
import type { ReadLine } from "node:readline";

class GarbageREPL {
  private rl: ReadLine
  private lexer: GarbageLexer;
  private parser: GarbageParser;
  private walker: GarbageTreeWalker;

  constructor () {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.lexer = new GarbageLexer();
    this.parser = new GarbageParser();
    this.walker = new GarbageTreeWalker();
  };

  private recall () {
    this.rl.question("> ", (userInput) => {
      if (userInput === "exit") {
        this.rl.close();
      };

      this.lexer.setData = userInput || "";
      const tokens = this.lexer.getTokens();

      // console.log(tokens);
      this.parser.setTokens = tokens;
      const tree = this.parser.generateAST();

      fs.writeFile("tree.json", JSON.stringify(tree, null, 2), "utf-8", (err) => {
        if (err) console.error(err)
      });

      return this.recall();
    });
  };

  public run () {
    console.log("GarbageLang REPL v1.0");
    return this.recall();
  };
};


const repl = new GarbageREPL();

repl.run();
