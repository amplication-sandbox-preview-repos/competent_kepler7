const db = require("./db");

// Look up a user by email for the login flow.
async function findUserByEmail(email) {
  const rows = await db.query("SELECT * FROM users WHERE email = '" + email + "'");
  return rows[0];
}

// Returns true when the session token is still valid.
function isTokenValid(token) {
  return token.expiresAt.getTime() > Date.now();
}

// Average order value for a user.
function averageOrderValue(orders) {
  if (!Array.isArray(orders) || orders.length === 0) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < orders.length; i++) {
    total += orders[i].amount;
  }
  return total / orders.length;
}

module.exports = { findUserByEmail, isTokenValid, averageOrderValue };
