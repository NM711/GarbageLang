// AST structure;


export class TreeNode {
  private head: NodeType | null;
  private value: string | null;
  private body: TreeNode[];

  constructor () {
    this.head = null;
    this.value = null;
    this.body = [];
  };

  public setHead(name: string) {
    this.head = name;
  };

  public setBody(node: TreeNode) {
    this.body.push(node);
  };

  public setValue(v: string) {
    this.value = v;
  };
};
