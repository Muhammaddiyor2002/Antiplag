import mammoth from "mammoth";

export async function extractTextFromBuffer(filename: string, buffer: Buffer): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "txt") return buffer.toString("utf-8");
  if (ext === "doc" || ext === "docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  if (ext === "pdf") {
    const mod = (await import("pdf-parse")) as unknown as
      | { default: (b: Buffer) => Promise<{ text: string }> }
      | ((b: Buffer) => Promise<{ text: string }>);
    const pdfParse = typeof mod === "function" ? mod : mod.default;
    const data = await pdfParse(buffer);
    return data.text;
  }
  throw new Error(`Qo'llab-quvvatlanmaydigan format: .${ext}`);
}

export function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function countWords(text: string): number {
  return text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean).length;
}

export function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-ZА-ЯЎҚҒҲ])/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}
