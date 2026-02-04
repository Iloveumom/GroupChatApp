const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ---------- Predictive Typing ---------- */
async function predictiveTyping(text, tone = "casual") {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are a chat assistant.

Task:
Suggest exactly 3 continuations.

Rules:
- Max 4 words each
- Not full sentences
- Natural chat style
- Tone: ${tone}

Message:
"${text}"
`
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 30,
      temperature: 0.5,
    }
  });

  return clean(response.text);
}

/* ---------- Smart Replies ---------- */
async function smartReplies(message, tone = "friendly") {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are a chat assistant.

Generate exactly 3 smart replies.

Rules:
- Under 8 words
- Friendly
- Human chat style
- Tone: ${tone}

Incoming message:
"${message}"
`
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 40,
      temperature: 0.6,
    }
  });

  return clean(response.text);
}

/* ---------- Output Cleaner ---------- */
function clean(text) {
  return text
    .split("\n")
    .map(t => t.replace(/^\d+[\).\s-]*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

module.exports = {
  predictiveTyping,
  smartReplies,
};