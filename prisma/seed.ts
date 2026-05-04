import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FAQS = [
  {
    question: "AntiPlag nima va u qanday ishlaydi?",
    questionRu: "Что такое AntiPlag и как он работает?",
    questionEn: "What is AntiPlag and how does it work?",
    answer:
      "AntiPlag — bu hujjatlardagi plagiatni va sun'iy intellekt yordamida yozilgan matnni aniqlovchi platforma. Hujjat yuklanganidan so'ng tizim matnni jumlalarga bo'lib, har birini katta hajmdagi internet manbalari va bizning bazamiz bilan solishtiradi.",
    answerRu:
      "AntiPlag — это платформа, обнаруживающая плагиат и текст, сгенерированный ИИ. После загрузки документа система разбивает его на предложения и сравнивает с большой базой источников.",
    answerEn:
      "AntiPlag is a platform that detects plagiarism and AI-generated text. Once a document is uploaded, the system splits the text into sentences and compares each one against a large set of internet sources.",
    order: 1,
  },
  {
    question: "Qaysi fayl formatlari qo'llab-quvvatlanadi?",
    questionRu: "Какие форматы файлов поддерживаются?",
    questionEn: "Which file formats are supported?",
    answer: ".doc, .docx, .pdf va .txt formatlari qo'llab-quvvatlanadi. Fayl hajmi 10 MB dan oshmasligi kerak.",
    answerRu: "Поддерживаются .doc, .docx, .pdf и .txt. Размер файла не должен превышать 10 МБ.",
    answerEn: "We support .doc, .docx, .pdf and .txt. File size must not exceed 10 MB.",
    order: 2,
  },
  {
    question: "Hujjatlarim xavfsizmi?",
    questionRu: "Мои документы в безопасности?",
    questionEn: "Are my documents safe?",
    answer: "Ha. Hujjatlar shifrlangan kanal orqali uzatiladi va faqat tahlil maqsadida ishlatiladi.",
    answerRu: "Да. Документы передаются по защищённому каналу и используются только для анализа.",
    answerEn: "Yes. Documents are transmitted over an encrypted channel and used only for analysis.",
    order: 3,
  },
  {
    question: "Bepul tarif qanday cheklovlarga ega?",
    questionRu: "Какие ограничения у бесплатного тарифа?",
    questionEn: "What are the limits of the free plan?",
    answer: "Bepul tarifda kuniga 3 marta, har biri maksimum 5 MB hajmli hujjat tekshira olasiz.",
    answerRu: "На бесплатном тарифе доступно 3 проверки в день, до 5 МБ на документ.",
    answerEn: "The free plan allows 3 checks per day, up to 5 MB per document.",
    order: 4,
  },
  {
    question: "AI Detektor qanday ishlaydi?",
    questionRu: "Как работает AI-детектор?",
    questionEn: "How does the AI detector work?",
    answer:
      "Tizim matnni neyron tarmoq orqali tahlil qiladi va har bir paragrafdagi sun'iy intellekt yordamida yozilgan ehtimollikni qaytaradi.",
    answerRu:
      "Система анализирует текст через нейросеть и возвращает вероятность того, что каждый абзац сгенерирован ИИ.",
    answerEn:
      "The system analyses the text with a neural model and returns the probability that each paragraph was AI-generated.",
    order: 5,
  },
  {
    question: "Plagiat foizi qanday hisoblanadi?",
    questionRu: "Как считается процент плагиата?",
    questionEn: "How is the plagiarism percentage calculated?",
    answer:
      "Plagiat foizi = (boshqa manbalardan topilgan jumlalar) / (jami jumlalar) × 100. Originallik foizi = 100 − plagiat foizi.",
    answerRu:
      "Процент плагиата = (число найденных предложений) / (общее число предложений) × 100. Оригинальность = 100 − плагиат.",
    answerEn:
      "Plagiarism % = matched sentences / total sentences × 100. Originality = 100 − plagiarism %.",
    order: 6,
  },
  {
    question: "Hisobotni qanday yuklab olaman?",
    questionRu: "Как скачать отчёт?",
    questionEn: "How do I download a report?",
    answer: "Tekshirish natijasi sahifasidagi 'PDF yuklab olish' tugmasini bosing.",
    answerRu: "Нажмите кнопку «Скачать PDF» на странице результата.",
    answerEn: "Click the 'Download PDF' button on the result page.",
    order: 7,
  },
  {
    question: "Tarifni qanday yangilayman?",
    questionRu: "Как обновить тариф?",
    questionEn: "How do I upgrade my plan?",
    answer: "Profil → Tarif rejam bo'limidan yangi tarifni tanlang va to'lovni amalga oshiring.",
    answerRu: "В разделе «Тариф» выберите новый план и оплатите.",
    answerEn: "In the Subscription section choose a new plan and complete payment.",
    order: 8,
  },
  {
    question: "Korporativ akkount mavjudmi?",
    questionRu: "Есть ли корпоративный аккаунт?",
    questionEn: "Is there a corporate account?",
    answer: "Ha. Universitetlar va tashkilotlar uchun maxsus tarif mavjud. Aloqa formasi orqali murojaat qiling.",
    answerRu: "Да. Для университетов и организаций есть отдельный тариф. Обращайтесь через форму контакта.",
    answerEn: "Yes. We offer a special tariff for universities and organizations. Contact us via the form.",
    order: 9,
  },
  {
    question: "API integratsiya mavjudmi?",
    questionRu: "Есть ли API?",
    questionEn: "Is there an API?",
    answer: "Premium va korporativ tariflar uchun API kalitlari taqdim etiladi.",
    answerRu: "API доступен на Premium и корпоративных тарифах.",
    answerEn: "API is available on Premium and corporate plans.",
    order: 10,
  },
  {
    question: "Hisobotlarim qancha vaqt saqlanadi?",
    questionRu: "Сколько хранятся отчёты?",
    questionEn: "How long are reports stored?",
    answer: "Bepul tarifda 30 kun, Standartda 12 oy, Premiumda cheksiz.",
    answerRu: "Бесплатный — 30 дней, Стандарт — 12 месяцев, Premium — без ограничений.",
    answerEn: "Free — 30 days, Standard — 12 months, Premium — unlimited.",
    order: 11,
  },
  {
    question: "Plagiat tekshiruvi qancha vaqtda yakunlanadi?",
    questionRu: "Сколько занимает проверка?",
    questionEn: "How long does a check take?",
    answer: "Odatda 30 soniyadan 2 daqiqagacha — matn hajmiga bog'liq.",
    answerRu: "Обычно от 30 секунд до 2 минут в зависимости от объёма.",
    answerEn: "Usually 30 seconds to 2 minutes depending on text size.",
    order: 12,
  },
  {
    question: "AI detektor qanchalik aniq?",
    questionRu: "Насколько точен AI-детектор?",
    questionEn: "How accurate is the AI detector?",
    answer: "Bizning model real va AI matnlarni 92%+ aniqlikda farqlay oladi (uzbek va rus tillari uchun).",
    answerRu: "Модель различает реальный и AI текст с точностью более 92% (узбекский и русский).",
    answerEn: "The model distinguishes real and AI text with 92%+ accuracy (Uzbek and Russian).",
    order: 13,
  },
  {
    question: "Aloqaga chiqishning qanday yo'llari bor?",
    questionRu: "Как с вами связаться?",
    questionEn: "How can I contact you?",
    answer: "Telegram: @antiplag_uz, Email: info@antiplag.uz, Tel: +998 (71) 123-12-34",
    answerRu: "Telegram: @antiplag_uz, Email: info@antiplag.uz, Тел: +998 (71) 123-12-34",
    answerEn: "Telegram: @antiplag_uz, Email: info@antiplag.uz, Phone: +998 (71) 123-12-34",
    order: 14,
  },
  {
    question: "To'lovni qanday usullarda amalga oshirish mumkin?",
    questionRu: "Какие способы оплаты?",
    questionEn: "What are the payment methods?",
    answer: "Click, Payme, UzCard, Humo va xalqaro bank kartalari qabul qilinadi.",
    answerRu: "Click, Payme, UzCard, Humo и международные карты.",
    answerEn: "Click, Payme, UzCard, Humo, and international cards.",
    order: 15,
  },
];

