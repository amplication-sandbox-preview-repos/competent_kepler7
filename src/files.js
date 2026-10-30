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

function cache(key, value, store = Object.create(null)) {
  const baseStore = store ?? Object.create(null);
  return {
    ...baseStore,
    [key]: value,
  };
}

module.exports = { readJson, cache };
