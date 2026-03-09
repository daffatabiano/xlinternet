# XL Net — Platform Internet XL Marketing Sales

> Platform informasi dan pendaftaran internet XL yang modern, scalable, dan SEO-optimized.

---

## 🗂️ Struktur Proyek

```
xlnet/
├── frontend/                        # Next.js 14 App
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── site/                # Halaman publik
│   │   │   │   ├── provider/        # Halaman provider
│   │   │   │   ├── paket-internet/  # Daftar paket
│   │   │   │   ├── coverage-check/  # Cek coverage
│   │   │   │   ├── compare/         # Perbandingan
│   │   │   │   ├── blog/            # Blog & artikel
│   │   │   │   └── review/          # Ulasan pengguna
│   │   │   └── admin/               # Admin panel (protected)
│   │   │       ├── page.tsx         # Dashboard
│   │   │       ├── login/           # Login admin
│   │   │       ├── providers/       # CRUD provider
│   │   │       ├── packages/        # CRUD paket
│   │   │       ├── blog/            # CRUD blog
│   │   │       └── reviews/         # Moderasi ulasan
│   │   ├── components/
│   │   │   ├── ui/                  # Atomic UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx        # Input, Textarea, Select
│   │   │   │   └── StarRating.tsx
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── SiteLayout.tsx
│   │   │   ├── sections/            # Homepage sections
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── ProvidersSection.tsx
│   │   │   │   ├── PackagesSection.tsx
│   │   │   │   ├── CoverageSection.tsx
│   │   │   │   ├── CompareSection.tsx
│   │   │   │   ├── ReviewsSection.tsx
│   │   │   │   ├── BlogSection.tsx
│   │   │   │   └── CTASection.tsx
│   │   │   ├── shared/              # Reusable business components
│   │   │   │   ├── ProviderCard.tsx
│   │   │   │   ├── PackageCard.tsx
│   │   │   │   └── SectionHeader.tsx
│   │   │   └── admin/               # Admin-specific components
│   │   │       └── AdminLayout.tsx
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts        # Axios instance + interceptors
│   │   │   │   └── services.ts      # All API service functions
│   │   │   ├── hooks/
│   │   │   │   └── index.ts         # All React Query hooks
│   │   │   ├── types/
│   │   │   │   └── index.ts         # TypeScript interfaces
│   │   │   └── utils/
│   │   │       └── index.ts         # Helper functions
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── context/
│   │       └── QueryProvider.tsx
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── backend/                         # NestJS API
    ├── src/
    │   ├── main.ts                  # Entry point
    │   ├── app.module.ts            # Root module
    │   ├── config/
    │   │   ├── app.config.ts        # App configuration
    │   │   ├── prisma.service.ts    # Prisma client service
    │   │   └── prisma.module.ts     # Global Prisma module
    │   ├── modules/
    │   │   ├── auth/                # JWT Authentication
    │   │   │   ├── auth.module.ts
    │   │   │   ├── auth.service.ts
    │   │   │   ├── auth.controller.ts
    │   │   │   └── jwt.strategy.ts
    │   │   ├── providers/           # Provider CRUD
    │   │   │   ├── providers.module.ts
    │   │   │   ├── providers.service.ts
    │   │   │   ├── providers.controller.ts
    │   │   │   └── dto/
    │   │   ├── packages/            # Package CRUD
    │   │   ├── blog/                # Blog CRUD
    │   │   ├── reviews/             # Review moderation
    │   │   ├── coverage/            # Coverage checker
    │   │   └── dashboard/           # Dashboard stats
    │   └── common/
    │       ├── guards/              # JWT auth guard
    │       ├── filters/             # HTTP exception filter
    │       └── interceptors/        # Transform interceptor
    └── prisma/
        ├── schema.prisma            # Database schema
        └── seed.ts                  # Seed data
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourorg/xlnet.git
cd xlnet

# Install semua dependencies
npm install
```

### 2. Setup Database

```bash
cd backend

# Copy env file
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET di .env

# Generate Prisma client
npx prisma generate

# Jalankan migrasi
npx prisma migrate dev --name init

# Seed data awal (providers, packages, blog, reviews)
npm run db:seed
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL jika perlu
```

### 4. Jalankan Development

```bash
# Di root directory — jalankan semua sekaligus
npm run dev

# Atau terpisah:
cd backend  && npm run start:dev  # API: http://localhost:3001
cd frontend && npm run dev        # Web: http://localhost:3000
```

