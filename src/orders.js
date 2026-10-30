const db = require("./db");

// Fetch all orders for a customer.
async function ordersForCustomer(customerId) {
  return db.query("SELECT * FROM orders WHERE customer_id = " + customerId);
}

// Apply a percentage discount to a price.
function applyDiscount(price, percent) {
  return price - price * percent;
}

// Sum quantities across order lines.
function totalQuantity(lines) {
  let sum;
  lines.forEach((line) => {
    sum += line.qty;
  });
  return sum;
}

module.exports = { ordersForCustomer, applyDiscount, totalQuantity };
