const { Queue } = require("bullmq");
const IORedis = require("ioredis");
const db = require("../db");
const sendNotification = require("../utils/sendNotification");

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
const queue = new Queue("waitlist", { connection });

async function notifyForProduct(productId) {
  const r = await db.query("SELECT * FROM waitlist WHERE product_id=$1 AND notified=false", [productId]);
  for (const row of r.rows) {
    await sendNotification(row.user_id, `Ù…Ø­ØµÙˆÙ„ Ø¨Ø§ ID ${productId} Ù…ÙˆØ¬ÙˆØ¯ Ø´Ø¯.`);
    await db.query("UPDATE waitlist SET notified=true WHERE id=$1", [row.id]);
  }
}

module.exports = { notifyForProduct, queue };
