const fs = require('fs');
const yaml = require("yaml");
const Dtdt = require('../src/dtdt');

describe('Dtdt', () => {
  it(' constructor() : can create new instance', () => {
    const s = new Dtdt(yaml);
    expect(s).not.toBeNull();
    expect(s).toBeInstanceOf(Dtdt);
  });
  it(' setContents(contents) : can read all strings from file', () => {
    const s = new Dtdt();
    expect(s.setContents).toBeInstanceOf(Function);
    expect(s.setContents(fs.readFileSync('__tests__/testData.yml','utf8'))).toBeInstanceOf(Dtdt);
    expect(s.contents).not.toBe("");
  });
  it(' initialize() : can initialize from this.contents', () => {
    const s = new Dtdt(yaml);
    s.setContents(fs.readFileSync('__tests__/testData.yml','utf8'));
    expect(s.initialize).toBeInstanceOf(Function);
    expect(s.initialize()).toBeInstanceOf(Dtdt);
  });
  it(' _clean() : can clean all parameters', () => {
    const s = new Dtdt(yaml);
    expect(s.tree.length).toBe(0);
    expect(s.table.length).toBe(0);
    s.setContents(fs.readFileSync('__tests__/testData.yml','utf8'))
      .initialize();
    s._clean();
    expect(s.tree.length).toBe(0);
    expect(s.table.length).toBe(0);
  });
});