const NEWS = [
  {
    title: "AntiPlag platformasi rasman ishga tushdi",
    titleRu: "Платформа AntiPlag официально запущена",
    titleEn: "AntiPlag platform officially launched",
    slug: "platforma-rasman-ishga-tushdi",
    content:
      "Bugun biz O'zbekistonning ilk milliy plagiat tekshirish platformasi — AntiPlag'ning rasmiy ishga tushirilganini e'lon qilamiz. Talabalar va olimlar endi o'z ishlarini tezda va ishonchli tarzda tekshirishlari mumkin.",
    contentRu:
      "Сегодня мы объявляем об официальном запуске первой национальной платформы для проверки на плагиат — AntiPlag.",
    contentEn: "Today we announce the official launch of Uzbekistan's first national plagiarism platform — AntiPlag.",
    image: null,
    published: true,
  },
  {
    title: "Yangilanish: AI detektor 2.0 ishga tushdi",
    titleRu: "Обновление: AI-детектор 2.0",
    titleEn: "Update: AI detector 2.0 is live",
    slug: "ai-detektor-2-0",
    content:
      "AI detektorimiz yanada aniqroq bo'ldi. Yangi modelimiz ChatGPT, Claude, Gemini kabi modellardan kelgan matnlarni 95% aniqlikda taniydi.",
    contentRu: "Наш AI-детектор стал точнее. Новая модель распознаёт тексты ChatGPT, Claude, Gemini с точностью 95%.",
    contentEn: "Our AI detector is now more accurate, recognizing text from ChatGPT, Claude, Gemini at 95% accuracy.",
    image: null,
    published: true,
  },
  {
    title: "Toshkent universitetlari bilan hamkorlik",
    titleRu: "Партнёрство с университетами Ташкента",
    titleEn: "Partnership with Tashkent universities",
    slug: "toshkent-universitetlari",
    content:
      "Bir qator yetakchi universitetlar bilan hamkorlik shartnomasi imzolandi. Endi ko'plab talabalar AntiPlag'dan bepul foydalanish imkoniyatiga ega.",
    contentRu: "Подписаны соглашения с ведущими университетами Ташкента. Многие студенты получают доступ бесплатно.",
    contentEn: "We signed partnerships with top Tashkent universities, granting free access to many students.",
    image: null,
    published: true,
  },
  {
    title: "Mobile ilova ishga tushadi",
    titleRu: "Скоро запуск мобильного приложения",
    titleEn: "Mobile app is coming soon",
    slug: "mobile-ilova",
    content: "Tez orada iOS va Android uchun mobile ilovamiz ishga tushadi. Hujjatni telefondan yuborishingiz mumkin bo'ladi.",
    contentRu: "Скоро запустим мобильное приложение для iOS и Android.",
    contentEn: "Our iOS and Android apps are launching soon.",
    image: null,
    published: true,
  },
  {
    title: "Premium tarifda yangi imkoniyatlar",
    titleRu: "Новые возможности Premium",
    titleEn: "New Premium plan features",
    slug: "premium-yangi-imkoniyatlar",
    content: "Premium foydalanuvchilarga endi cheksiz tekshirish, API integratsiya va shaxsiy yordam mavjud.",
    contentRu: "Premium теперь даёт безлимитные проверки, API и персональную поддержку.",
    contentEn: "Premium now includes unlimited checks, API access, and personal support.",
    image: null,
    published: true,
  },
];

