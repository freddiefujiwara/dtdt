const fs = require('fs');
const yaml = require("yaml");
const Dtdt = require('../src/dtdt');

describe('Dtdt', () => {
  it(' constructor() : can create new instance', () => {
    const d = new Dtdt(yaml);
    expect(d).not.toBeNull();
    expect(d).toBeInstanceOf(Dtdt);
  });
  it(' setContents(contents) : can read all strings from contents', () => {
    const d = new Dtdt();
    expect(d.setContents).toBeInstanceOf(Function);
    expect(d.setContents(fs.readFileSync('__tests__/testData.yml','utf8'))).toBeInstanceOf(Dtdt);
    expect(d.contents).not.toBe("");
    // no such file or directory
    d.setContents("*syntax error*");
    const t = () => {
      d.initialize();
    };
    expect(t).toThrow(/syntax/);
  });
  it(' initialize() : can initialize from thid.contents', () => {
    const d = new Dtdt(yaml);
    d.setContents(fs.readFileSync('__tests__/testData.yml','utf8'));
    expect(d.initialize).toBeInstanceOf(Function);
    expect(d.initialize()).toBeInstanceOf(Dtdt);
    expect(d.tree).toStrictEqual({
      "7+ items?": {
        "y": {
          "buy shirts?": {
            "y": {
              "buy ties?": {
                "y": "12%",
                "n": "7%"
              }
            },
            "n": "7%"
          }
        },
        "n": {
          "buy shirts?": {
            "y": {
              "buy ties?": {
                "y": "5%",
                "n": "0%"
              }
            },
            "n": "0%"
          }
        }
      }
    });
  });
  it(' printTable() : can print decision table from thid.combinations', () => {
    const d = new Dtdt(yaml);
    d.setContents(fs.readFileSync('__tests__/testData.yml','utf8'));
    expect(d.printTable).toBeInstanceOf(Function);
    d.initialize();
    let output = new Array();
    const log = console.log;
    console.log = function(line){
      output.push(line);
    };

    //trasition
    d.printTable();
    expect(output.join("\n")).toBe(fs.readFileSync('__tests__/testData.yml.result','utf8').trim());
    console.log = log;
  });
  it(' _clean() : can clean all parameters', () => {
    const d = new Dtdt(yaml);
    expect(d._clean).toBeInstanceOf(Function);
    expect(d.tree.length).toBe(0);
    expect(d.conditions.length).toBe(0);
    expect(d.actions.length).toBe(0);
    expect(d.combinations.length).toBe(0);
    expect(d.matrix.length).toBe(0);
    d.setContents(fs.readFileSync('__tests__/testData.yml','utf8'))
      .initialize();
    d._clean();
    expect(d.tree.length).toBe(0);
    expect(d.conditions.length).toBe(0);
    expect(d.actions.length).toBe(0);
    expect(d.combinations.length).toBe(0);
    expect(d.matrix.length).toBe(0);
  });
  it(' _parseTree() : can parse this.tree', () => {
    const d = new Dtdt(yaml);
    expect(d._parseTree).toBeInstanceOf(Function);
    d.setContents(fs.readFileSync('__tests__/testData.yml','utf8'))
      .initialize();
    expect(d.matrix).toStrictEqual([
      ["y", "y", "y", "x", "-", "-", "-"],
      ["y", "y", "n", "-", "x", "-", "-"],
      ["y", "n", "-", "-", "x", "-", "-"],
      ["n", "y", "y", "-", "-", "x", "-"],
      ["n", "y", "n", "-", "-", "-", "x"],
      ["n", "n", "-", "-", "-", "-", "x"]
    ]);
  });
});
