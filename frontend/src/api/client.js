const axios = require("axios");
const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
  timeout: 10000
});
module.exports = client;
