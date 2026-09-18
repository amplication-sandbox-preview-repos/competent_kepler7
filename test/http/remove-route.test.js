import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { handler } from "../../src/server.js";
import { addItem, reset } from "../../src/inventory.js";

beforeEach(() => reset());

function makeReq({ method = "POST", url = "/", body, headers = {} }) {
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  return {
    method,
    url,
    headers: { host: "localhost", ...headers },
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk;
    },
  };
}

function makeRes() {
  return {
    status: null,
    headers: null,
    body: null,
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    end(payload) {
      this.body = payload;
    },
  };
}

test("POST /items/:sku/remove returns 400 for invalid quantity payload", async () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });

  const req = makeReq({ method: "POST", url: "/items/A1/remove", body: { quantity: 0 } });
  const res = makeRes();

  handler(req, res);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(res.status, 400);
  assert.deepEqual(JSON.parse(res.body), { error: "bad request" });
});

test("POST /items/:sku/remove returns 409 for insufficient stock with valid quantity", async () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });

  const req = makeReq({ method: "POST", url: "/items/A1/remove", body: { quantity: 10 } });
  const res = makeRes();

  handler(req, res);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(res.status, 409);
  assert.deepEqual(JSON.parse(res.body), { error: "insufficient stock" });
});
