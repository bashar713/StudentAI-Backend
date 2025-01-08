const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/config");

// Initialize Gemini AI with proper error handling
let genAI;
try {
  genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
  throw new Error("Failed to initialize AI service");
}

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function processText(prompt, text) {
  try {
    console.log(
      "Using API Key:",
      config.GEMINI_API_KEY.substring(0, 10) + "..."
    ); // Log partial key for debugging
    const result = await model.generateContent(`${prompt}: ${text}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
}

module.exports = {
  summarize: async (req, res) => {
    try {
      const { text } = req.body;
      const result = await processText(
        "Summarize this text in 2-3 key points",
        text
      );
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  simplify: async (req, res) => {
    try {
      const { text } = req.body;
      const result = await processText(
        "Explain this text in simple, easy-to-understand terms",
        text
      );
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  examples: async (req, res) => {
    try {
      const { text } = req.body;
      const result = await processText(
        "Provide 2-3 real-life examples to help understand this concept",
        text
      );
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  videos: async (req, res) => {
    try {
      const { text } = req.body;
      const result = await processText(
        "Find 3 educational topics I should search on YouTube to better understand this concept (format each topic as: '1. Topic - Brief description')",
        text
      );

      // Process the result to extract topics and create search links
      const topics = result
        .split("\n")
        .filter((line) => line.trim() && line.match(/^\d+\./))
        .map((line) => {
          const topic = line
            .split("-")[0]
            .replace(/^\d+\./, "")
            .trim();
          return {
            fullText: line.trim(),
            searchQuery: encodeURIComponent(topic),
            searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
              topic
            )}`,
          };
        });

      res.json({
        success: true,
        result: {
          rawText: result,
          topics: topics,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
