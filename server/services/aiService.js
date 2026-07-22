import { generateContent } from "./openrouter.js";

/**
 * Extract the first complete JSON value (object or array) from a string.
 * Uses brace/bracket depth counting to correctly handle nested structures,
 * escaped characters, and string literals. Strips markdown code fences
 * and backticks. Ignores any text before or after the JSON value.
 *
 * @param {string} rawText - Raw text from the AI
 * @returns {string} The extracted JSON string, or empty string if none found
 */
function extractFirstJSON(rawText) {
    let text = rawText.trim();

    // Strip markdown code fences (triple backticks with optional language)
    text = text.replace(/```(?:json)?\s*\n?/gi, "");
    text = text.replace(/\n?\s*```/g, "");

    // Strip any remaining leading/trailing single backticks
    text = text.replace(/^`+|`+$/g, "");

    // Find the first opening brace or bracket
    const firstOpenBrace = text.indexOf("{");
    const firstOpenBracket = text.indexOf("[");

    let startIdx = -1;
    let openChar = null;
    let closeChar = null;

    if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
        startIdx = firstOpenBrace;
        openChar = "{";
        closeChar = "}";
    } else if (firstOpenBracket !== -1) {
        startIdx = firstOpenBracket;
        openChar = "[";
        closeChar = "]";
    } else {
        return ""; // No JSON found
    }

    // Extract the complete JSON by tracking depth,
    // respecting strings (including escaped quotes) and character escapes
    let depth = 0;
    let inString = false;
    let escaped = false;
    let result = "";

    for (let i = startIdx; i < text.length; i++) {
        const ch = text[i];
        result += ch;

        if (escaped) {
            escaped = false;
            continue;
        }

        if (ch === "\\" && inString) {
            escaped = true;
            continue;
        }

        if (ch === '"') {
            inString = !inString;
            continue;
        }

        if (inString) {
            continue;
        }

        if (ch === openChar) {
            depth++;
        } else if (ch === closeChar) {
            depth--;
            if (depth === 0) {
                // Found the matching closing character — stop here
                break;
            }
        }
    }

    // If depth is not zero, we didn't find a complete JSON — return empty
    if (depth !== 0) {
        return "";
    }

    return result;
}

export { extractFirstJSON };

/**
 * Generate structured JSON data from an AI prompt with built-in retry logic.
 *
 * @param {string} prompt - The prompt to send to the AI
 * @param {object} options
 * @param {number} options.maxRetries - Number of retries on JSON parse failure (default: 1)
 * @param {string} options.structureHint - Description of expected JSON structure (for retry prompt)
 * @returns {Promise<object>} Parsed JSON object
 * @throws {Error} If JSON parsing fails after all retries
 */
export async function generateJSON(prompt, options = {}) {
    const { maxRetries = 1, structureHint = "", endpoint = "" } = options;

    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        let currentPrompt = prompt;

        // On retry, add stricter instructions including the failed response
        if (attempt > 0) {
            currentPrompt = `${prompt}\n\nIMPORTANT: Your previous response was not valid JSON. Please return ONLY a valid JSON object. No markdown. No code fences. No backticks. No explanations. The response must start with '{' or '[' and end with '}' or ']'.`;

            if (structureHint) {
                currentPrompt += `\n\nExpected JSON structure: ${structureHint}`;
            }

            if (lastError) {
                currentPrompt += `\n\nPrevious error: ${lastError.message}`;
            }
        }

        try {
            const rawText = await generateContent(currentPrompt, endpoint);
            const jsonStr = extractFirstJSON(rawText);

            if (!jsonStr || (jsonStr[0] !== "{" && jsonStr[0] !== "[")) {
                throw new Error(
                    `Response does not contain valid JSON. Response starts with: "${jsonStr.substring(0, 100)}..."`
                );
            }

            const parsed = JSON.parse(jsonStr);
            return parsed;
        } catch (error) {
            lastError = error;

            if (attempt < maxRetries) {
                console.warn(
                    `[aiService] JSON parse failed (attempt ${attempt + 1}/${maxRetries + 1}):`,
                    error.message
                );
            } else {
                console.error(
                    `[aiService] All ${maxRetries + 1} attempts failed:`,
                    error.message
                );
                throw new Error(
                    `The AI returned an invalid response. ${error.message}`
                );
            }
        }
    }

    // Should never reach here
    throw new Error("Unexpected error in generateJSON");
}

/**
 * Generate text content from an AI prompt (no JSON parsing).
 * Used for the Coach feature where free-form text is expected.
 *
 * @param {string} prompt
 * @param {string} endpoint
 * @returns {Promise<string>}
 */
export async function generateText(prompt, endpoint = "") {
    return generateContent(prompt, endpoint);
}

