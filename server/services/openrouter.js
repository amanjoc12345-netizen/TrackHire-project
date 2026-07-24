import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import OpenAI from "openai";

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  dotenv.config({ path: join(__dirname, "..", ".env") });
} catch (_) {}
dotenv.config();

export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

function getGroqClient() {
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && groqKey.trim().length > 0) {
    return new OpenAI({
      apiKey: groqKey.trim(),
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return null;
}

function getOpenRouterClient() {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey && openrouterKey.trim().length > 0) {
    return new OpenAI({
      apiKey: openrouterKey.trim(),
      baseURL: "https://openrouter.ai/api/v1",
    });
  }
  return null;
}

function getGeminiClient() {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 0) {
    return new OpenAI({
      apiKey: geminiKey.trim(),
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
  }
  return null;
}

export async function generateContent(prompt, endpoint = "AI Service") {
  let lastError = null;
  const groqClient = getGroqClient();
  const openrouterClient = getOpenRouterClient();
  const geminiClient = getGeminiClient();

  // 1. Attempt call with Groq AI Primary if key exists
  if (groqClient) {
    const groqModels = [
      GROQ_MODEL,
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
    ].filter((v, i, a) => a.indexOf(v) === i);

    for (const modelName of groqModels) {
      try {
        console.log(`[openrouter.js] Attempting Groq AI model (${modelName}) for ${endpoint}...`);
        const completion = await groqClient.chat.completions.create({
          model: modelName,
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const text =
          completion.choices?.[0]?.message?.content ||
          completion.choices?.[0]?.message?.reasoning ||
          "";
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (groqError) {
        console.warn(
          `[openrouter.js] Groq model ${modelName} failed (${groqError.status || groqError.message}). Trying next model...`
        );
        lastError = groqError;
      }
    }
  }

  // 2. Fallback to OpenRouter Primary if key exists
  if (openrouterClient) {
    try {
      console.log(`[openrouter.js] Attempting OpenRouter model (${OPENROUTER_MODEL}) for ${endpoint}...`);
      const completion = await openrouterClient.chat.completions.create({
        model: OPENROUTER_MODEL,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const text =
        completion.choices?.[0]?.message?.content ||
        completion.choices?.[0]?.message?.reasoning ||
        "";
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (error) {
      lastError = error;
      const httpStatus = error.status || error.statusCode || error.response?.status || null;
      console.warn(
        `[openrouter.js] OpenRouter call failed (${httpStatus}): ${error.message}`
      );
    }
  }

  // 3. Fallback to Gemini if configured
  if (geminiClient) {
    const geminiModels = [
      "gemini-3.6-flash",
      "gemini-flash-latest",
      "gemini-flash-lite-latest",
      "gemma-4-26b-a4b-it",
    ];

    for (const modelName of geminiModels) {
      try {
        console.log(`[openrouter.js] Attempting Google Gemini model (${modelName}) for ${endpoint}...`);
        const completion = await geminiClient.chat.completions.create({
          model: modelName,
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const text = completion.choices?.[0]?.message?.content || "";
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (geminiError) {
        console.warn(
          `[openrouter.js] Gemini model ${modelName} failed (${geminiError.status || geminiError.message}). Trying next fallback model...`
        );
        lastError = geminiError;
      }
    }
  }

  // 4. Detailed Error Handling if all providers/models failed
  if (lastError) {
    const isRateLimit =
      lastError.status === 429 ||
      lastError.statusCode === 429 ||
      lastError.message?.includes("429") ||
      lastError.message?.includes("rate limit") ||
      lastError.message?.includes("Rate limit");

    if (isRateLimit) {
      throw new Error(
        "AI Rate limit exceeded. Please check GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY in server/.env."
      );
    }
    if (lastError.status === 401) {
      throw new Error("AI authentication failed. Please check your GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY in server/.env.");
    }
    if (lastError.status === 402) {
      throw new Error("AI account has insufficient credits. Please check your AI API key in server/.env.");
    }

    throw new Error(`AI API error: ${lastError.message}`);
  }

  throw new Error(
    "No AI provider configured. Set GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY in server/.env."
  );
}
