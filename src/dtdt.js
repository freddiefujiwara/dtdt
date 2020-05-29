/**
 * @classdesc
 * This is a Smtc class. It's a "S"tate "M"achine "T"est "C"ase generator inspired by https://note.com/yumotsuyo/n/nd3099b40dc1f
 * Overall flow is the following
 * - setContents(file)
 * - initialize()
 *  - _flattenStates()
 * - nSwitchCoverage(switch)
 * - printTransitions();
 * - printNSwitch(nSwitchCoverage);
 * - printNSwitchMatrix(nSwitchCoverage);
 * - printDiagram();
 *
 */
class Smtc {
  /**
   * @constructor
   * @param {state-machine-cat} smcat this is for webapp
   * @desc
   * this._clean()
   */
  constructor(smcat){
    this.smcat = smcat || require('state-machine-cat');
    this._clean();
  }
  /**
   * store content from arguments
   * @param {string} contents Target Contents
   * @returns {Smtc} this This object
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
   * @returns {Smtc} this This object
   * @desc
   * In this method, it aims to fill the following parameters
   * - this.states
   * - this.events
   * - this.transitions
   * - this.matrix
   */
  initialize(){
    this._clean();
    this.json = this.smcat.render(this.contents,{outputType: "json"});
    this.states = this._flattenStates(this.json.states).map((s) => s.name);
    this.json.transitions.forEach((t)=> {
      this.events.push(t.event || "[None]");
    });
    //initialize this.transitions
    this.states.forEach(() => {
      const row = new Array();
      this.events.forEach(() => {
        row.push(0);
      });
      this.transitions.push(row);
    })
    //initialize this.matrix
    this.states.forEach(() => {
      const row = new Array();
      this.states.forEach(() => {
        row.push(new Array());
      });
      this.matrix.push(row);
    })
    this.json.transitions.forEach((t,i)=> {
      const event = t.event || "[None]";
      this.transitions[this.states.indexOf(t.from)][i]
        = this.states.indexOf(t.to);
      this.matrix[this.states.indexOf(t.from)][this.states.indexOf(t.to)]
        .push(i);
    });
    return this;
  }
  /**
   * calculate n switch coverage
   * @public
   * @params  {Array} matrix
   * @returns {Array} nSwitch culculated coverage
   * @desc
   * nSwitchCoverage = this.matrix x (n-1)SwitchCoverage
   */
  nSwitchCoverage(n,mat){
    n = n || 0;
    if(n < 1){
      return this.matrix;
    }
    const matrix = this.nSwitchCoverage(n-1,mat || this.matrix);
    const nSwitch = new Array();
    // this.matrix * this.matrix
    this.matrix.forEach((v,y) => {
      nSwitch.push(new Array());
      v.forEach((h,x) => {
        nSwitch[y].push(new Array());
        v.forEach((h2,x2) => {
          // push events if the path exists
          if(this.matrix[y][x2].length > 0 && matrix[x2][x].length > 0){
            const events = new Array();
            this.matrix[y][x2].forEach((e1)=>{
              matrix[x2][x].forEach((e2)=>{
                events.push([e1,e2].flat());
              });
            });
            events.forEach((e) => {
              nSwitch[y][x].push(e);
            });
          }
        });
      });
    })
    return nSwitch;
  }
  /**
   * print diagram
   * @public
   */
  printDiagram(){
    console.log(this.smcat.render(this.contents,{outputType: "svg"}));
  }
  /**
   * print transitions
   * @public
   */
  printTransitions(){
    console.log(`||${this.events.join("|")}|`);
    console.log(`|:--|${this.events.map(()=>":--").join("|")}|`);
    this.transitions.forEach((states,y) => {
      console.log(`|**${this.states[y]}**|${states.map((s) => s > 0 ? this.states[s] : "").join("|")}|`);
    });
  }
  /**
   * print n switch cases
   * @param {Array} nSwitchCoverage n switch coverage (default: this.matrix)
   * @public
   */
  printNSwitch(nSwitchCoverage){
    nSwitchCoverage = nSwitchCoverage || this.matrix;
    let swit = 0; // n + 1 switch Coverage
    let no = 0;   // test case number

    const data = new Array();
    this.states.forEach((from,y) => {
      this.states.forEach((to,x) => {
        if(nSwitchCoverage[y][x].length > 0){
          nSwitchCoverage[y][x].forEach((path) => {
            let tr = ""; // transition
            //N switch
            if(typeof path === "object"){
              // path.length  should be "n+1" switch coverage
              // ex [1,2,3,4] = 3 switch coverage
              // ex [1,2] = 1 switch coverage
              let prevState = y;
              // print transition
              // ex) event1|state2|event2|state3 ....
              tr = path.map((p) => {
                const ret = new Array();
                ret.push(this.events[p]);
                ret.push(this.states[this.transitions[prevState][p]]);
                prevState = this.transitions[prevState][p];
                return ret.join("|");
              }).join("|");
              swit = path.length;
            }else{
              //Zero switch
              tr = `${this.events[path]}|${to}`;
              swit = 1;
            }
            data.push(`|${no}|${from}|${tr}|`);
            no++;
          });
        }
      });
    });
    //create headers
    const header = new Array();
    header.push("#");
    let i = 1;
    for(;i <= swit ; i ++){
      header.push(`State#${i}`);
      header.push(`Event#${i}`);
    }
    header.push(`State#${i}`);
    const header2 = new Array();
    header.forEach(() => { header2.push(":--") })

    console.log(`|${header.join("|")}|`);
    console.log(`|${header2.join("|")}|`);
    console.log(data.join("\n"));
  }
  /**
   * print n switch matrix
   * @param {Array} nSwitchCoverage one switch coverage
   * @public
   */
  printNSwitchMatrix(nSwitchCoverage){
    nSwitchCoverage = nSwitchCoverage || this.matrix;
    console.log(`||${this.states.join("|")}|`);
    console.log(`|:--|${this.states.map(()=>":--").join("|")}|`);
    nSwitchCoverage.forEach((row,y)=>{
      console.log(`|**${this.states[y]}**|${row.map((r) => {
        if(r.length < 1) {
          return "";
        }
        if(typeof r[0] === "object"){
          return r.map((p) => p.map((n) => this.events[n]).join(" -> ")).join(",");
        }
        return r.map((n) => this.events[n]).join(",");
      }).join("|")}|`);
    });
  }
  /**
   * PRIVATE:clean up all parameters
   */
  _clean(){
    this.json = "";
    this.states = new Array();
    this.events = new Array();
    this.transitions = new Array();
    this.matrix = new Array();
  }
  /**
   * flatten states
   * @public
   * @returns {Array} states flatten the state and fill in this.json.transitions as needed.
   * @desc
   * sometimes the states are nested, so we detect all nested and non-nested states.
   */
  _flattenStates(states){
    const ret = new Array();
    states.forEach((state) => {
      if(state.statemachine){
        if(state.statemachine.states){
          this._flattenStates(state.statemachine.states).forEach((s) => {
            ret.push(s);
          });
        }
        if(state.statemachine.transitions){
          state.statemachine.transitions.forEach((t)=> {
            this.json.transitions.push(t);
          });
        }
      }
      ret.push(state);
    });
    return ret;
  }
}
//
// for old platform because flat is implemented for node > v11 , Chrome > v69, Opera > 56
// The code was taken from https://stackoverflow.com/questions/50993498/flat-is-not-a-function-whats-wrong
// by Ivan https://stackoverflow.com/users/6331369/ivan
//
Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
  }
});

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = Smtc;
} else {
  window.Smtc = Smtc;
}
