/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#0F172A" },
  header: { marginBottom: 16, borderBottomWidth: 2, borderBottomColor: "#4F46E5", paddingBottom: 8 },
  brand: { fontSize: 18, fontWeight: 700, color: "#4F46E5" },
  subtitle: { fontSize: 9, color: "#64748B" },
  h2: { fontSize: 13, fontWeight: 700, marginTop: 16, marginBottom: 6 },
  meta: { flexDirection: "row", gap: 14, marginBottom: 8, marginTop: 4 },
  metaItem: { fontSize: 9, color: "#64748B" },
  metricRow: { flexDirection: "row", gap: 8, marginVertical: 8 },
  metric: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: "#F1F5F9" },
  metricBig: { fontSize: 22, fontWeight: 700 },
  metricLabel: { fontSize: 9, color: "#64748B", marginTop: 2 },
  greenBg: { backgroundColor: "#DCFCE7" },
  yellowBg: { backgroundColor: "#FEF3C7" },
  redBg: { backgroundColor: "#FEE2E2" },
  text: { fontSize: 10, lineHeight: 1.5, marginVertical: 4 },
  source: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94A3B8",
    textAlign: "center",
  },
});

export interface ReportData {
  id: string;
  fileName: string;
  wordCount: number;
  plagiarismPct: number | null;
  aiPct: number | null;
  type: string;
  createdAt: string;
  textContent: string;
  sources: { title: string; url?: string | null; matchPct: number }[];
  user?: { name: string };
}

function bgFor(pct: number | null) {
  if (pct === null) return styles.metric;
  if (pct < 25) return [styles.metric, styles.greenBg];
  if (pct < 60) return [styles.metric, styles.yellowBg];
  return [styles.metric, styles.redBg];
}

export function ReportDocument({ data }: { data: ReportData }) {
  const originality = data.plagiarismPct === null ? null : Math.max(0, 100 - data.plagiarismPct);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>AntiPlag</Text>
          <Text style={styles.subtitle}>Milliy Antiplagiat Tizimi — Hisobot</Text>
        </View>

        <View>
          <Text style={{ fontSize: 14, fontWeight: 700 }}>{data.fileName}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaItem}>Hujjat ID: {data.id}</Text>
            <Text style={styles.metaItem}>Sana: {new Date(data.createdAt).toLocaleString("uz-UZ")}</Text>
            <Text style={styles.metaItem}>So'zlar: {data.wordCount}</Text>
            {data.user ? <Text style={styles.metaItem}>Foydalanuvchi: {data.user.name}</Text> : null}
          </View>
        </View>

        <View style={styles.metricRow}>
          {originality !== null ? (
            <View style={bgFor(100 - originality)}>
              <Text style={styles.metricBig}>{originality.toFixed(0)}%</Text>
              <Text style={styles.metricLabel}>Originallik</Text>
            </View>
          ) : null}
          {data.plagiarismPct !== null ? (
            <View style={bgFor(data.plagiarismPct)}>
              <Text style={styles.metricBig}>{data.plagiarismPct.toFixed(0)}%</Text>
              <Text style={styles.metricLabel}>Plagiat</Text>
            </View>
          ) : null}
          {data.aiPct !== null ? (
            <View style={bgFor(data.aiPct)}>
              <Text style={styles.metricBig}>{data.aiPct.toFixed(0)}%</Text>
              <Text style={styles.metricLabel}>SI tomonidan</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.h2}>Topilgan manbalar</Text>
        {data.sources.length === 0 ? (
          <Text style={styles.text}>Manbalar topilmadi.</Text>
        ) : (
          data.sources.map((s, i) => (
            <View key={i} style={styles.source}>
              <Text style={{ flex: 3 }}>
                {i + 1}. {s.title}
                {s.url ? ` — ` : ""}
                {s.url ? <Link src={s.url}>{s.url}</Link> : null}
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>{s.matchPct.toFixed(0)}%</Text>
            </View>
          ))
        )}

        <Text style={styles.h2}>Hujjat matni (boshlanishi)</Text>
        <Text style={styles.text}>
          {data.textContent.slice(0, 1800)}
          {data.textContent.length > 1800 ? "..." : ""}
        </Text>

        <Text style={styles.footer} fixed>
          AntiPlag — antiplag.uz · Hisobot avtomatik tarzda yaratilgan · {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
}
