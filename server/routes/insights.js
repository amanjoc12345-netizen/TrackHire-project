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

    const prompt = `You are an expert career coach with deep knowledge of tech company interview processes. Provide detailed interview insights for:

Company: ${company}
Role: ${role}
Experience Level: ${experience || "Not specified"}

COMPANY-SPECIFIC INSIGHTS — Generate insights specific to ${company} for the ${role} position.

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
  "rounds": <number of interview rounds>,
  "difficulty": "<Easy/Medium/Hard>",
  "culture": "<2-3 sentence description of company culture from interview perspective>",
  "stages": ["<stage1 name>", "<stage2 name>", ...],
  "frequentlyAskedTopics": ["<topic1>", "<topic2>", "<topic3>", ...],
  "salaryExpectations": "<salary range for ${role} at ${experience} level>",
  "preparationTips": ["<tip1>", "<tip2>", "<tip3>", ...],
  "recentTechnologies": ["<tech1>", "<tech2>", ...],
  "expectations": "<2-3 sentence paragraph about what the company expects for this role>",
  "tips": ["<tip1>", "<tip2>", "<tip3>", ...],
  "experiences": [
    {
      "role": "<role name>",
      "outcome": "<Offer/Rejected>",
      "summary": "<what the candidate experienced>"
    }
  ]
}

CRITICAL: "frequentlyAskedTopics" MUST contain 4-6 topics commonly asked at ${company} for ${role}. "salaryExpectations" MUST be a realistic salary range. "recentTechnologies" MUST list technologies ${company} currently uses for this role.`;

    const parsed = await generateJSON(prompt, {
      maxRetries: 1,
      structureHint: "{rounds, difficulty, culture, stages, frequentlyAskedTopics, salaryExpectations, preparationTips, recentTechnologies, expectations, tips, experiences}",
      endpoint: "/api/insights/generate",
      params: { company, role, experience },
    });

    if (res.headersSent) return;
    return res.status(200).json(parsed);
  } catch (error) {
    console.error("[Insights] Error:", {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
      body: { company: req.body?.company, role: req.body?.role, experience: req.body?.experience },
    });

    if (res.headersSent) return;
    return res.status(500).json({
      error: {
        message: error.message || "Internal Server Error",
      },
    });
  }
});

export default router;

