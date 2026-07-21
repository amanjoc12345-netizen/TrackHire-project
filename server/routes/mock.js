import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateContent } from "../services/openrouter.js";
import { generateJSON, extractFirstJSON } from "../services/aiService.js";

const router = express.Router();

/**
 * POST /api/mock/categories
 * Generate 3 dynamic mock interview categories based on the selected role.
 */
router.post("/categories", requireAuth, async (req, res) => {
    try {
        const { company, role, experience } = req.body;

        if (!role) {
            return res.status(400).json({
                error: { message: "Role is required." },
            });
        }

        const prompt = `You are an expert interview coach. Generate 3 mock interview categories for a candidate preparing for:

Company: ${company || "Not specified"}
Role: ${role}
Experience: ${experience || "Not specified"}

ROLE-SPECIFIC CATEGORIES — The categories MUST be specifically relevant to ${role}:

Examples:
- For AI/ML Engineer: ["Machine Learning", "LLMs & Prompt Engineering", "Behavioral"]
- For Frontend Developer: ["React & JavaScript", "CSS & Performance", "Behavioral"]
- For Backend Developer: ["Node.js & APIs", "System Design", "Behavioral"]
- For DevOps: ["Docker/Kubernetes", "Cloud Architecture", "Behavioral"]

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
      "id": "category-1",
      "label": "Category Name",
      "description": "Brief description of what this category covers"
    },
    {
      "id": "category-2",
      "label": "Category Name",
      "description": "Brief description of what this category covers"
    },
    {
      "id": "category-3",
      "label": "Behavioral",
      "description": "Behavioral questions using the STAR method"
    }
  ]
}

The third category MUST be "Behavioral" for every role.
Generate questions and descriptions that are 100% specific to ${role}. Do NOT use generic category names.`;

        const parsed = await generateJSON(prompt, {
            maxRetries: 1,
            structureHint: "{categories: [{id, label, description}]}",
        });

        return res.status(200).json(parsed);
    } catch (error) {
        console.error("[Mock Categories] Error:", {
            message: error.message,
            stack: error.stack,
            path: req.originalUrl,
            method: req.method,
            body: { company: req.body?.company, role: req.body?.role, experience: req.body?.experience },
        });

        return res.status(500).json({
            error: {
                message: error.message || "Internal Server Error",
            },
        });
    }
});

/**
 * POST /api/mock/evaluate
 * Evaluate mock interview answers.
 */
router.post("/evaluate", requireAuth, async (req, res) => {
    try {
        const { questions, answers, mockType, company, role, experience } = req.body;

        if (!questions || !answers || !mockType) {
            return res.status(400).json({
                error: { message: "questions, answers, and mockType are required." },
            });
        }

        const qaPairs = questions.map((q, i) => {
            return `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${answers[i] || "(no answer given)"}`;
        }).join("\n\n");

        const prompt = `You are an expert technical interviewer evaluating a mock interview session.

Role: ${role || "Not specified"}
Company: ${company || "Not specified"}
Experience: ${experience || "Not specified"}
Mock type: ${mockType}

Below are the questions and the candidate's answers:

${qaPairs}

STRICT JSON OUTPUT REQUIREMENTS — Follow EVERY rule:
- Output ONLY a valid JSON object. Nothing else.
- No markdown formatting, no code fences, no backticks.
- No explanations, notes, or any text before or after the JSON.
- First character must be {.
- Last character must be }.
- Use double quotes for all strings and keys — no single quotes.
- No trailing commas.
- The JSON must match this exact structure — do NOT add or remove any fields:
{"score":42,"strengths":["strength1","strength2"],"weaknesses":["weakness1","weakness2"],"feedback":"overall feedback","idealAnswer":"complete ideal answer covering all concepts","confidence":"Medium"}

SCORING RUBRIC (MANDATORY — apply strictly):
- Perfect answer (comprehensive, accurate, well-structured): 90-100
- Good answer (mostly correct, minor gaps): 75-89
- Average answer (partial knowledge, some errors): 55-74
- Weak answer (vague, incomplete, major gaps): 30-54
- Wrong/nonsensical answer (gibberish, off-topic, single words like "asdf", "12345", "hello", "qwerty"): 0-29

Consider these factors when scoring:
- Technical correctness
- Completeness of the answer
- Relevance to the question
- Communication quality
- Missing concepts
- Incorrect concepts

If the user clearly typed gibberish, nonsense, or single throwaway words, the score MUST be below 10. Never inflate scores.`;

        const rawText = await generateContent(prompt);

        // Use the shared depth-counting JSON extractor
        const jsonStr = extractFirstJSON(rawText);

        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        } catch (parseErr) {
            console.error("[Mock] Invalid JSON from AI. Raw response (first 500 chars):", rawText?.substring(0, 500));
            console.error("[Mock] Extracted string that failed to parse:", jsonStr);
            return res.status(500).json({
                error: {
                    message: "The AI returned an invalid evaluation. Please try again.",
                },
            });
        }

        // Ensure score is within bounds
        const score = Math.max(0, Math.min(100, Math.round(parsed.score || 0)));

        return res.status(200).json({
            score,
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            feedback: parsed.feedback || "No feedback provided.",
            idealAnswer: parsed.idealAnswer || "",
            confidence: parsed.confidence || "Medium",
        });
    } catch (error) {
        console.error("[Mock] Error:", {
            message: error.message,
            stack: error.stack,
            path: req.originalUrl,
            method: req.method,
            body: { mockType: req.body?.mockType, company: req.body?.company, role: req.body?.role, experience: req.body?.experience, questionsCount: req.body?.questions?.length, answersCount: req.body?.answers?.length },
        });

        return res.status(500).json({
            error: {
                message: error.message || "Internal Server Error",
            },
        });
    }
});

export default router;

