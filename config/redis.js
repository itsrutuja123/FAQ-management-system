const Redis = require("ioredis");
require("dotenv").config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,  // Use the hostname
  port: process.env.REDIS_PORT,  // Use the port number
  password: process.env.REDIS_PASSWORD, // Use the password from .env
  username: "default",  // Assuming you use "default" as the username
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (error) => {
  console.error("❌ Redis Connection Error:", error);
});

module.exports = redisClient;
