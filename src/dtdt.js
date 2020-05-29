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
   * - this.states
   * - this.events
   * - this.transitions
   * - this.matrix
   */
  initialize(){
    this._clean();
    return this;
  }
  /**
   * PRIVATE:clean up all parameters
   */
  _clean(){
    this.json = "";
    this.tree = new Array();
    this.table = new Array();
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = Dtdt;
} else {
  window.Dtdt = Dtdt;
}
