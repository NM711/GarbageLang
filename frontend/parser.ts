// consider renaming to GrammarTypes instead, since its no longer lexer specific
import LexerGrammarTypes from "../types/lexer.grammar.types";
import { callSyntaxError } from "./errors/syntax";
import { TreeNode } from "./ast";
import type LexerTokenTypes from "../types/lexer.tokens";

class GarbageParser {
  private root: TreeNode;

  constructor () {
    this.root = new TreeNode();
  };

  private parseIfCondition () {

  };

  public parse (tokens: LexerTokenTypes.Token[]) {
    for (let i = 0; i <= tokens.length; i++) {

      const currentToken: LexerTokenTypes.Token = tokens[i];
      const prevToken: LexerTokenTypes.Token = tokens[i - 1];
      const nextToken: LexerTokenTypes.Token = tokens[i + 1];

      // Context-Free Grammar:
      // Example:
      // Terminal: if;
      // | = with
      // p1 = (
      // p2 = )
      // expr = boolean expression
      // end = ;
      // if -> p1|expr|p2|end
      //
      // If the grammar above is not fufilled, throw syntax error.

      switch (currentToken.id) {
        case LexerGrammarTypes.LangTokenIdentifier.IF: {
          

          continue;
        };

        case LexerGrammarTypes.LangTokenIdentifier.FUNCTION: {

          continue;
        };

        case LexerGrammarTypes.LangTokenIdentifier.VARIABLE:
        case LexerGrammarTypes.LangTokenIdentifier.CONSTANT: {
        
          continue;
        };
      };
    };
  };

  public getTree (): Tree {
    return this.root;
  };
};

export default GarbageParser;
