const express = require("express");
const bodyParser = require("body-parser");
const products = require("./routes/products");
const cart = require("./routes/cart");
const orders = require("./routes/orders");
const transfers = require("./routes/transfers");
const admin = require("./routes/admin");
const webhooks = require("./routes/webhooks");

const app = express();
app.use(bodyParser.json());

app.use("/api/products", products);
app.use("/api/cart", cart);
app.use("/api/orders", orders);
app.use("/api/transfers", transfers);
app.use("/api/admin", admin);
app.use("/api/webhooks", webhooks);

app.get("/health", (req, res) => res.json({ ok:true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Backend running on", port));
