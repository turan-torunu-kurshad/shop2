const express = require("express");
const db = require("../db");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/", async (req, res) => {
  const { orderId, amount } = req.body;
  const insert = await db.query("INSERT INTO transfers(order_id,amount,status,created_at) VALUES($1,$2,$3,now()) RETURNING *", [orderId, amount, "pending"]);
  const transfer = insert.rows[0];
  try {
    const resp = await fetch(process.env.LANK_API_URL + "/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.LANK_API_KEY}` },
      body: JSON.stringify({ orderId, amount, callbackUrl: `${process.env.BASE_URL}/api/webhooks/transfer` })
    });
    const data = await resp.json();
    await db.query("UPDATE transfers SET external_ref=$1, status=$2, payload=$3, updated_at=now() WHERE id=$4", [data.ref || null, "sent", JSON.stringify(data), transfer.id]);
    res.json({ ok:true, transfer: { ...transfer, external: data } });
  } catch (err) {
    await db.query("UPDATE transfers SET status=$1, payload=$2, updated_at=now() WHERE id=$3", ["failed", JSON.stringify({error: err.message}), transfer.id]);
    res.status(500).json({ ok:false, error: err.message });
  }
});

module.exports = router;
