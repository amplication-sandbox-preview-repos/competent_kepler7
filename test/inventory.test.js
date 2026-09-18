import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { addItem, getItem, removeStock, reset, totalValue } from "../src/inventory.js";

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

test("totalValue sums quantity times price", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });
  addItem({ sku: "B2", name: "Gadget", quantity: 1, priceCents: 1000 });
  assert.equal(totalValue(), 1750);
});

test("failed over-removal keeps quantity unchanged and total value non-negative", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });

  assert.throws(() => removeStock("A1", 10), {
    code: "INSUFFICIENT_STOCK",
  });

  assert.equal(getItem("A1").quantity, 3);
  assert.equal(totalValue(), 750);
  assert.ok(totalValue() >= 0);
});

test("removeStock rejects invalid quantity payloads", () => {
  addItem({ sku: "A1", name: "Widget", quantity: 3, priceCents: 250 });

  for (const invalidQuantity of [0, -1, NaN, Infinity, "2", null, undefined]) {
    assert.throws(() => removeStock("A1", invalidQuantity), {
      code: "INVALID_QUANTITY",
    });
  }

  assert.equal(getItem("A1").quantity, 3);
});
