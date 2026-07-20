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

  const systemPrompt = `You are an expert interview preparation resource curator. You generate high-quality learning resource recommendations tailored to specific roles and companies. Return ONLY valid JSON. No markdown, no code fences.`;

  const userPrompt = `Generate curated learning resources for a ${role} position at ${company} (Experience: ${experience || 'Not specified'}). The resources must be specific to this role's tech stack.

Return a JSON object with exactly this structure:
{
  "categories": [
    {
      "category": "Category Name",
      "items": [
        {
          "id": "res1",
          "type": "doc|video|article|course",
          "name": "Resource title",
          "url": "https://example.com/resource",
          "time": "X min read/watch",
          "description": "Brief description of what this resource covers"
        }
      ]
    }
  ]
}

Generate 4-6 categories with 2-4 items each. Categories must be relevant to the role:
- For Frontend: React, JavaScript, CSS, Browser APIs, Performance
- For Backend: Node.js, Databases, APIs, Auth, Caching
- For AI/ML: Python, NumPy, PyTorch, ML Ops, Statistics
- For Data Analyst: SQL, PowerBI, Statistics, Excel, Data Visualization
- For Full Stack: Both frontend and backend topics
- For React Developer: React ecosystem, State management, Testing, Next.js

Company: ${company}
Role: ${role}
Experience: ${experience || 'Not specified'}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  console.log('\n--- [Resources Generate Request] ---');
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
      console.error('[Resources Generate Error]:', errorBody);
      return res.status(response.status).json({
        error: { message: errorBody?.error?.message || `API returned status ${response.status}` }
      });
    }

    const data = await response.json();

    let resourcesData;
    try {
      resourcesData = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    } catch {
      resourcesData = { categories: [] };
    }

    console.log(`[Resources Generate] Model: ${data.model}, Categories: ${resourcesData.categories?.length || 0}`);
    console.log('---------------------------------\n');

    return res.json(resourcesData);
  } catch (err) {
    console.error('[Resources Generate Route Error]:', err);
    return res.status(500).json({
      error: { message: err.message || 'Internal Server Error' }
    });
  }
});

export default router;
