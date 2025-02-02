const FAQ = require("../models/FAQ");
const translateText = require("../utils/translate");
const redisClient = require("../config/redis"); // Import Redis client

// Function to get translated FAQs with Redis caching
const getTranslatedFAQ = async (faq, lang) => {
  const cacheKey = `faq_${faq._id}_${lang}`;

  try {
    // Check if the data is already cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If not cached, fetch from DB and translate
    const translatedFAQ = {
      question: faq.translations[`question_${lang}`] || faq.question,
      answer: faq.translations[`answer_${lang}`] || faq.answer,
    };

    // Store in Redis with a TTL of 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(translatedFAQ));

    return translatedFAQ;
  } catch (error) {
    console.error("Redis error:", error);
    return { question: faq.question, answer: faq.answer }; // Fallback if Redis fails
  }
};

// ✅ Create FAQ and auto-translate
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faq = new FAQ({
      question,
      answer,
      translations: {
        question_hi: await translateText(question, "hi"),
        question_bn: await translateText(question, "bn"),
        answer_hi: await translateText(answer, "hi"),
        answer_bn: await translateText(answer, "bn"),
      },
    });

    await faq.save();

    // Clear cache for FAQs list
    await redisClient.del("all_faqs");

    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Fetch FAQs with translation and Redis caching
exports.getFAQs = async (req, res) => {
  try {
    const { lang = "en" } = req.query;

    // Try fetching from cache first
    const cacheKey = `all_faqs_${lang}`;
    const cachedFAQs = await redisClient.get(cacheKey);

    if (cachedFAQs) {
      return res.json(JSON.parse(cachedFAQs));
    }

    // If not cached, fetch from MongoDB
    const faqs = await FAQ.find();
    const translatedFAQs = await Promise.all(faqs.map((faq) => getTranslatedFAQ(faq, lang)));

    // Cache result for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(translatedFAQs));

    res.json(translatedFAQs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Server error" });
  }
};
