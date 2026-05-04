# AntiPlag — Milliy Antiplagiat Tizimi

Plagiat va sun'iy intellekt detektor xizmati. Next.js 14 + TypeScript + Tailwind + Prisma + NextAuth.

## Texnologiyalar

- **Next.js 14** (App Router, Server Components, Server Actions)
- **TypeScript strict mode**
- **Prisma ORM + PostgreSQL**
- **NextAuth.js** (Credentials, Google OAuth)
- **Tailwind CSS + shadcn/ui** komponentlari
- **next-intl** — UZ/RU/EN tillari
- **@react-pdf/renderer** — PDF hisobotlar
- **Framer Motion** animatsiyalar
- **Sonner** toast bildirishnomalar

## Imkoniyatlar

- Plagiat tekshirish (Google Custom Search API + demo fallback)
- Sun'iy intellekt detektori (OpenAI API + demo fallback)
- Fayl formatlari: `.doc`, `.docx`, `.pdf`, `.txt` (10 MB gacha)
- Foydalanuvchi paneli: tekshirishlar tarixi, profil, tarif boshqaruvi
- Admin panel: foydalanuvchilar, yangiliklar, FAQ, hamkorlar, sozlamalar
- 3 ta tarif rejasi (Bepul / Standart / Premium)
- 3 ta til (UZ asosiy, RU, EN)
- Dark / Light rejimi
- Mobile-first responsive dizayn

## Lokal ishga tushirish (development)

```bash
# 1. Dependencies
npm install

# 2. .env faylini yarating
cp .env.example .env
# DATABASE_URL ni o'zgartiring

# 3. Database tayyorlash
npx prisma migrate dev --name init
npm run db:seed     # admin@antiplag.uz / Admin123!

# 4. Dev serverni ishga tushirish
npm run dev
```

Sayt: http://localhost:3000

## Production deploy (Docker + Nginx + SSL)

### 1. Server tayyorlash (Ubuntu 22.04+)

```bash
# Docker o'rnatish
curl -fsSL https://get.docker.com | sh

# Loyihani klonlash
git clone https://github.com/Muhammaddiyor2002/antiplag.git /root/antiplag
cd /root/antiplag

# .env yaratish
cp .env.example .env
# Quyidagilarni to'g'ri qiymatlar bilan to'ldiring:
# - DATABASE_URL
# - POSTGRES_PASSWORD
# - NEXTAUTH_SECRET (kuchli random string: openssl rand -hex 32)
# - NEXTAUTH_URL (https://sizning-domeningiz.uz)
# - APP_URL
# Ixtiyoriy:
# - GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID
# - OPENAI_API_KEY
# - SMTP_*
```

### 2. Domain va DNS

Domeningizning A-yozuvini server IP manzilingizga yo'naltiring:
```
yourdomain.uz       A    YOUR_SERVER_IP
www.yourdomain.uz   A    YOUR_SERVER_IP
```

### 3. Birinchi ishga tushirish

```bash
docker compose up -d --build
docker compose logs -f app   # log'larni kuzatish
```

Endi `http://YOUR_SERVER_IP` orqali kira olasiz. Birinchi ishga tushirishda Prisma migratsiya va seed avtomatik bajariladi.

### 4. SSL (Let's Encrypt)

```bash
# Certbot o'rnatish
apt install -y certbot

# Sertifikat olish
certbot certonly --webroot -w /var/www/certbot -d yourdomain.uz -d www.yourdomain.uz

# nginx/conf.d/antiplag.conf da HTTPS bloki uncommentlanadi
# va yourdomain.uz almashtiriladi

docker compose restart nginx
```

### 5. Yangilanishlar

```bash
git pull
docker compose build app
docker compose up -d
```

## Strukturasi

```
src/
  app/
    (public)/         # ochiq sahifalar (home, about, faq, news, pricing, contact, guide, corporate)
    (auth)/           # login, register, forgot-password
    dashboard/        # foydalanuvchi paneli
    admin/            # admin paneli
    api/              # REST API endpoints
    layout.tsx
    globals.css
  components/
    ui/               # shadcn-style UI primitives
    layout/           # header, footer
    home/             # bosh sahifa bo'limlari
    dashboard/        # dashboard komponentlari
    admin/            # admin komponentlari
    common/           # umumiy
  lib/
    db.ts             # prisma client
    auth.ts           # NextAuth config
    plagiarism.ts     # plagiat tahlil (Google CSE + demo)
    ai-detector.ts    # AI detector (OpenAI + demo)
    parser.ts         # .doc/.docx/.pdf/.txt parser
    validations.ts    # Zod sxemalar
    utils.ts          # umumiy yordamchi funksiyalar
    constants.ts
  i18n/
    request.ts
  messages/           # uz.json, ru.json, en.json
  middleware.ts       # auth middleware

prisma/
  schema.prisma
  seed.ts             # admin + sample FAQ/news/partners

nginx/
  nginx.conf
  conf.d/antiplag.conf

Dockerfile
docker-compose.yml
```

## Default akkountlar

Seed bajarilgandan so'ng:
- **Admin**: `admin@antiplag.uz` / `Admin123!`

## Demo rejimi

API kalitlari (`GOOGLE_SEARCH_API_KEY`, `OPENAI_API_KEY`) bo'lmasa tizim demo rejimda ishlaydi:
- **Plagiat**: matn xeshidan deterministik tarzda hisoblangan natijalar
- **AI Detektor**: 20–95% oralig'ida deterministik tasodifiy ehtimollar

Bu siz API kalitlarini olishdan oldin loyihani sinash imkonini beradi.

## Litsenziya

MIT
