const express = require("express");
const db = require("../db");
const router = express.Router();

async function getAvailable(productId) {
  const r = await db.query("SELECT COALESCE(SUM(quantity),0) as qty, COALESCE(SUM(reserved_quantity),0) as reserved FROM stock WHERE product_id=$1", [productId]);
  const qty = parseInt(r.rows[0].qty || 0);
  const reserved = parseInt(r.rows[0].reserved || 0);
  return Math.max(0, qty - reserved);
}

router.post("/:userId/items", async (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;
  const productRes = await db.query("SELECT * FROM products WHERE id=$1", [productId]);
  if (!productRes.rows[0]) return res.status(404).json({ error: "product not found" });
  const product = productRes.rows[0];
  const available = await getAvailable(productId);
  let cart = await db.query("SELECT * FROM carts WHERE user_id=$1 AND status=$2", [userId, "active"]);
  if (!cart.rows.length) {
    const c = await db.query("INSERT INTO carts(user_id,status) VALUES($1,$2) RETURNING *", [userId,"active"]);
    cart = c;
  }
  const cartId = cart.rows[0].id;
  const qty = Number(quantity || 1);
  if (available >= qty) {
    await db.query("INSERT INTO cart_items(cart_id,product_id,quantity,price_snapshot,status) VALUES($1,$2,$3,$4,$5)",
      [cartId, productId, qty, product.price, "active"]);
    return res.json({ ok:true, message: "added to cart", mode: "active", available });
  } else {
    if (product.allow_backorder) {
      await db.query("INSERT INTO cart_items(cart_id,product_id,quantity,price_snapshot,status) VALUES($1,$2,$3,$4,$5)",
        [cartId, productId, qty, product.price, "backorder"]);
      return res.json({ ok:true, message: "added as backorder", mode: "backorder", available });
    } else {
      await db.query("INSERT INTO waitlist(user_id,product_id,requested_qty) VALUES($1,$2,$3)", [userId, productId, qty]);
      return res.json({ ok:true, message: "added to waitlist", mode: "waitlist", available });
    }
  }
});

module.exports = router;
