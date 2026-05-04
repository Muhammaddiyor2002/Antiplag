export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminContactsPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div className="container py-8">
      <Card>
        <CardHeader><CardTitle>Aloqa xabarlari ({messages.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {messages.length === 0 ? <p className="text-muted-foreground py-8 text-center">Xabarlar yo'q</p> : null}
            {messages.map((m) => (
              <div key={m.id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email ?? "—"} · {m.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.read ? null : <Badge variant="warning">Yangi</Badge>}
                    <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString("uz-UZ")}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
