import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { message, history, company, role, experience, activeTab } = req.body;

  if (!message) {
    return res.status(400).json({
      error: {
        message: 'Message is required.'
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

  const isOpenRouterKey = apiKey.startsWith('sk-or-');
  const endpoint = isOpenRouterKey
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://opencode.ai/zen/v1/chat/completions';

  const modelName = isOpenRouterKey
    ? (process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash')
    : (process.env.OPENCODE_MODEL || process.env.OPENROUTER_MODEL || 'deepseek-v4-flash-free');

  // Build system prompt and message history
  const systemPrompt = `You are an expert AI Interview Coach helping a candidate prepare for an interview.
Candidate Context:
- Target Company: ${company || 'General Company'}
- Target Role: ${role || 'Software Engineer'}
- Experience Level: ${experience || '1-2 Years'}
- Active Focus Topic: ${activeTab || 'overview'}

Respond to the candidate's query in a helpful, encouraging, and highly professional coaching style. Provide detailed explanations, tips, sample questions, or code reviews matching the target company and role context. Keep your responses formatted cleanly with markdown.`;

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  if (Array.isArray(history)) {
    const truncated = history.slice(-50);
    let totalChars = 0;
    for (const msg of truncated) {
      if (msg.text && msg.sender) {
        totalChars += msg.text.length;
        if (totalChars > 25000) break;
        messages.push({
          role: msg.sender === 'coach' ? 'assistant' : 'user',
          content: msg.text
        });
      }
    }
  }

  messages.push({ role: 'user', content: message });

  // Log user message, endpoint, and requested model
  console.log('\n--- [Interview Coach Request] ---');
  console.log(`User message: "${message}"`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Requested Model name: ${modelName}`);

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
        temperature: 0.7
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody;
      try { errorBody = await response.json(); } catch { errorBody = await response.text(); }
      console.error('[Interview Coach Error Response]:', errorBody);
      return res.status(response.status).json({
        error: {
          message: errorBody?.error?.message || `API returned status ${response.status}`
        },
        details: errorBody
      });
    }

    const data = await response.json();

    // Print logs as requested:
    // User message, Endpoint, Model name, OpenRouter response, Final response sent to frontend
    console.log(`Model name: ${data.model}`);
    console.log('OpenRouter response:', JSON.stringify(data, null, 2));
    console.log('Final response sent to frontend:', JSON.stringify(data.choices?.[0]?.message || {}, null, 2));
    console.log('---------------------------------\n');

    return res.json(data);
  } catch (err) {
    console.error('[Interview Coach Route Error]:', err);
    return res.status(500).json({
      error: {
        message: err.message || 'Internal Server Error'
      }
    });
  }
});

export default router;
