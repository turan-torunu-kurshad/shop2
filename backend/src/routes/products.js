const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const p = await db.query("SELECT * FROM products WHERE id=$1", [id]);
  if (!p.rows[0]) return res.status(404).json({ error: "not found" });
  const product = p.rows[0];
  const s = await db.query("SELECT COALESCE(SUM(quantity),0) as qty, COALESCE(SUM(reserved_quantity),0) as reserved FROM stock WHERE product_id=$1", [id]);
  const qty = parseInt(s.rows[0].qty || 0);
  const reserved = parseInt(s.rows[0].reserved || 0);
  const available = Math.max(0, qty - reserved);
  res.json({ product, stock: { qty, reserved, available } });
});

router.get("/:id/stock-details", async (req, res) => {
  const id = req.params.id;
  const s = await db.query("SELECT * FROM stock WHERE product_id=$1", [id]);
  res.json({ stock: s.rows });
});

module.exports = router;
