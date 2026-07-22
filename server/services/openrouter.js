import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const openrouterKey = process.env.OPENROUTER_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

// Primary Provider: OpenRouter
let openrouterClient = null;
if (openrouterKey && openrouterKey.trim().length > 0) {
  openrouterClient = new OpenAI({
    apiKey: openrouterKey.trim(),
    baseURL: "https://openrouter.ai/api/v1",
  });
}

// Secondary Provider: Google Gemini (OpenAI SDK compatible endpoint)
let geminiClient = null;
if (geminiKey && geminiKey.trim().length > 0) {
  geminiClient = new OpenAI({
    apiKey: geminiKey.trim(),
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}

export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

export async function generateContent(prompt, endpoint = "AI Service") {
  let lastError = null;

  // 1. Attempt call with OpenRouter Primary if key exists
  if (openrouterClient) {
    try {
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
        `[openrouter.js] OpenRouter primary call failed (${httpStatus}): ${error.message}`
      );
    }
  }

  // 2. Fallback to Gemini if configured
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

  // 3. Detailed Error Handling if all providers/models failed
  if (lastError) {
    const isRateLimit =
      lastError.status === 429 ||
      lastError.statusCode === 429 ||
      lastError.message?.includes("429") ||
      lastError.message?.includes("rate limit") ||
      lastError.message?.includes("Rate limit");

    if (isRateLimit) {
      throw new Error(
        "OpenRouter rate limit exceeded (50 free requests/day limit reached). To fix, set a free GEMINI_API_KEY in server/.env or add credits to OpenRouter."
      );
    }
    if (lastError.status === 401) {
      throw new Error("AI authentication failed. Please check your OPENROUTER_API_KEY or GEMINI_API_KEY in server/.env.");
    }
    if (lastError.status === 402) {
      throw new Error("OpenRouter account has insufficient credits. Please top up your account or configure GEMINI_API_KEY.");
    }

    throw new Error(`AI API error: ${lastError.message}`);
  }

  throw new Error(
    "No AI provider configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY in server/.env."
  );
}
