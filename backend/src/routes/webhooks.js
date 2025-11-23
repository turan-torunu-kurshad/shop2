const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/transfer", async (req, res) => {
  const { external_ref, status, details } = req.body;
  await db.query("UPDATE transfers SET status=$1, payload = COALESCE(payload, '{}'::jsonb) || $2::jsonb, updated_at=now() WHERE external_ref=$3",
    [status, JSON.stringify(details || {}), external_ref]);
  if (status === "confirmed") {
    const t = await db.query("SELECT order_id FROM transfers WHERE external_ref=$1", [external_ref]);
    if (t.rows[0]) {
      await db.query("UPDATE orders SET status=$1, payment_status=$2, updated_at=now() WHERE id=$3", ["paid","paid", t.rows[0].order_id]);
    }
  }
  res.status(200).send("ok");
});

module.exports = router;
