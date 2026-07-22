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

export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

export async function generateContent(prompt, endpoint = "OpenRouter API") {
  if (!client) {
    throw new Error(
      "OpenRouter is not configured. Set the OPENROUTER_API_KEY environment variable."
    );
  }

  try {
    const completion = await client.chat.completions.create({
      model: OPENROUTER_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices?.[0]?.message?.content || completion.choices?.[0]?.message?.reasoning || "";
    return text;
  } catch (error) {
    const httpStatus = error.status || error.statusCode || error.response?.status || null;
    const responseBody = error.error || error.response?.data || error.body || error.message || error;

    console.error("[OpenRouter Error]", {
      status: httpStatus,
      responseBody,
      model: OPENROUTER_MODEL,
      endpoint,
    });

    const errorDetails = {
      message: error.message,
      stack: error.stack,
      status: httpStatus,
      type: error.type || null,
      model: OPENROUTER_MODEL,
      endpoint,
    };
    console.error("[OpenRouter] Details:", JSON.stringify(errorDetails, null, 2));

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

