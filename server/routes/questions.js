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

    const prompt = `You are an expert technical interviewer. Generate 20-30 comprehensive interview questions for the following role:

Company: ${company}
Role: ${role}
Experience Level: ${experience || "Not specified"}

ROLE-SPECIFIC TOPICS — You MUST generate questions ONLY relevant to this specific role:

- For Frontend Developer / React Developer: Questions MUST cover React, JavaScript, TypeScript, HTML, CSS, Browser APIs, Performance optimization, State management, System Design (Frontend architecture)
- For Backend Developer: Questions MUST cover Node.js, Express, REST APIs, GraphQL, Databases (SQL/NoSQL), Redis, Caching, Scaling, System Design (Backend architecture)
- For Full Stack Developer: Questions MUST cover Frontend AND Backend AND Database AND Authentication AND Deployment AND System Design
- For AI/ML Engineer: Questions MUST cover Machine Learning, Deep Learning, LLMs, Transformers, Python, NumPy, Pandas, TensorFlow/PyTorch, SQL, Statistics, Linear Algebra, Probability, MLOps, AI System Design
- For Data Analyst: Questions MUST cover SQL, Python, Data Visualization, Statistics, Excel, Business Intelligence, A/B Testing
- For Software Engineer (General): Questions MUST cover Data Structures, Algorithms, OOP, Databases, System Design

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON. No markdown. No code fences. No backticks. No explanations.
- The JSON must be an array of question objects with this exact structure. Generate 20-30 questions:

STRICT JSON OUTPUT REQUIREMENTS — Follow EVERY rule:
- Output ONLY a valid JSON array. Nothing else.
- No markdown formatting, no code fences, no backticks.
- No explanations, notes, or any text before or after the JSON.
- First character must be [.
- Last character must be ].
- Use double quotes for all strings and keys — no single quotes.
- No trailing commas.
[
  {
    "id": "q-1",
    "difficulty": "Easy",
    "question": "Question text here",
    "answer": "Concise correct answer",
    "explanation": "Detailed explanation of the concept",
    "followUp": ["Follow-up question 1", "Follow-up question 2"]
  },
  ...
]

- Distribute difficulty evenly: ~30% Easy, ~40% Medium, ~30% Hard
- "difficulty" must be exactly one of: "Easy", "Medium", "Hard"
- "followUp" must be an array of strings (can be empty array if no follow-ups)
- Each question MUST be specific to ${role} role — do NOT generate generic questions`;

    const parsed = await generateJSON(prompt, {
      maxRetries: 1,
      structureHint: "[{id, difficulty, question, answer, explanation, followUp}]",
    });

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("No questions were generated.");
    }

    return res.status(200).json({ questions: parsed });
  } catch (error) {
    console.error("[Questions] Error:", error);

    return res.status(500).json({
      error: {
        message: error.message || "Internal Server Error",
      },
    });
  }
});

export default router;

