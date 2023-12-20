import GarbageLexer from "./frontend/lexer/lexer";
import GarbageParser from "./frontend/parser";
import readGarbageFiles from "./frontend/reader";

function main () {
  const fileData = readGarbageFiles("./hello.gb")
  const parser = new GarbageParser();
  const lexer = new GarbageLexer();

  lexer.tokenize(fileData);

  const tokens = lexer.getTokens();
  parser.setTokens = tokens;

  parser.parse();
};

main()
