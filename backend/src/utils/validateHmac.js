const crypto = require("crypto");
module.exports = function validateHmac(secret, payload, signature) {
  const h = crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");
  return h === signature;
};
