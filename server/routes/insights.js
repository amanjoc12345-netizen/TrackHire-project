import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', requireAuth, async (req, res) => {
  const { company, role, experience } = req.body;

  if (!company || !role) {
    return res.status(400).json({
      error: { message: 'Both company and role are required.' }
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENCODE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'API key is missing on the server.' }
    });
  }

  const isOpenRouterKey = apiKey.startsWith('sk-or-');
  const endpoint = isOpenRouterKey
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://opencode.ai/zen/v1/chat/completions';

  const modelName = isOpenRouterKey
    ? (process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash')
    : (process.env.OPENCODE_MODEL || process.env.OPENROUTER_MODEL || 'deepseek-v4-flash-free');

  const systemPrompt = `You are an expert company interview insights analyst. You provide detailed, company-specific interview preparation insights based on industry knowledge. Return ONLY valid JSON. No markdown, no code fences.`;

  const userPrompt = `Provide detailed interview insights for a ${role} position at ${company} (Experience: ${experience || 'Not specified'}).

Return a JSON object with exactly this structure:
{
  "rounds": 4,
  "stages": ["Stage 1 Name", "Stage 2 Name", "Stage 3 Name", "Stage 4 Name"],
  "difficulty": "Easy|Medium|Hard",
  "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  "expectations": "Detailed description of what the company expects from candidates for this role",
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
  "culture": "Description of company culture",
  "experiences": [
    {
      "role": "${role}",
      "summary": "Realistic interview experience summary",
      "outcome": "Offer received|Rejected after final round"
    }
  ]
}

Make the insights specific to ${company}:
- Google: Focus on algorithms, Googlyness, analytical thinking
- Microsoft: Focus on problem-solving, cultural fit, LeetCode-style
- Amazon: Leadership Principles, behavioral, scalable systems
- Stripe: API design, clean code, integration patterns
- Adobe: Frontend focus, design systems, creative tech
- For other companies: use industry knowledge about their known interview process

Company: ${company}
Role: ${role}
Experience: ${experience || 'Not specified'}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  console.log('\n--- [Insights Generate Request] ---');
  console.log(`Company: ${company}, Role: ${role}, Experience: ${experience}`);

  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    if (isOpenRouterKey) {
      headers['HTTP-Referer'] = 'http://localhost:5000';
      headers['X-Title'] = 'TrackHire';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody;
      try { errorBody = await response.json(); } catch { errorBody = await response.text(); }
      console.error('[Insights Generate Error]:', errorBody);
      return res.status(response.status).json({
        error: { message: errorBody?.error?.message || `API returned status ${response.status}` }
      });
    }

    const data = await response.json();

    let insightsData;
    try {
      insightsData = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    } catch {
      insightsData = {};
    }

    console.log(`[Insights Generate] Model: ${data.model}, Rounds: ${insightsData.rounds || 'N/A'}`);
    console.log('---------------------------------\n');

    return res.json(insightsData);
  } catch (err) {
    console.error('[Insights Generate Route Error]:', err);
    return res.status(500).json({
      error: { message: err.message || 'Internal Server Error' }
    });
  }
});

export default router;
