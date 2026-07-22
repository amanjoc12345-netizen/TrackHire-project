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
      "[Coach] Prompt sent to OpenRouter:",
      prompt.substring(0, 150) + "..."
    );

    const response = await generateText(prompt, "/api/coach");

    console.log(
      "[Coach] Response from OpenRouter:",
      response?.substring?.(0, 150) || response
    );

    if (res.headersSent) return;
    return res.status(200).json({
      success: true,
      response,
      model: "openrouter",
    });
  } catch (error) {
    const safeBody = { ...req.body };
    delete safeBody.message; // Don't log potentially long user messages

    console.error("[Coach] Error:", {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
      body: safeBody,
    });

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

