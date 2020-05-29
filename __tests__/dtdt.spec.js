const fs = require('fs');
const smcat = require("state-machine-cat");
const Smtc = require('../src/smtc');

describe('Smtc', () => {
  it(' constructor() : can create new instance', () => {
    const s = new Smtc(smcat);
    expect(s).not.toBeNull();
    expect(s).toBeInstanceOf(Smtc);
  });
  it(' setContents(file) : can read all strings from file', () => {
    const s = new Smtc();
    expect(s.setContents).toBeInstanceOf(Function);
    expect(s.setContents(fs.readFileSync('__tests__/testData.txt','utf8'))).toBeInstanceOf(Smtc);
    expect(s.contents).not.toBe("");
    // no such file or directory
    s.setContents("syntax error----");
    const t = () => {
      s.initialize();
    };
    expect(t).toThrow(/Expected/);
  });
  it(' initialize() : can initialize from this.contents', () => {
    const s = new Smtc(smcat);
    s.setContents(fs.readFileSync('__tests__/testData.txt','utf8'));
    expect(s.initialize).toBeInstanceOf(Function);
    expect(s.initialize()).toBeInstanceOf(Smtc);
    expect(s.events).toStrictEqual([
      '[None]'                ,// 0
      'reserve'               ,// 1
      'approve'               ,// 2
      'cancel approval'       ,// 3
      'reject'                ,// 4
      'cancel of reservation' ,// 5
      'cancel'                ,// 6
      'car delivered'          // 7
    ]);
    expect(s.states).toStrictEqual([
      'initial',
      'Accepting reservations',
      'Reservation accepted',
      'Reserved',
      'final'
    ]);
    expect(s.transitions).toStrictEqual([
      [1,0,0,0,0,0,0,0],
      [0,2,0,0,0,0,0,0],
      [0,0,3,0,1,1,0,0],
      [0,0,0,2,0,0,1,4],
      [0,0,0,0,0,0,0,0]
    ]);
    expect(s.matrix).toStrictEqual([
      //init   //Acpt  //Rsv  //Rsd  //fin
      [ [   ], [0   ], [   ], [   ], [   ] ], //initial,
      [ [   ], [    ], [ 1 ], [   ], [   ] ], //Accepting reservations
      [ [   ], [4, 5], [   ], [ 2 ], [   ] ], //Reservation accepted
      [ [   ], [6   ], [ 3 ], [   ], [ 7 ] ], //Reserved
      [ [   ], [    ], [   ], [   ], [   ] ]  //final
    ]);
    //test for testData.nested.txt
    s.setContents(fs.readFileSync('__tests__/testData.nest.txt','utf8'));
    s.initialize();
    expect(s.events.length).toBe(19);
    expect(s.events).toStrictEqual([
      "[None]",
      "fill(water:number)",
      "close()",
      "plugIn()",
      "open()",
      "plugIn()",
      "dispense(sec:number)",
      "open()",
      "_water>=10",
      "plugOff()",
      "fill(water:number)",
      "close()",
      "plugOff()",
      "open()",
      "plugOff()",
      "_temperature>=100",
      "dispense(sec:number)",
      "reboil()",
      "_water<10"
    ]);
    expect(s.states.length).toBe(9);
    expect(s.states).toStrictEqual([
      "initial",
      "off",
      "open/off",
      "idle",
      "open/on",
      "boil",
      "keep",
      "active",
      "on"
    ]);
    expect(s.transitions.length).toBe(9);
    expect(s.transitions).toStrictEqual([
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,2,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,3,4,5,1,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,4,3,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,5,3],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]);
    expect(s.matrix.length).toBe(9);
    expect(s.matrix).toStrictEqual([
      [[],[0 ],[  ],[  ],[  ],[  ],[  ],[],[]],
      [[],[  ],[4 ],[5 ],[  ],[  ],[  ],[],[]],
      [[],[2 ],[1 ],[  ],[3 ],[  ],[  ],[],[]],
      [[],[9 ],[  ],[6 ],[7 ],[8 ],[  ],[],[]],
      [[],[  ],[12],[11],[10],[  ],[  ],[],[]],
      [[],[  ],[  ],[  ],[  ],[  ],[15],[],[]],
      [[],[  ],[  ],[18],[  ],[17],[16],[],[]],
      [[],[14],[  ],[  ],[13],[  ],[  ],[],[]],
      [[],[  ],[  ],[  ],[  ],[  ],[  ],[],[]]
    ]);
  });
  it(' nSwitchCoverage() : can calculate 1 step coverage', () => {
    const s = new Smtc();
    s.setContents(fs.readFileSync('__tests__/testData.txt','utf8'))
      .initialize();
    expect(s.nSwitchCoverage).toBeInstanceOf(Function);
    const oneSwitch = s.nSwitchCoverage(1);
    expect(oneSwitch).toStrictEqual([
      [[],[           ],[[0,1]            ],[     ],[     ]],
      [[],[[1,4],[1,5]],[                 ],[[1,2]],[     ]],
      [[],[[2,6]      ],[[4,1],[5,1],[2,3]],[     ],[[2,7]]],
      [[],[[3,4],[3,5]],[[6,1]            ],[[3,2]],[     ]],
      [[],[           ],[                 ],[     ],[     ]]
    ]);
  });
  it(' printXXX() : can print all methods', () => {
    let s = new Smtc(smcat);
    s.setContents(fs.readFileSync('__tests__/testData.txt','utf8'))
      .initialize();

    expect(s.printDiagram).toBeInstanceOf(Function);
    expect(s.printTransitions).toBeInstanceOf(Function);
    expect(s.printNSwitch).toBeInstanceOf(Function);
    expect(s.printNSwitchMatrix).toBeInstanceOf(Function);

    //backup console.log
    let output = new Array();
    const log = console.log;
    console.log = function(line){
      output.push(line);
    };

    //trasition
    s.printTransitions();
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.txt.transition','utf8').trim());

    //zero switch
    let zeroSwitch = s.nSwitchCoverage(0);
    output = new Array();
    s.printNSwitch(zeroSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.txt.0case','utf8').trim());
    output = new Array();
    s.printNSwitch();
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.txt.0case','utf8').trim());
    output = new Array();
    s.printNSwitchMatrix(zeroSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.txt.0matrix','utf8').trim());
    output = new Array();
    s.printNSwitchMatrix();
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.txt.0matrix','utf8').trim());

    //one switch
    let oneSwitch = s.nSwitchCoverage(1);
    output = new Array();
    s.printNSwitch(oneSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.txt.1case','utf8').trim());
    output = new Array();
    s.printNSwitchMatrix(oneSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.txt.1matrix','utf8').trim());

    s = new Smtc();
    s.setContents(fs.readFileSync('__tests__/testData.nest.txt','utf8'))
      .initialize();

    //trasition
    output = new Array();
    s.printTransitions();
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.nest.txt.transition','utf8').trim());

    //zero switch
    zeroSwitch = s.nSwitchCoverage(0);
    output = new Array();
    s.printNSwitch(zeroSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.nest.txt.0case','utf8').trim());
    output = new Array();
    s.printNSwitch();
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.nest.txt.0case','utf8').trim());
    output = new Array();
    s.printNSwitchMatrix(zeroSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.nest.txt.0matrix','utf8').trim());
    output = new Array();
    s.printNSwitchMatrix();
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.nest.txt.0matrix','utf8').trim());

    //one switch
    oneSwitch = s.nSwitchCoverage(1);
    output = new Array();
    s.printNSwitch(oneSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.nest.txt.1case','utf8').trim());
    output = new Array();
    s.printNSwitchMatrix(oneSwitch);
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.nest.txt.1matrix','utf8').trim());

    //restore console.log
    console.log = log;
  });
  it(' _clean() : can clean all parameters', () => {
    const s = new Smtc(smcat);
    expect(s.json).toBe("");
    expect(s.events.length).toBe(0);
    expect(s.states.length).toBe(0);
    expect(s.transitions.length).toBe(0);
    expect(s.matrix.length).toBe(0);
    s.setContents(fs.readFileSync('__tests__/testData.txt','utf8'))
      .initialize();
    s._clean();
    expect(s.json).toBe("");
    expect(s.events.length).toBe(0);
    expect(s.states.length).toBe(0);
    expect(s.transitions.length).toBe(0);
    expect(s.matrix.length).toBe(0);
  });
});
