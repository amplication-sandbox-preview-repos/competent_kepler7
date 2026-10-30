function retry(fn, times) {
  for (let i = 0; i < times; i++) {
    try {
      return fn();
    } catch (e) {}
  }
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

module.exports = { retry, sleep };
