const express = require("express");
const faqController = require("../controllers/faqController"); // Fixed case
const redisClient = require("../config/redis"); // Redis connection

const router = express.Router();

// Middleware to cache FAQs from Redis
const cacheFAQs = async (req, res, next) => {
  try {
    const cachedFAQs = await redisClient.get("faqs");
    if (cachedFAQs) {
      return res.json(JSON.parse(cachedFAQs)); // Return cached response
    }
    next(); // If no cache, proceed to controller
  } catch (error) {
    console.error("Redis Cache Error:", error);
    next(); // Continue even if Redis fails
  }
};

// Create a new FAQ (No caching needed)
router.post("/faqs", faqController.createFAQ);

// Get FAQs (Uses Redis cache)
router.get("/faqs", cacheFAQs, faqController.getFAQs);

module.exports = router;
