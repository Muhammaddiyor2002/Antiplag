import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

const googleEnabled = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(googleEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email yoki telefon", type: "text" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        const id = credentials.identifier.trim();
        const isEmail = id.includes("@");
        const user = await prisma.user.findFirst({
          where: isEmail ? { email: id.toLowerCase() } : { phone: id },
        });
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar ?? user.image ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = ((user as { role?: "USER" | "ADMIN" }).role ?? "USER");
      }
      
      // Keep token role and image up-to-date with database on every JWT verification
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, avatar: true, image: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.picture = dbUser.avatar ?? dbUser.image ?? undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
