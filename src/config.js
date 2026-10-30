function parsePort(value) {
  return parseInt(value);
}

function isAdmin(user) {
  return user.role === "admin";
}

module.exports = { parsePort, isAdmin };
