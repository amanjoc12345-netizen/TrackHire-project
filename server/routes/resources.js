import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateJSON } from "../services/aiService.js";

const router = express.Router();

router.post("/generate", requireAuth, async (req, res) => {
  try {
    const { company, role, experience } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        error: { message: "Both company and role are required." },
      });
    }

    const prompt = `You are an expert learning curator. Recommend the best learning resources for interview preparation for:

Company: ${company}
Role: ${role}
Experience Level: ${experience || "Not specified"}

ROLE-SPECIFIC RESOURCES — You MUST recommend resources ONLY relevant to ${role}:

- For Frontend Developer / React Developer: ONLY recommend resources about React, JavaScript, TypeScript, HTML, CSS, Frontend System Design, Web Performance. Do NOT recommend ML/AI/Backend resources.
- For Backend Developer: ONLY recommend resources about Node.js, Express, Databases, System Design, APIs, Redis, Docker. Do NOT recommend frontend/ML resources.
- For Full Stack Developer: Recommend resources covering both frontend and backend technologies, databases, deployment, authentication.
- For AI/ML Engineer: ONLY recommend resources about Machine Learning, Deep Learning, LLMs, Python, NumPy, Pandas, TensorFlow, PyTorch, Kaggle, HuggingFace, Papers, DeepLearning.ai, FastAI, ML System Design. Do NOT recommend React or frontend resources.
- For Data Analyst: ONLY recommend resources about SQL, Python, Data Visualization, Statistics, Excel, BI tools.

STRICT JSON OUTPUT REQUIREMENTS — Follow EVERY rule:
- Output ONLY a valid JSON object. Nothing else.
- No markdown formatting, no code fences, no backticks.
- No explanations, notes, or any text before or after the JSON.
- First character must be {.
- Last character must be }.
- Use double quotes for all strings and keys — no single quotes.
- No trailing commas.

Return ONLY a valid JSON object with this exact structure:
{
  "categories": [
    {
      "category": "<category name>",
      "items": [
        {
          "id": "res-<unique-id>",
          "name": "<resource title>",
          "url": "<full https url to the resource>",
          "time": "<estimated time like 2 hours>",
          "type": "video/article/doc/course"
        }
      ]
    }
  ]
}

Include 3-5 categories with 2-4 items each. Use real, well-known resources (official docs, reputable courses, YouTube channels, books, practice platforms).
ALL resources MUST be directly relevant to ${role}. Do NOT include resources for other roles.`;

    const parsed = await generateJSON(prompt, {
      maxRetries: 1,
      structureHint: "{categories: [{category, items: [{id, name, url, time, type}]}]}",
    });

    if (!parsed?.categories?.length) {
      throw new Error("No resources were generated.");
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("[Resources] Error:", error);

    return res.status(500).json({
      error: {
        message: error.message || "Internal Server Error",
      },
    });
  }
});

export default router;

