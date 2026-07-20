import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const SUPPORTED_MODELS = [
  'google/gemini-2.5-flash',
  'openai/gpt-5.2',
  'openai/gpt-5',
  'anthropic/claude-sonnet-4',
  'anthropic/claude-opus-4',
  'meta-llama/llama-4-maverick',
  'deepseek/deepseek-chat-v4',
  'mistral/mistral-large-4'
];

const SITE_URL = process.env.SITE_URL
  || (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://trackhire.vercel.app');

const SITE_NAME = process.env.SITE_NAME || 'TrackHire';

function pickModel() {
  const configured = process.env.OPENROUTER_MODEL;
  if (!configured) return 'google/gemini-2.5-flash';
  return configured;
}

router.post('/', requireAuth, async (req, res) => {
  const { message, history, company, role, experience, activeTab } = req.body;

  if (!message) {
    return res.status(400).json({
      error: { message: 'Message is required.' }
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENCODE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'API key is missing on the server. Please configure OPENROUTER_API_KEY in your Render environment variables.' }
    });
  }

  const isOpenRouterKey = apiKey.startsWith('sk-or-');
  if (!isOpenRouterKey) {
    return res.status(500).json({
      error: { message: 'Invalid API key format. OpenRouter keys start with "sk-or-". Generate a new key at https://openrouter.ai/keys' }
    });
  }

  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
  const modelName = pickModel();

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

  console.log('\n--- [Interview Coach Request] ---');
  console.log(`User message: "${message}"`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Requested Model: ${modelName}`);

  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-OpenRouter-Title': SITE_NAME
    };

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

      const errorMsg = errorBody?.error?.message || `API returned status ${response.status}`;
      console.error('[Interview Coach Error Response]:', errorMsg);

      if (response.status === 404 || response.status === 400) {
        const hint = SUPPORTED_MODELS.includes(modelName)
          ? ''
          : ` Model "${modelName}" may be deprecated. Set OPENROUTER_MODEL to one of: ${SUPPORTED_MODELS.join(', ')}`;
        return res.status(response.status).json({
          error: { message: errorMsg + hint }
        });
      }

      return res.status(response.status).json({
        error: { message: errorMsg },
        details: errorBody
      });
    }

    const data = await response.json();

    console.log(`Model used: ${data.model}`);
    console.log('---------------------------------\n');

    return res.json(data);
  } catch (err) {
    console.error('[Interview Coach Route Error]:', err);

    if (err.name === 'AbortError') {
      return res.status(504).json({
        error: { message: 'The AI provider took too long to respond. Please try again.' }
      });
    }

    return res.status(500).json({
      error: { message: err.message || 'Internal Server Error' }
    });
  }
});

export default router;
