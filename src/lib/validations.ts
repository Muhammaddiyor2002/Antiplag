import { z } from "zod";

export const phoneSchema = z
  .string()
  .regex(/^\+998\d{9}$/, "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak");

export const passwordSchema = z
  .string()
  .min(8, "Parol kamida 8 belgidan iborat")
  .regex(/[A-Z]/, "Kamida 1 katta harf")
  .regex(/[a-z]/, "Kamida 1 kichik harf")
  .regex(/[0-9]/, "Kamida 1 raqam");

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ism kamida 2 belgi"),
    surname: z.string().min(2, "Familiya kamida 2 belgi"),
    email: z.string().email("Email noto'g'ri"),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    agree: z.boolean().refine((v) => v === true, "Shartlarni qabul qiling"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z.string().min(3, "Email yoki telefon kiriting"),
  password: z.string().min(1, "Parol kiriting"),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email noto'g'ri"),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: phoneSchema,
  message: z.string().min(10, "Xabar kamida 10 belgi"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2),
  phone: phoneSchema.optional().or(z.literal("")),
  language: z.enum(["uz", "ru", "en"]).optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Yangi parollar mos kelmadi",
    path: ["confirmNewPassword"],
  });

export const newsCreateSchema = z.object({
  title: z.string().min(3),
  titleRu: z.string().optional(),
  titleEn: z.string().optional(),
  slug: z.string().min(3),
  content: z.string().min(10),
  contentRu: z.string().optional(),
  contentEn: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().optional(),
});

export const faqCreateSchema = z.object({
  question: z.string().min(3),
  questionRu: z.string().optional(),
  questionEn: z.string().optional(),
  answer: z.string().min(3),
  answerRu: z.string().optional(),
  answerEn: z.string().optional(),
  order: z.number().int().optional(),
});

export const partnerCreateSchema = z.object({
  name: z.string().min(2),
  logo: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  order: z.number().int().optional(),
});

export const settingsSchema = z.record(z.string(), z.string());

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
