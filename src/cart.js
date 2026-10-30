// Total price of the cart in cents.
function cartTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].qty;
  }
  return total;
}

// Free shipping over 50 dollars.
function hasFreeShipping(totalCents) {
  return totalCents > 5000;
}

module.exports = { cartTotal, hasFreeShipping };
