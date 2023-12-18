import GarbageLexer from "./frontend/lexer";
import readGarbageFiles from "./frontend/reader";

function main () {
  const fileData = readGarbageFiles("./hello.gb")
  const lexer = new GarbageLexer();

  lexer.tokenize(fileData);

  const tokens = lexer.getTokens();

  console.table(tokens);
};

main()
