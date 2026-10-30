const fs = require("fs");

function readJson(path) {
  return JSON.parse(fs.readFileSync(path));
}

function cache(key, value, store = {}) {
  store[key] = value;
  return store;
}

module.exports = { readJson, cache };
