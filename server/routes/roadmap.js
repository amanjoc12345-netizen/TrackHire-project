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

  const systemPrompt = `You are an expert interview preparation roadmap generator. You create personalized step-by-step study roadmaps for tech candidates. Return ONLY valid JSON. No markdown, no code fences.`;

  const userPrompt = `Create a personalized interview preparation roadmap for a ${role} position at ${company} (Experience: ${experience || 'Not specified'}).

Return a JSON object with exactly this structure:
{
  "steps": [
    {
      "id": "step1",
      "name": "Topic Name",
      "description": "Description of what to study and why it matters for this role",
      "estimatedTime": "X hours",
      "resourceLink": "https://example.com/resource",
      "topics": ["Sub-topic 1", "Sub-topic 2"]
    }
  ]
}

Generate 8-12 steps. The roadmap must be specific to the role:
- For Frontend: HTML semantics, CSS layouts, JavaScript (closures, event loop, async), TypeScript, React/Angular, Performance, Testing, Build tools, System Design basics
- For Backend: Language fundamentals, APIs (REST/GraphQL), Databases (SQL/NoSQL), Caching, Auth, Message queues, Microservices, Deployment, System Design
- For AI/ML: Python, NumPy, Pandas, ML algorithms, Deep Learning, TensorFlow/PyTorch, MLOps, System Design, Behavioral
- For Data Analyst: SQL, Excel, Statistics, PowerBI/Tableau, Python, Data visualization, Business acumen, Case studies
- For Full Stack: Both frontend and backend topics
- For React Developer: React core, Hooks, State management, Next.js, Testing, Performance, Build tools

Company: ${company}
Role: ${role}
Experience: ${experience || 'Not specified'}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  console.log('\n--- [Roadmap Generate Request] ---');
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
      console.error('[Roadmap Generate Error]:', errorBody);
      return res.status(response.status).json({
        error: { message: errorBody?.error?.message || `API returned status ${response.status}` }
      });
    }

    const data = await response.json();

    let roadmapData;
    try {
      roadmapData = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    } catch {
      roadmapData = { steps: [] };
    }

    console.log(`[Roadmap Generate] Model: ${data.model}, Steps: ${roadmapData.steps?.length || 0}`);
    console.log('---------------------------------\n');

    return res.json(roadmapData);
  } catch (err) {
    console.error('[Roadmap Generate Route Error]:', err);
    return res.status(500).json({
      error: { message: err.message || 'Internal Server Error' }
    });
  }
});

export default router;
