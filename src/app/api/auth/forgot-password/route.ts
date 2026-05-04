export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    // Always return success to prevent email enumeration
    if (user) {
      // TODO: actually send email via SMTP. For demo we just log.
      console.log(`[forgot-password] Reset link for ${email} would be sent here`);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
