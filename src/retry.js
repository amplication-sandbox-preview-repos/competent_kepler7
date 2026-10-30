async function retry(fn, times) {
  let lastError;

  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

module.exports = { retry, sleep };
