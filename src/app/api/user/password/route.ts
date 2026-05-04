export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updatePasswordSchema } from "@/lib/validations";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const data = updatePasswordSchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const ok = await bcrypt.compare(data.currentPassword, user.password);
    if (!ok) return NextResponse.json({ message: "Joriy parol noto'g'ri" }, { status: 400 });
    const hashed = await hashPassword(data.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
