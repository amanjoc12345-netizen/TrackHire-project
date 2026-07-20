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

  const systemPrompt = `You are an expert interview question generator. You generate realistic, high-quality interview questions for tech roles based on current market trends. Return ONLY valid JSON. No markdown, no code fences.`;

  const userPrompt = `Generate 15 interview questions for a ${role} position at ${company} (Experience: ${experience || 'Not specified'}). Reflect real interview patterns and current market expectations for this company.

Return a JSON object with exactly this structure:
{
  "sections": [
    {
      "id": "technical",
      "title": "Technical Round",
      "questions": [
        {
          "id": "t1",
          "question": "Full question text here?",
          "difficulty": "Medium",
          "estimatedTime": "8 min",
          "whyAsked": "Why interviewers ask this...",
          "expectedAnswer": "Detailed expected answer...",
          "commonMistakes": ["Mistake 1", "Mistake 2"],
          "aiExplanation": "AI coach explanation of the concept...",
          "followUps": ["Follow-up 1?", "Follow-up 2?"],
          "practiceHint": "Hint for practicing this..."
        }
      ]
    }
  ]
}

Sections required (in order):
1. "technical" — Technical Round (3 questions covering core CS / language / framework fundamentals)
2. "coding" — Coding Round (3 questions focused on algorithms, data structures, problem-solving)
3. "machine-coding" — Machine Coding (2 questions on building a small feature or component)
4. "system-design" — System Design (2 questions on architecture and scaling)
5. "behavioral" — Behavioral Round (3 questions on past experience, teamwork, conflict resolution)
6. "hr" — HR Round (2 questions on motivation, salary, career growth)

Company: ${company}
Role: ${role}
Experience: ${experience || 'Not specified'}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  console.log('\n--- [Questions Generate Request] ---');
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
      console.error('[Questions Generate Error]:', errorBody);
      return res.status(response.status).json({
        error: { message: errorBody?.error?.message || `API returned status ${response.status}` }
      });
    }

    const data = await response.json();

    let questionsData;
    try {
      questionsData = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    } catch {
      questionsData = { sections: [] };
    }

    console.log(`[Questions Generate] Model: ${data.model}, Sections: ${questionsData.sections?.length || 0}`);
    console.log('---------------------------------\n');

    return res.json(questionsData);
  } catch (err) {
    console.error('[Questions Generate Route Error]:', err);
    return res.status(500).json({
      error: { message: err.message || 'Internal Server Error' }
    });
  }
});

export default router;
