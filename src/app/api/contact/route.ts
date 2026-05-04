export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const data = contactSchema.parse(await req.json());
    const msg = await prisma.contactMessage.create({
      data: { name: data.name, email: data.email || null, phone: data.phone, message: data.message },
    });
    return NextResponse.json({ id: msg.id }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
