"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, ExternalLink } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, originalityFromPlagiarism, pctColor } from "@/lib/utils";

export interface ReportSentence {
  text: string;
  start: number;
  end: number;
  isPlag?: boolean;
  sourceIndex?: number | null;
  aiProb?: number;
}

interface Source {
  id: string;
  title: string;
  url?: string | null;
  matchPct: number;
}

interface Highlights {
  plag?: { start: number; end: number; sourceIndex: number }[];
  ai?: { start: number; end: number; aiProb: number }[];
  sentences?: ReportSentence[];
  paragraphs?: { text: string; aiProb: number }[];
}

export function ReportView({
  check,
}: {
  check: {
    id: string;
    fileName: string;
    type: "PLAGIARISM" | "AI_DETECTION";
    wordCount: number;
    plagiarismPct: number | null;
    aiPct: number | null;
    createdAt: string;
    textContent: string;
    sources: Source[];
    highlights: Highlights | null;
  };
}) {
  const orig = check.plagiarismPct === null ? null : originalityFromPlagiarism(check.plagiarismPct);
  const isPlag = check.type === "PLAGIARISM";

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <Link href="/dashboard/reports" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Hisobotlar
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{check.fileName}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(check.createdAt)} · {check.wordCount} so'z
          </p>
        </div>
        <Button asChild variant="gradient">
          <a href={`/api/checks/${check.id}/pdf`} target="_blank" rel="noreferrer">
            <Download className="h-4 w-4" /> PDF
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard
          label="Originallik"
          value={orig === null ? "—" : `${Math.round(orig)}%`}
          color={check.plagiarismPct === null ? "secondary" : pctColor(check.plagiarismPct)}
          progressValue={orig ?? 0}
          inverse
        />
        <ScoreCard
          label="Plagiat"
          value={check.plagiarismPct === null ? "—" : `${Math.round(check.plagiarismPct)}%`}
          color={check.plagiarismPct === null ? "secondary" : pctColor(check.plagiarismPct)}
          progressValue={check.plagiarismPct ?? 0}
        />
        <ScoreCard
          label="SI tomonidan"
          value={check.aiPct === null ? "—" : `${Math.round(check.aiPct)}%`}
          color={check.aiPct === null ? "secondary" : pctColor(check.aiPct)}
          progressValue={check.aiPct ?? 0}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topilgan manbalar</CardTitle>
        </CardHeader>
        <CardContent>
          {check.sources.length === 0 ? (
            <p className="text-muted-foreground">Manbalar topilmadi.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Manba</TableHead>
                    <TableHead className="w-24 text-right">Foiz</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {check.sources.map((s, i) => (
                    <TableRow key={s.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{s.title}</div>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                            {s.url} <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={pctColor(s.matchPct)}>
                          {Math.round(s.matchPct)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matn tahlili</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm leading-7 whitespace-pre-wrap">
            {isPlag
              ? renderPlagText(check.textContent, check.highlights?.plag ?? [])
              : renderAiText(check.textContent, check.highlights?.ai ?? [])}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded plag-highlight" /> Plagiat
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded ai-highlight" /> AI
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  color,
  progressValue,
  inverse,
}: {
  label: string;
  value: string;
  color: "success" | "warning" | "danger" | "secondary";
  progressValue: number;
  inverse?: boolean;
}) {
  const indicator =
    color === "success"
      ? "bg-emerald-500"
      : color === "warning"
        ? "bg-amber-500"
        : color === "danger"
          ? "bg-red-500"
          : "bg-muted-foreground";
  const text =
    color === "success"
      ? "text-emerald-600"
      : color === "warning"
        ? "text-amber-600"
        : color === "danger"
          ? "text-red-600"
          : "text-muted-foreground";
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={`mt-1 text-4xl font-bold ${text}`}>{value}</div>
        <Progress value={inverse ? progressValue : progressValue} indicatorClassName={indicator} className="mt-3" />
      </CardContent>
    </Card>
  );
}

function renderPlagText(text: string, highlights: { start: number; end: number; sourceIndex: number }[]) {
  if (!highlights.length) return text;
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach((h, i) => {
    if (cursor < h.start) out.push(<span key={`t${i}`}>{text.slice(cursor, h.start)}</span>);
    out.push(
      <mark key={`m${i}`} className="plag-highlight" title={`Manba #${h.sourceIndex + 1}`}>
        {text.slice(h.start, h.end)}
      </mark>
    );
    cursor = h.end;
  });
  if (cursor < text.length) out.push(<span key="end">{text.slice(cursor)}</span>);
  return out;
}

function renderAiText(text: string, highlights: { start: number; end: number; aiProb: number }[]) {
  if (!highlights.length) return text;
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach((h, i) => {
    if (cursor < h.start) out.push(<span key={`t${i}`}>{text.slice(cursor, h.start)}</span>);
    out.push(
      <mark key={`m${i}`} className="ai-highlight" title={`AI ehtimoli: ${Math.round(h.aiProb)}%`}>
        {text.slice(h.start, h.end)}
      </mark>
    );
    cursor = h.end;
  });
  if (cursor < text.length) out.push(<span key="end">{text.slice(cursor)}</span>);
  return out;
}
