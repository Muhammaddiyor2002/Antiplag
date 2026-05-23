"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Upload, FileText, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { cn, formatBytes } from "@/lib/utils";
import Script from "next/script";

export function CheckForm() {
  const t = useTranslations("dashboard.check");
  const router = useRouter();
  const params = useSearchParams();
  const initialTab = params.get("type") === "ai" ? "AI_DETECTION" : "PLAGIARISM";
  const [tab, setTab] = useState<"PLAGIARISM" | "AI_DETECTION">(initialTab);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  function pickFile(f: File | null | undefined) {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      toast.error("Fayl 10 MB dan katta");
      return;
    }
    const ext = `.${f.name.toLowerCase().split(".").pop() ?? ""}`;
    if (!ALLOWED_FILE_TYPES.includes(ext as (typeof ALLOWED_FILE_TYPES)[number])) {
      toast.error("Faqat .doc, .docx, .pdf, .txt");
      return;
    }
    setFile(f);
  }

  async function submit() {
    if (!file && text.trim().length < 50) {
      toast.error("Fayl yoki kamida 50 ta belgili matn yuboring");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("type", tab);

      if (file) {
        const ext = `.${file.name.toLowerCase().split(".").pop() ?? ""}`;
        if (ext === ".pdf" && file.size > 4 * 1024 * 1024) {
          throw new Error(t("pdfLimitError"));
        }

        if (ext === ".docx" || ext === ".txt") {
          let extractedText = "";
          if (ext === ".docx") {
            const mammoth = (window as any).mammoth;
            if (!mammoth) {
              throw new Error(t("libraryLoadingError"));
            }
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            extractedText = result.value;
          } else {
            extractedText = await file.text();
          }

          if (!extractedText.trim()) {
            throw new Error(t("noTextError"));
          }

          fd.append("text", extractedText);
          fd.append("fileName", file.name);
          fd.append("fileSize", file.size.toString());
        } else {
          fd.append("file", file);
        }
      } else if (text.trim()) {
        fd.append("text", text);
      }

      const res = await fetch("/api/checks", { method: "POST", body: fd });
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        if (res.status === 413) {
          throw new Error(t("payloadTooLarge"));
        }
        const textError = await res.text();
        throw new Error(textError || t("error"));
      }

      if (!res.ok) throw new Error(data?.message ?? t("error"));
      toast.success(t("success"));
      router.push(`/dashboard/reports/${data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js"
        strategy="afterInteractive"
      />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("supportedFormats")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="PLAGIARISM">
                <FileText className="h-4 w-4" /> {t("tabPlagiarism")}
              </TabsTrigger>
              <TabsTrigger value="AI_DETECTION">
                <Sparkles className="h-4 w-4" /> {t("tabAi")}
              </TabsTrigger>
            </TabsList>
            {(["PLAGIARISM", "AI_DETECTION"] as const).map((v) => (
              <TabsContent key={v} value={v} className="mt-6 space-y-4">
                <label
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    pickFile(e.dataTransfer.files[0]);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition",
                    drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="mt-2 font-semibold">{t("uploadFile")}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t("dropFile")}</div>
                  <div className="text-xs text-muted-foreground mt-2">{t("supportedFormats")}</div>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".doc,.docx,.pdf,.txt"
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                  {file ? (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm">
                      <FileText className="h-4 w-4" /> {file.name} <span className="text-xs text-muted-foreground">({formatBytes(file.size)})</span>
                    </div>
                  ) : null}
                </label>

                <div className="text-center text-sm text-muted-foreground">{t("orPaste")}</div>
                <Textarea
                  rows={8}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("textPlaceholder")}
                />

                <Button onClick={submit} disabled={loading} variant="gradient" size="lg" className="w-full">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("processing")}</> : t("submit")}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
