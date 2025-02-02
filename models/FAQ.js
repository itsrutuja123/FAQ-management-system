const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    translations: {
      question_hi: { type: String, trim: true },
      question_bn: { type: String, trim: true },
      answer_hi: { type: String, trim: true },
      answer_bn: { type: String, trim: true },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create an index for faster searches
faqSchema.index({ question: "text", answer: "text" });

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
