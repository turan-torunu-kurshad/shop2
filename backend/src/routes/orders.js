const express = require("express");
const db = require("../db");
const router = express.Router();

/*
  POST /api/orders
  Body: { userId, cartId, shipping_amount }
  Behavior:
    - Creates order from cart items
    - Reserves stock (increases reserved_quantity) inside DB transaction
*/
router.post("/", async (req, res) => {
  const { userId, cartId, shipping_amount=0 } = req.body;
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    const cartItems = (await client.query("SELECT * FROM cart_items WHERE cart_id=$1", [cartId])).rows;
    if (!cartItems.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "cart empty" });
    }
    let total = 0;
    for (const it of cartItems) total += parseFloat(it.price_snapshot) * it.quantity;
    total += parseFloat(shipping_amount || 0);
    const orderRes = await client.query("INSERT INTO orders(user_id,total_amount,shipping_amount,status,payment_status,created_at) VALUES($1,$2,$3,$4,$5,now()) RETURNING *", [userId, total, shipping_amount, "pending", "unpaid"]);
    const order = orderRes.rows[0];
    for (const it of cartItems) {
      await client.query("INSERT INTO order_items(order_id,product_id,quantity,price_snapshot) VALUES($1,$2,$3,$4)", [order.id, it.product_id, it.quantity, it.price_snapshot]);
      // reserve stock: increase reserved_quantity across stock rows (simple strategy: increase reserved_quantity)
      await client.query("UPDATE stock SET reserved_quantity = reserved_quantity + $1 WHERE product_id=$2", [it.quantity, it.product_id]);
    }
    await client.query("UPDATE carts SET status=$1 WHERE id=$2", ["purchased", cartId]);
    await client.query("COMMIT");
    res.json({ ok:true, order });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ ok:false, error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
