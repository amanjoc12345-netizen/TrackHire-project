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

    const prompt = `You are an expert interview preparation coach. Create a detailed step-by-step study roadmap for:

Company: ${company}
Role: ${role}
Experience Level: ${experience || "Not specified"}

ROLE-SPECIFIC ROADMAP — The roadmap MUST be tailored specifically to ${role}:

- For Frontend Developer / React Developer: Steps should cover HTML/CSS fundamentals, JavaScript deep dive, TypeScript, React ecosystem, State management, Performance optimization, Frontend System Design, Web APIs, Accessibility, Testing
- For Backend Developer: Steps should cover Node.js/Express, REST/GraphQL APIs, Database design (SQL/NoSQL), Redis caching, Authentication/Authorization, Microservices, System Design, DevOps basics
- For Full Stack Developer: Steps should cover both frontend and backend fundamentals, database design, deployment, CI/CD, System Design, Full Stack architecture
- For AI/ML Engineer: Steps should cover Python/NumPy/Pandas, Statistics/Linear Algebra, ML algorithms, Deep Learning, LLMs/Transformers, MLOps, AI System Design, Model deployment
- For Data Analyst: Steps should cover SQL, Excel, Python, Statistics, Data Visualization, BI Tools, A/B Testing
- For Software Engineer (General): Steps should cover DSA, OOP, Databases, System Design, Behavioral prep

Also consider:
- The candidate has ${experience || "Not specified"} years of experience — tailor depth accordingly
- The target company is ${company} — include company-specific preparation tips

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
  "steps": [
    {
      "id": "<unique-id-like-step-1>",
      "name": "<clear step title>",
      "description": "<detailed description of what to study/practice>",
      "estimatedTime": "<time estimate like 2-3 days>",
      "resourceLink": "<url to relevant learning resource>",
      "completed": false
    }
  ]
}

Generate 6-10 comprehensive steps. Each step MUST be directly relevant to ${role}.`;

    const parsed = await generateJSON(prompt, {
      maxRetries: 1,
      structureHint: "{steps: [{id, name, description, estimatedTime, resourceLink, completed}]}",
      endpoint: "/api/roadmap/generate",
      params: { company, role, experience },
    });

    if (!parsed?.steps?.length) {
      throw new Error("No roadmap steps were generated.");
    }

    if (res.headersSent) return;
    return res.status(200).json(parsed);
  } catch (error) {
    console.error("[Roadmap] Error:", {
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

