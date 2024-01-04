import GarbageLexer from "./frontend/lexer/lexer";
import GarbageParser from "./frontend/parser";
import readGarbageFiles from "./frontend/reader";
import fs from "node:fs";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function repl () {
  console.log("GarbageLang REPL v1.0")
  const lexer = new GarbageLexer()
  const parser = new GarbageParser()

  const recall = () => {
    rl.question("> ", (userInput) => {
      if (userInput === "exit") {
        process.exit(0);
      };

      lexer.setData = userInput || "";
      const tokens = lexer.getTokens();
      parser.setTokens = tokens;
      const tree = parser.generateAST();
      fs.writeFile("tree.json", JSON.stringify(tree, null, 2), "utf-8", (err) => {
        if (err) console.error(err)
      });
      recall();
    });
  };

  recall()
};

repl()
