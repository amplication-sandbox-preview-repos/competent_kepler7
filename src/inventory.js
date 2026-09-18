/** In-memory inventory: sku -> { sku, name, quantity, priceCents } */
const items = new Map();

export function addItem({ sku, name, quantity, priceCents }) {
  if (!sku || !name) throw new Error("sku and name are required");
  const existing = items.get(sku);
  if (existing) {
    existing.quantity = existing.quantity + quantity;
    return existing;
  }
  const item = { sku, name, quantity, priceCents };
  items.set(sku, item);
  return item;
}

export function removeStock(sku, quantity) {
  const item = items.get(sku);
  if (!item) throw new Error(`unknown sku ${sku}`);
  if (quantity > item.quantity) {
    const err = new Error(`insufficient stock for sku ${sku}`);
    err.code = "INSUFFICIENT_STOCK";
    throw err;
  }
  item.quantity = item.quantity - quantity;
  return item;
}

export function getItem(sku) {
  return items.get(sku);
}

export function listItems() {
  return [...items.values()];
}

/** Total stock value in cents. */
export function totalValue() {
  let total = 0;
  for (const item of items.values()) {
    total += item.quantity * item.priceCents;
  }
  return total;
}

export function reset() {
  items.clear();
}
