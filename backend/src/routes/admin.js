const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/reports/orders", async (req, res) => {
  const { userId, from, to, productId } = req.query;
  const q = `
    SELECT o.id AS order_id, o.created_at, u.id AS user_id, u.name, p.id AS product_id, p.title,
           oi.quantity, oi.price_snapshot, o.status
    FROM orders o
    JOIN users u ON u.id = o.user_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE ($1::int IS NULL OR u.id = $1)
      AND ($2::date IS NULL OR o.created_at >= $2)
      AND ($3::date IS NULL OR o.created_at <= $3)
      AND ($4::int IS NULL OR p.id = $4)
    ORDER BY o.created_at DESC
    LIMIT 1000;
  `;
  const vals = [userId || null, from || null, to || null, productId || null];
  const r = await db.query(q, vals);
  res.json({ rows: r.rows });
});

module.exports = router;
