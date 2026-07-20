import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      error: {
        message: 'Both resumeText and jobDescription are required.'
      }
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENCODE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: {
        message: 'API key is missing on the server. Please configure OPENROUTER_API_KEY.'
      }
    });
  }

  // Determine if we should call the real OpenRouter API or use the local development mock proxy
  const isRealOpenRouter = apiKey.startsWith('sk-or-');
  const endpoint = isRealOpenRouter
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://opencode.ai/zen/v1/chat/completions';

  const modelName = isRealOpenRouter
    ? (process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash')
    : (process.env.OPENCODE_MODEL || process.env.OPENROUTER_MODEL || 'deepseek-v4-flash-free');

  console.log(`[AI Analyzer] Routing request to: ${endpoint}`);
  console.log(`[AI Analyzer] Requesting model: ${modelName}`);

  const prompt = `
You are an expert ATS Resume Analyzer. Always return valid JSON only.

Analyze the provided resume text against the target job description.

Return a valid JSON object matching this schema:

{
  "matchScore": 85,
  "atsScore": 75,
  "summary": "Summary text description of the candidate's alignment...",
  "skillsFound": ["Skill A", "Skill B"],
  "missingSkills": ["Skill C", "Skill D"],
  "keywordMatch": ["Keyword A: High density", "Keyword B: Missing"],
  "strengths": ["Strength detail 1", "Strength detail 2"],
  "weaknesses": ["Weakness detail 1", "Weakness detail 2"],
  "improvementSuggestions": ["Actionable step 1", "Actionable step 2"],
  "missingTechnologies": ["Tech A", "Tech B"],
  "importantKeywords": ["Keyword C", "Keyword D"],
  "experienceAnalysis": "Assessment of candidate's experience fit...",
  "educationAnalysis": "Assessment of education/credentials fit...",
  "finalRecommendation": "Short recommendation summary..."
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // Standard OpenRouter requests benefit from providing Referer/Title headers
    if (isRealOpenRouter) {
      headers['HTTP-Referer'] = 'http://localhost:5000';
      headers['X-Title'] = 'TrackHire';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(
      endpoint,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert ATS Resume Analyzer. Always return valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          response_format: {
            type: 'json_object'
          }
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody;
      try { errorBody = await response.json(); } catch { errorBody = await response.text(); }
      console.error('[AI Analyzer] Error Response:', errorBody);

      return res.status(response.status).json({
        error: {
          message:
            errorBody?.error?.message ||
            `API returned status ${response.status}`
        },
        details: errorBody
      });
    }

    const data = await response.json();

    console.log(`[AI Analyzer] Response successfully received. Model name used: ${data.model}`);
    return res.json(data);
  } catch (err) {
    console.error('[AI Analyzer] Route Error:', err);

    return res.status(500).json({
      error: {
        message: err.message || 'Internal Server Error'
      }
    });
  }
});

export default router;