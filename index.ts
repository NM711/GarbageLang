import GarbageLexer from "./frontend/lexer/lexer";
import GarbageParser from "./frontend/parser";
import readGarbageFiles from "./frontend/reader";
import fs from "node:fs";

function main () {
  const fileData = readGarbageFiles("./hello.gb")
  const parser = new GarbageParser();
  const lexer = new GarbageLexer();
  lexer.setData = fileData;
  const tokens = lexer.getTokens();
  parser.setTokens = tokens;
  //console.log(tokens)
  const tree = parser.parse();

 // temporarily output a json file so i can see the structure of the tree
  fs.writeFile("tree.json", JSON.stringify(tree, null, 2), "utf-8", (err) => {
    if (err) console.error(err)
  })
};

main()
