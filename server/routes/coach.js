import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateText } from "../services/aiService.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      message,
      history,
      company,
      role,
      experience,
      activeTab,
    } = req.body;

    console.log("[Coach] Request received:", {
      message: message?.substring(0, 80),
      company,
      role,
      experience,
      activeTab,
    });

    if (!message) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Message is required.",
        },
      });
    }

    let prompt = `You are an expert interview coach and senior software engineer.

Help the user prepare for technical interviews.

`;

    if (company) {
      prompt += `Company: ${company}\n`;
    }

    if (role) {
      prompt += `Role: ${role}\n`;
    }

    if (experience) {
      prompt += `Experience: ${experience}\n`;
    }

    if (activeTab) {
      prompt += `Focus Area: ${activeTab}\n`;
    }

    if (history && history.length > 0) {
      prompt += `\nConversation History:\n`;

      history.forEach((item) => {
        prompt += `${item.role}: ${item.content}\n`;
      });
    }

    prompt += `\nUser Question:\n${message}`;

    console.log(
      "[Coach] Prompt sent to AI:",
      prompt.substring(0, 150) + "..."
    );

    const response = await generateText(prompt, "/api/coach");

    console.log(
      "[Coach] Response from AI:",
      response?.substring?.(0, 150) || response
    );

    if (res.headersSent) return;
    return res.status(200).json({
      success: true,
      response,
      model: "ai-provider",
    });
  } catch (error) {
    const safeBody = { ...req.body };
    delete safeBody.message;

    console.error("[Coach] Error:", {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
      body: safeBody,
    });

    const isRateLimit =
      error.message?.includes("rate limit") ||
      error.message?.includes("Rate limit") ||
      error.message?.includes("429");

    if (isRateLimit) {
      if (res.headersSent) return;
      return res.status(200).json({
        success: true,
        response: `⚠️ **AI Rate Limit Reached**\n\n` +
          `**Options to fix this:**\n` +
          `1. **Add a free Groq AI Key (Recommended):** Get a free key at [Groq Console](https://console.groq.com/) and set \`GROQ_API_KEY=your_key\` in your \`server/.env\` file.\n` +
          `2. **Add a Gemini Key:** Get a free key at [Google AI Studio](https://aistudio.google.com/) and set \`GEMINI_API_KEY=your_key\` in your \`server/.env\` file.\n` +
          `3. **Top Up OpenRouter:** Add credits at [OpenRouter Credits](https://openrouter.ai/settings/credits).`,
        model: "rate-limit-notice",
      });
    }

    if (res.headersSent) return;
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || "Internal Server Error",
      },
    });
  }
});

export default router;
