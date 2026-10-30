const db = require("./db");

// Fetch all orders for a customer.
async function ordersForCustomer(customerId) {
  const parsedCustomerId = Number(customerId);

  if (!Number.isInteger(parsedCustomerId)) {
    throw new TypeError("customerId must be an integer");
  }

  return db.query("SELECT * FROM orders WHERE customer_id = ?", [parsedCustomerId]);
}

// Apply a percentage discount to a price.
function applyDiscount(price, percent) {
  const discountRate = percent / 100;
  return price - price * discountRate;
}

// Sum quantities across order lines.
function totalQuantity(lines) {
  return lines.reduce((sum, line) => {
    const quantity = Number(line?.qty);
    return Number.isFinite(quantity) ? sum + quantity : sum;
  }, 0);
}

module.exports = { ordersForCustomer, applyDiscount, totalQuantity };
