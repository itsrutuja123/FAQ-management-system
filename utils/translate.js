const translate = require("@vitalets/google-translate-api");

const translateText = async (text, lang) => {
  try {
    const res = await translate(text, { to: lang });
    return res.text;
  } catch (error) {
    console.error("❌ Translation Error:", error);
    return text; // Fallback to original text
  }
};

module.exports = translateText;
