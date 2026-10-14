const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const widgetPath = path.join(__dirname, '..', 'litro-chat.js');
const widgetSource = fs.readFileSync(widgetPath, 'utf8');

function extractFunction(source, name) {
  const marker = `function ${name}() {`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${name} must exist in litro-chat.js`);

  const openBrace = source.indexOf('{', start);
  let depth = 0;
  for (let index = openBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  assert.fail(`Could not find the end of ${name}`);
}

test('new page sessions get fresh IDs and do not read the old localStorage ID', () => {
  let nextUuid = 0;
  const window = {
    crypto: { randomUUID: () => `uuid-${++nextUuid}` },
    localStorage: {
      getItem() {
        assert.fail('session IDs must not be restored from persistent localStorage');
      },
    },
  };
  const createSessionId = vm.runInNewContext(`(${extractFunction(widgetSource, 'newSessionId')})`, { window });

  assert.equal(createSessionId(), 'web-uuid-1');
  assert.equal(createSessionId(), 'web-uuid-2');
  assert.equal(nextUuid, 2);
});

test('secure-random fallback produces a 128-bit hexadecimal session suffix', () => {
  const window = {
    Uint8Array,
    crypto: {
      getRandomValues(bytes) {
        for (let index = 0; index < bytes.length; index += 1) bytes[index] = index;
        return bytes;
      },
    },
  };
  const createSessionId = vm.runInNewContext(`(${extractFunction(widgetSource, 'newSessionId')})`, { window });

  assert.equal(createSessionId(), 'web-000102030405060708090a0b0c0d0e0f');
});

test('widget creates one ID on load, reuses it for messages, and resets through the same generator', () => {
  assert.match(widgetSource, /var id = newSessionId\(\);/);
  assert.match(widgetSource, /sessionId: id/);
  assert.match(widgetSource, /function reset\(\) \{ id = newSessionId\(\);/);
  assert.doesNotMatch(widgetSource, /localStorage\.getItem\(["']litro_sid["']\)/);
  assert.doesNotMatch(widgetSource, /localStorage\.setItem\(["']litro_sid["']/);
});