const PARTNERS = [
  { name: "TUIT", logo: "https://placehold.co/200x80/4F46E5/ffffff?text=TUIT", url: "https://tuit.uz", order: 1 },
  { name: "INHA University", logo: "https://placehold.co/200x80/06B6D4/ffffff?text=INHA", url: "https://inha.uz", order: 2 },
  { name: "Westminster", logo: "https://placehold.co/200x80/10B981/ffffff?text=WIUT", url: "https://wiut.uz", order: 3 },
];

const SETTINGS = [
  { key: "site_name", value: "AntiPlag" },
  { key: "logo_url", value: "/logo.svg" },
  { key: "support_email", value: "info@antiplag.uz" },
  { key: "support_phone", value: "+998711231234" },
  { key: "telegram", value: "@antiplag_uz" },
];

async function main() {
  console.log("Seeding...");

  // Admin
  const adminEmail = "admin@antiplag.uz";
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", plan: "PREMIUM" },
    create: {
      name: "AntiPlag Admin",
      email: adminEmail,
      password: adminPasswordHash,
      role: "ADMIN",
      plan: "PREMIUM",
      checksLeft: 0,
    },
  });
  console.log("- admin user upserted: admin@antiplag.uz / Admin123!");

  // FAQ
  for (const f of FAQS) {
    await prisma.faq.upsert({
      where: { id: `faq-${f.order}` },
      update: f,
      create: { id: `faq-${f.order}`, ...f },
    });
  }
  console.log(`- ${FAQS.length} FAQs upserted`);

  // News
  for (const n of NEWS) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: n,
      create: n,
    });
  }
  console.log(`- ${NEWS.length} news upserted`);

  // Partners
  for (const p of PARTNERS) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (existing) await prisma.partner.update({ where: { id: existing.id }, data: p });
    else await prisma.partner.create({ data: p });
  }
  console.log(`- ${PARTNERS.length} partners upserted`);

  // Settings
  for (const s of SETTINGS) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`- ${SETTINGS.length} settings upserted`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
