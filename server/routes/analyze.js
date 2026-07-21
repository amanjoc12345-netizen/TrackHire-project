import express from "express";
import { generateJSON } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: {
          message: "Both resumeText and jobDescription are required.",
        },
      });
    }

    const prompt = `You are an expert ATS resume analyzer. Analyze the following resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

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
  "matchScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence summary of how well the resume matches>",
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<weakness1>", "<weakness2>", ...],
  "skillsFound": ["<skill1>", "<skill2>", ...],
  "missingSkills": ["<missing1>", "<missing2>", ...],
  "keywordMatch": <number 0-100>,
  "missingTechnologies": ["<tech1>", "<tech2>", ...],
  "improvementSuggestions": ["<suggestion1>", "<suggestion2>", ...],
  "experienceAnalysis": "<assessment of experience relevance>",
  "educationAnalysis": "<assessment of education fit>",
  "finalRecommendation": "<final recommendation>"
}`;

    const parsed = await generateJSON(prompt, {
      maxRetries: 1,
      structureHint: "{matchScore, atsScore, summary, strengths, weaknesses, skillsFound, missingSkills, keywordMatch, missingTechnologies, improvementSuggestions, experienceAnalysis, educationAnalysis, finalRecommendation}",
    });

    // Wrap in OpenAI-compatible format for the frontend
    return res.status(200).json({
      choices: [
        {
          message: {
            content: JSON.stringify(parsed),
          },
        },
      ],
    });
  } catch (error) {
    console.error("[Analyze] Error:", {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
      body: { resumeTextLength: req.body?.resumeText?.length || 0, jobDescriptionLength: req.body?.jobDescription?.length || 0 },
    });

    return res.status(500).json({
      error: {
        message: error.message || "Internal Server Error",
      },
    });
  }
});

export default router;

