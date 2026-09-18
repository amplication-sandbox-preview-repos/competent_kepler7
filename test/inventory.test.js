import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { addItem, getItem, removeStock, reset, totalValue } from "../src/inventory.js";
import { handler } from "../src/server.js";

beforeEach(() => reset());

test("addItem stores a new item", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });
  assert.equal(getItem("A1").quantity, 3);
});

test("addItem merges quantity for an existing sku", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });
  addItem({ sku: "A1", name: "Widget", quantity: 2, priceCents: 250 });
  assert.equal(getItem("A1").quantity, 5);
});

test("removeStock decrements quantity", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });
  removeStock("A1", 1);
  assert.equal(getItem("A1").quantity, 2);
});

test("removeStock rejects removing more stock than available without mutating quantity", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });

  let error;
  assert.throws(() => removeStock("A1", 10), (caughtError) => {
    error = caughtError;
    return true;
  });

  assert.equal(error.code, "INSUFFICIENT_STOCK");
  assert.equal(getItem("A1").quantity, 3);
  assert.equal(totalValue(), 750);
});

test("removeStock supports exact removal to zero", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });

  const item = removeStock("A1", 3);

  assert.equal(item.quantity, 0);
  assert.equal(getItem("A1").quantity, 0);
  assert.equal(totalValue(), 0);
});

test("removeStock preserves unknown sku error behavior", () => {
  let error;
  assert.throws(() => removeStock("MISSING", 1), (caughtError) => {
    error = caughtError;
    return true;
  });

  assert.equal(error.message, "unknown sku MISSING");
  assert.equal(error.code, undefined);
});

test("totalValue sums quantity times price", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });
  addItem({ sku: "B2", name: "Gadget", quantity: 1, priceCents: 1000 });
  assert.equal(totalValue(), 1750);
});

test("POST /items/:sku/remove returns 200 for a valid removal", async () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });
  const server = createServer(handler);

  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/items/A1/remove`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ quantity: 1 })
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      sku: "A1",
      name: "Widget",
      quantity: 2,
      priceCents: 250
    });
    assert.equal(getItem("A1").quantity, 2);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test("POST /items/:sku/remove returns 409 and preserves inventory state when removing too much stock", async () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });
  const server = createServer(handler);

  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const { port } = server.address();
    const removeResponse = await fetch(`http://127.0.0.1:${port}/items/A1/remove`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ quantity: 10 })
    });

    assert.equal(removeResponse.status, 409);
    assert.deepEqual(await removeResponse.json(), { error: "insufficient stock" });

    const itemResponse = await fetch(`http://127.0.0.1:${port}/items/A1`);
    assert.equal(itemResponse.status, 200);
    assert.deepEqual(await itemResponse.json(), {
      sku: "A1",
      name: "Widget",
      quantity: 3,
      priceCents: 250
    });

    const valueResponse = await fetch(`http://127.0.0.1:${port}/items/value`);
    assert.equal(valueResponse.status, 200);
    assert.deepEqual(await valueResponse.json(), { totalCents: 750 });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
