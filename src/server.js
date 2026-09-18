import { createServer } from "node:http";
import { addItem, getItem, listItems, removeStock, totalValue } from "./inventory.js";

const PORT = process.env.PORT || 3000;

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

export function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/items") {
    return json(res, 200, listItems());
  }
  if (req.method === "GET" && url.pathname === "/items/value") {
    return json(res, 200, { totalCents: totalValue() });
  }
  if (req.method === "GET" && url.pathname.startsWith("/items/")) {
    const sku = url.pathname.slice("/items/".length);
    const item = getItem(sku);
    return json(res, item ? 200 : 404, item ?? { error: "not found" });
  }
  if (req.method === "POST" && url.pathname === "/items") {
    readBody(req).then((body) => json(res, 201, addItem(body)));
    return;
  }
  if (req.method === "POST" && url.pathname.startsWith("/items/") && url.pathname.endsWith("/remove")) {
    const sku = url.pathname.split("/")[2];
    readBody(req).then((body) => json(res, 200, removeStock(sku, body.quantity)));
    return;
  }
  json(res, 404, { error: "not found" });
}

if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  createServer(handler).listen(PORT, () => {
    console.log(`inventory service listening on ${PORT}`);
  });
}