---

## 🔐 Admin Panel

**URL:** `http://localhost:3000/admin`

**Credential default (setelah seed):**
- Email: `admin@xlnet.id`
- Password: `admin123!`

**Ganti password setelah login pertama!**

---

## 📚 API Documentation

Swagger UI tersedia di: `http://localhost:3001/api/docs`

### Endpoint Utama

| Method | Endpoint                    | Akses  | Keterangan              |
|--------|-----------------------------|--------|-------------------------|
| POST   | `/api/auth/login`           | Public | Login admin             |
| GET    | `/api/providers`            | Public | Daftar provider         |
| GET    | `/api/providers/featured`   | Public | Provider unggulan       |
| GET    | `/api/providers/:slug`      | Public | Detail provider         |
| POST   | `/api/providers`            | Admin  | Tambah provider         |
| GET    | `/api/packages`             | Public | Daftar paket (filter)   |
| GET    | `/api/packages/featured`    | Public | Paket unggulan          |
| GET    | `/api/blog/published`       | Public | Artikel terbit          |
| POST   | `/api/blog`                 | Admin  | Tulis artikel           |
| POST   | `/api/reviews`              | Public | Submit review           |
| PATCH  | `/api/reviews/:id/approve`  | Admin  | Setujui review          |
| POST   | `/api/coverage/check`       | Public | Cek coverage area       |
| GET    | `/api/dashboard/stats`      | Admin  | Statistik dashboard     |

---

## 🗄️ Database Schema

```
AdminUser      — Admin pengelola CMS
Provider       — Provider internet XL
CoverageArea   — Area coverage per provider
Package        — Paket internet per provider
BlogCategory   — Kategori artikel blog
BlogPost       — Artikel blog dengan SEO meta
Review         — Ulasan pengguna (moderated)
```

---

## 🎨 Tech Stack

### Frontend
| Tech              | Versi  | Kegunaan                    |
|-------------------|--------|-----------------------------|
| Next.js           | 14.x   | SSR/SSG, routing, SEO       |
| React             | 18.x   | UI library                  |
| TypeScript        | 5.x    | Type safety                 |
| TailwindCSS       | 3.x    | Styling                     |
| Framer Motion     | 11.x   | Animasi                     |
| TanStack Query    | 5.x    | Server state & caching      |
| React Hook Form   | 7.x    | Form management             |
| Zod               | 3.x    | Schema validation           |
| Axios             | 1.x    | HTTP client                 |
| Lucide React      | 0.4x   | Icons                       |

### Backend
| Tech              | Versi  | Kegunaan                    |
|-------------------|--------|-----------------------------|
| NestJS            | 10.x   | Framework backend           |
| TypeScript        | 5.x    | Type safety                 |
| Prisma            | 5.x    | ORM + migrations            |
| PostgreSQL        | 14+    | Database                    |
| JWT (Passport)    | —      | Auth & authorization        |
| Swagger           | 7.x    | API documentation           |
| Bcrypt            | 5.x    | Password hashing            |
| Multer            | 1.x    | File uploads                |
| Helmet            | 7.x    | Security headers            |

---

## 🌐 SEO Features

- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG) untuk blog
- ✅ Dynamic metadata per halaman
- ✅ OpenGraph & Twitter Cards
- ✅ Schema.org JSON-LD (Organization, Product, Review, Article)
- ✅ Sitemap otomatis
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ SEO meta per blog post (CMS)
- ✅ Image optimization (Next.js Image)
- ✅ Core Web Vitals optimization

---

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway / Render / VPS)
```bash
cd backend
npm run build
npm start
```

### Environment Variables Production
```bash
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<32+ char random string>
FRONTEND_URL=https://xlnet.id

# Frontend
NEXT_PUBLIC_API_URL=https://api.xlnet.id
```

---

## 📊 CMS — Apa yang Bisa Dikelola Admin

| Entitas   | Aksi                                             |
|-----------|--------------------------------------------------|
| Provider  | Tambah, edit, hapus, aktifkan/nonaktifkan        |
| Paket     | Tambah, edit, hapus, atur featured/popular       |
| Blog      | Tulis, edit, publish/unpublish, hapus            |
| Ulasan    | Lihat, setujui, tolak, hapus                     |
| Coverage  | Tambah/hapus area per provider                   |

---

*Built with ❤️ for XL Axiata Marketing Sales Team*
