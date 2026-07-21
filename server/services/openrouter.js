import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const apiKey = process.env.OPENROUTER_API_KEY;

// Don't throw at module load — let the first API call fail gracefully
let client = null;

if (!apiKey) {
  console.error(
    "[OpenRouter] FATAL: OPENROUTER_API_KEY is not defined in environment variables. " +
    "All AI features will return errors until this is configured."
  );
} else {
  client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export async function generateContent(prompt) {
  if (!client) {
    throw new Error(
      "OpenRouter is not configured. Set the OPENROUTER_API_KEY environment variable."
    );
  }

  try {
    const completion = await client.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    // Enhanced error logging with full details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      status: error.status || error.code || null,
      type: error.type || null,
    };
    console.error("[OpenRouter] Error:", JSON.stringify(errorDetails, null, 2));

    // OpenAI SDK specific error handling
    if (error.status === 401) {
      throw new Error("OpenRouter authentication failed. Check your OPENROUTER_API_KEY.");
    }
    if (error.status === 429) {
      throw new Error("OpenRouter rate limit exceeded. Please try again later.");
    }
    if (error.status === 402) {
      throw new Error("OpenRouter account has insufficient credits. Please top up your account.");
    }
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND" || error.code === "ETIMEDOUT") {
      throw new Error(`OpenRouter network error (${error.code}). Check your internet connection and API availability.`);
    }

    throw new Error(`OpenRouter API error: ${error.message}`);
  }
}

