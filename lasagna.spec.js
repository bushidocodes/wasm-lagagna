import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
const initWabt = require("wabt");

let wasmInstance;

const initWasm = async (done) => {
  const wabt = await initWabt();
  const watPath = resolve(__dirname, 'lasagna.wat');
  const wasmPath = resolve(__dirname, 'lasagna.wasm');
  const {buffer} = wabt.parseWat(watPath, readFileSync(watPath, "utf8")).toBinary({log: true, write_debug_names: true});
  writeFileSync(wasmPath, new Buffer(buffer));
  const wasmBuffer = readFileSync(wasmPath);
  const results = await WebAssembly.instantiate(wasmBuffer, {
    env: {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({ initial: 1024 }),
      table: new WebAssembly.Table({ initial: 16, element: 'anyfunc' }),
      abort: console.log
    }
  });
  wasmInstance = results.instance.exports;
  done();
}

describe('EXPECTED_MINUTES_IN_OVEN', () => {
  
  beforeEach(initWasm);
  
  test('constant is defined correctly', () => {
    expect(wasmInstance.EXPECTED_MINUTES_IN_OVEN.value).toBe(40);
  });
});

describe('remainingMinutesInOven', () => {
  
  beforeEach(initWasm);

  test('calculates the remaining time', () => {
    expect(wasmInstance.remainingMinutesInOven(25)).toBe(15);
    expect(wasmInstance.remainingMinutesInOven(5)).toBe(35);
    expect(wasmInstance.remainingMinutesInOven(39)).toBe(1);
  });

  test('works correctly for the edge cases', () => {
    expect(wasmInstance.remainingMinutesInOven(40)).toBe(0);
    expect(wasmInstance.remainingMinutesInOven(0)).toBe(40);
  });
});

describe('preparationTimeInMinutes', () => {

  beforeEach(initWasm);
  
  test('calculates the preparation time', () => {
    expect(wasmInstance.preparationTimeInMinutes(1)).toBe(2);
    expect(wasmInstance.preparationTimeInMinutes(2)).toBe(4);
    expect(wasmInstance.preparationTimeInMinutes(8)).toBe(16);
  });
});

describe('totalTimeInMinutes', () => {
  
  beforeEach(initWasm);

  test('calculates the total cooking time', () => {
    expect(wasmInstance.totalTimeInMinutes(1, 5)).toBe(7);
    expect(wasmInstance.totalTimeInMinutes(4, 15)).toBe(23);
    expect(wasmInstance.totalTimeInMinutes(1, 35)).toBe(37);
  });
});
