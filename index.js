const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // MongoDB connection
const redisClient = require("./config/redis"); // Redis connection
const faqRoutes = require("./routes/FAQroutes");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Test Redis Connection
app.get("/test-redis", async (req, res) => {
  try {
    await redisClient.set("message", "Hello from Redis!");
    const message = await redisClient.get("message");
    res.json({ redis_message: message });
  } catch (error) {
    console.error("❌ Redis Error:", error);
    res.status(500).json({ error: "Redis connection failed" });
  }
});

// Routes
app.use("/api", faqRoutes);

// Start the server
app.listen(PORT, async () => {
  try {
    await redisClient.connect(); // Ensure Redis is connected before starting the server
    console.log("✅ Redis Connected Successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
