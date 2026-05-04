export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);
    const email = data.email.toLowerCase();

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone: data.phone }] },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Bu email yoki telefon allaqachon ro'yxatdan o'tgan" },
        { status: 409 }
      );
    }

    const password = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: `${data.name} ${data.surname}`.trim(),
        email,
        phone: data.phone,
        password,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
