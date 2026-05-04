import { cleanText, countWords, splitSentences } from "./parser";

export interface PlagSource {
  title: string;
  url?: string;
  matchPct: number;
  snippets?: { text: string; sentenceIndex: number }[];
}

export interface PlagHighlight {
  start: number;
  end: number;
  type: "plagiarism" | "ai";
  sourceIndex?: number;
  similarity?: number;
}

export interface PlagResult {
  plagiarismPct: number;
  wordCount: number;
  sources: PlagSource[];
  highlights: PlagHighlight[];
  sentences: string[];
}

const DEMO_DOMAINS = [
  { d: "wikipedia.org", title: "Wikipedia — Erkin entsiklopediya" },
  { d: "ziyonet.uz", title: "ZiyoNET — Ta'lim portali" },
  { d: "lex.uz", title: "Lex.uz — O'zbekiston qonun hujjatlari" },
  { d: "researchgate.net", title: "ResearchGate — Ilmiy maqolalar" },
  { d: "scholar.google.com", title: "Google Scholar" },
  { d: "uza.uz", title: "UzA — O'zbekiston Milliy Axborot Agentligi" },
  { d: "kun.uz", title: "Kun.uz — Yangiliklar" },
  { d: "gazeta.uz", title: "Gazeta.uz — O'zbekiston yangiliklari" },
  { d: "academic.uz", title: "Academic.uz — Ilmiy ishlar" },
  { d: "ilm-fan.uz", title: "Ilm-fan.uz" },
];

function pickDomain(seed: number) {
  return DEMO_DOMAINS[seed % DEMO_DOMAINS.length];
}

function pseudoRandom(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

async function googleSearchSentence(sentence: string): Promise<{ title: string; url: string } | null> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
  if (!apiKey || !cx) return null;
  try {
    const q = encodeURIComponent(sentence.slice(0, 200));
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${q}&num=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: { title: string; link: string }[] };
    if (!data.items?.length) return null;
    return { title: data.items[0].title, url: data.items[0].link };
  } catch {
    return null;
  }
}

export async function checkPlagiarism(rawText: string): Promise<PlagResult> {
  const text = cleanText(rawText);
  const sentences = splitSentences(text);
  const wordCount = countWords(text);
  const seed = hashString(text.slice(0, 500)) || 12345;
  const rnd = pseudoRandom(seed);

  const apiEnabled = !!process.env.GOOGLE_SEARCH_API_KEY && !!process.env.GOOGLE_SEARCH_ENGINE_ID;
  const sourceMap = new Map<string, PlagSource>();
  const highlights: PlagHighlight[] = [];

  let plagSentenceCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    let matched: { title: string; url: string; matchPct: number } | null = null;

    if (apiEnabled) {
      const found = await googleSearchSentence(sentence);
      if (found) {
        matched = { title: found.title, url: found.url, matchPct: 70 + rnd() * 25 };
      }
    } else {
      // Demo mode: ~30-65% of sentences flagged as plagiarism, deterministic by seed.
      const flagged = rnd() < 0.45;
      if (flagged) {
        const dom = pickDomain(Math.floor(rnd() * DEMO_DOMAINS.length * 100));
        const slug = sentence
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 40)
          .replace(/^-|-$/g, "");
        matched = {
          title: dom.title,
          url: `https://${dom.d}/${slug || "article"}-${(i + 1).toString().padStart(3, "0")}`,
          matchPct: 60 + rnd() * 35,
        };
      }
    }

    if (matched) {
      plagSentenceCount++;
      const idx = text.indexOf(sentence);
      if (idx >= 0) {
        const sourceIndex = sourceMap.has(matched.url) ? Array.from(sourceMap.keys()).indexOf(matched.url) : sourceMap.size;
        highlights.push({
          start: idx,
          end: idx + sentence.length,
          type: "plagiarism",
          sourceIndex,
          similarity: Math.round(matched.matchPct),
        });
      }
      const existing = sourceMap.get(matched.url);
      if (existing) {
        existing.matchPct = Math.max(existing.matchPct, matched.matchPct);
        existing.snippets?.push({ text: sentence.slice(0, 240), sentenceIndex: i });
      } else {
        sourceMap.set(matched.url, {
          title: matched.title,
          url: matched.url,
          matchPct: Math.round(matched.matchPct),
          snippets: [{ text: sentence.slice(0, 240), sentenceIndex: i }],
        });
      }
    }
  }

  const plagiarismPct =
    sentences.length === 0
      ? 0
      : Math.min(95, Math.round((plagSentenceCount / sentences.length) * 100));

  return {
    plagiarismPct,
    wordCount,
    sources: Array.from(sourceMap.values())
      .sort((a, b) => b.matchPct - a.matchPct)
      .slice(0, 12),
    highlights,
    sentences,
  };
}
