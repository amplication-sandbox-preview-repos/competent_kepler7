const fs = require("fs");

function readJson(path) {
  try {
    const content = fs.readFileSync(path, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(`Failed to parse JSON file at ${path}: ${error.message}`);
    }

    throw error;
  }
}

function cache(key, value, store = {}) {
  store[key] = value;
  return store;
}

module.exports = { readJson, cache };
