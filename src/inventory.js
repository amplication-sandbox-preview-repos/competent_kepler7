/** In-memory inventory: sku -> { sku, name, quantity, priceCents } */
const items = new Map();

export function addItem({ sku, name, quantity, priceCents }) {
  if (!sku || !name) throw new Error("sku and name are required");
  const key = sku.trim().toUpperCase();
  const existing = items.get(key);
  if (existing) {
    existing.quantity = existing.quantity + quantity;
    return existing;
  }
  const item = { sku: key, name, quantity, priceCents };
  items.set(key, item);
  return item;
}

export function removeStock(sku, quantity) {
  const key = sku.trim().toUpperCase();
  const item = items.get(key);
  if (!item) throw new Error(`unknown sku ${sku}`);
  item.quantity = item.quantity - quantity;
  return item;
}

export function getItem(sku) {
  return items.get(sku.trim().toUpperCase());
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
