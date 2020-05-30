/**
 * @classdesc
 * This is a Dtdt class. It's a "S"tate "M"achine "T"est "C"ase generator inspired by https://note.com/yumotsuyo/n/nd3099b40dc1f
 * Overall flow is the following
 * - setContents(contents)
 * - initialize()
 *
 */
class Dtdt {
  /**
   * @constructor
   * @desc
   * this._clean()
   */
  constructor(yaml){
    this._clean();
    this.yaml = yaml || require('yaml');
  }
  /**
   * store content from arguments
   * @param {string} contents Target Contents
   * @returns {Dtdt} this This object
   * @desc
   * fill this.contents from outside of this instance
   */
  setContents(contents){
    this.contents = contents;
    return this;
  }
  /**
   * initialize all parameters
   * @public
   * @returns {Dtdt} this This object
   * @desc
   * In this method, it aims to fill the following parameters
   * - this.tree
   * - this.combinations
   */
  initialize(){
    this._clean();
    this.tree = this.yaml.parse(this.contents);
    //validation
    if(typeof this.tree !== "object"){
      throw new Error("this.tree should be {}");
    }
    this._parseTree(this.tree);
    this.combinations.forEach((combination) => {
      const column = new Array();
      this.conditions.forEach((condition,i) => {
        if(combination.conditions[i]){
          column.push(combination.conditions[i]);
        }else{
          column.push("-");
        }
      });
      this.actions.forEach((action) => {
        if(combination.action === action){
          column.push("x");
        }else{
          column.push("-");
        }
      });
      this.matrix.push(column);
    });
    return this;
  }
  /**
   * print decision table
   * @public
   * @desc
   * In this method, it aims to print the following parameters
   * - this.combinations
   */
  printTable(){
    if(this.matrix.length < 1){
      return;
    }
    const key = this.conditions.concat(this.actions);
    const maxY = this.matrix[0].length;
    const maxX = this.matrix.length;
    const matrix = new Array();
    const header = new Array();
    header.push("");
    for(let n = 1 ; n <= maxX ; n ++){
      header.push(n);
    }
    matrix.push(`|${header.join("|")}|`);
    matrix.push(`|${header.map(()=>"").join(":--|")}:--|`);
    for(let y = 0 ; y < maxY ; y ++){
      const row = new Array();
      row.push(key[y]);
      for(let x = 0 ; x < maxX ; x ++){
        row.push(this.matrix[x][y]);
      }
      matrix.push(`|${row.join("|")}|`);
    }
    console.log(matrix.join("\n"));
  }
  /**
   * PRIVATE:clean up all parameters
   */
  _clean(){
    this.tree = new Array();
    this.conditions = new Array();
    this.actions = new Array();
    this.combinations = new Array();
    this.matrix = new Array();
  }
  /**
   * PRIVATE:parse this.tree
   */
  _parseTree(tree, depth, history){
    depth = depth || 0;
    history = history || [];
    //leaf
    if(typeof tree !== "object"){
      if(depth % 2 !== 0){
        throw new Error("leaf'depth should be even");
      }
      if(this.actions.indexOf(tree) === -1){
        this.actions.push(tree);
      }
      this.combinations.push({conditions:history,action:tree})
      return;
    }
    //node
    if(depth % 2 === 0){
      if(Object.keys(tree).length !== 1){
        throw new Error("node should have only 1 key");
      }
      const key = Object.keys(tree)[0];
      if(this.conditions.indexOf(key) === -1){
        this.conditions.push(key);
      }
      this._parseTree(tree[key],depth + 1,history.slice());
      return;
    }
    Object.keys(tree).forEach((decision) => {
      const hist = history.slice();
      hist.push(decision);
      this._parseTree(tree[decision],depth + 1,hist);
    });
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = Dtdt;
} else {
  window.Dtdt = Dtdt;
}
