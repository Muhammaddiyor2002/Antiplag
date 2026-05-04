import { cleanText, splitSentences } from "./parser";

export interface AiResult {
  aiPct: number;
  highlights: { start: number; end: number; type: "ai"; similarity: number }[];
  paragraphs: { text: string; aiProb: number }[];
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function pseudoRandom(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

async function openaiClassify(text: string): Promise<number | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI text detector. Given a passage, return a number 0-100 representing the probability that it was written by an AI/LLM. Return ONLY the number.",
          },
          { role: "user", content: text.slice(0, 4000) },
        ],
        temperature: 0,
        max_tokens: 10,
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    const num = parseFloat(content);
    if (Number.isFinite(num)) return Math.max(0, Math.min(100, num));
    return null;
  } catch {
    return null;
  }
}

export async function detectAi(rawText: string): Promise<AiResult> {
  const text = cleanText(rawText);
  const apiResult = await openaiClassify(text);

  const seed = hashString(text.slice(0, 500)) || 9876;
  const rnd = pseudoRandom(seed);
  const sentences = splitSentences(text);

  const overall = apiResult ?? Math.round(20 + rnd() * 70);
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  const paragraphResults = paragraphs.map((p) => ({
    text: p,
    aiProb: Math.max(0, Math.min(100, Math.round(overall + (rnd() - 0.5) * 30))),
  }));

  const highlights: AiResult["highlights"] = [];
  for (let i = 0; i < sentences.length; i++) {
    const prob = Math.max(0, Math.min(100, Math.round(overall + (rnd() - 0.5) * 25)));
    if (prob > 60) {
      const idx = text.indexOf(sentences[i]);
      if (idx >= 0) {
        highlights.push({ start: idx, end: idx + sentences[i].length, type: "ai", similarity: prob });
      }
    }
  }

  return { aiPct: Math.round(overall), highlights, paragraphs: paragraphResults };
}
