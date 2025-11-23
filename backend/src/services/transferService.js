const fetch = require("node-fetch");
const db = require("../db");

async function sendTransfer(orderId, amount) {
  const insert = await db.query("INSERT INTO transfers(order_id,amount,status,created_at) VALUES($1,$2,$3,now()) RETURNING *", [orderId, amount, "pending"]);
  const transfer = insert.rows[0];
  const resp = await fetch(process.env.LANK_API_URL + "/settle", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.LANK_API_KEY}` },
    body: JSON.stringify({ orderId, amount, callbackUrl: `${process.env.BASE_URL}/api/webhooks/transfer` })
  });
  const data = await resp.json();
  await db.query("UPDATE transfers SET external_ref=$1, status=$2, payload=$3, updated_at=now() WHERE id=$4", [data.ref || null, "sent", JSON.stringify(data), transfer.id]);
  return { transfer, external: data };
}

module.exports = { sendTransfer };
