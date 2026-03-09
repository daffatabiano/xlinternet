# AGENT PROMPT: XL Net — Lanjutkan & Perbaiki Platform Lengkap
## Untuk: Claude Opus 4.6 Code Agent

---

## 🎯 KONTEKS PROYEK

Kamu adalah senior full-stack engineer yang melanjutkan development platform **XL Net** — website marketing sales resmi XL Axiata untuk produk internet rumah (XL Home Fiber, XL Gamer, XL Premium, XL Business).

**Tech Stack:**
- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, TanStack Query v5, React Hook Form + Zod, Lucide React
- **Backend:** NestJS 10, TypeScript, Prisma 5, PostgreSQL
- **Auth:** JWT (passport-jwt), bcrypt
- **Design System:** Custom TailwindCSS dengan warna XL Blue (#0057B8), font Sora + Plus Jakarta Sans

**Working Directory:** `xlnet/` (monorepo dengan `frontend/` dan `backend/`)

---

## 📁 STRUKTUR SAAT INI

```
xlnet/
├── frontend/src/
│   ├── app/
│   │   ├── page.tsx                    ✅ Homepage
│   │   ├── layout.tsx                  ✅ Root layout
│   │   └── admin/
│   │       ├── page.tsx                ✅ Dashboard
│   │       ├── login/page.tsx          ✅ Login admin
│   │       ├── providers/page.tsx      ✅ List providers
│   │       ├── providers/create/page.tsx ✅ Create provider
│   │       ├── blog/page.tsx           ✅ List blog
│   │       └── reviews/page.tsx        ✅ Moderasi reviews
│   ├── components/
│   │   ├── ui/          Button, Badge, Card, Input, StarRating
│   │   ├── layout/      Navbar, Footer, SiteLayout
│   │   ├── sections/    Hero, Providers, Packages, Coverage, Compare, Reviews, Blog, CTA
│   │   ├── shared/      ProviderCard, PackageCard, SectionHeader
│   │   └── admin/       AdminLayout
│   └── lib/
│       ├── api/         client.ts (axios), services.ts
│       ├── hooks/       index.ts (React Query hooks)
│       ├── types/       index.ts
│       └── utils/       index.ts
│
└── backend/src/
    ├── main.ts, app.module.ts
    ├── config/   prisma.service, prisma.module, app.config
    ├── modules/
    │   ├── auth/         login, refresh, me, register, change-password
    │   ├── providers/    CRUD + toggleActive + updateRating
    │   ├── packages/     CRUD + findFeatured + findByProvider
    │   ├── blog/         CRUD + publish/unpublish + categories
    │   ├── reviews/      CRUD + approve/reject + helpful
    │   ├── coverage/     check + getCities + addArea + removeArea
    │   └── dashboard/    stats + recentActivity
    └── common/   guards, filters, interceptors
```

**Halaman publik yang ADA di navbar/footer tapi BELUM dibuat (semua 404):**
- `/provider` — Daftar semua provider XL
- `/provider/[slug]` — Detail provider
- `/paket-internet` — Daftar semua paket internet
- `/paket-internet/[slug]` — Detail paket
- `/coverage-check` — Cek coverage area
- `/compare` — Perbandingan paket/provider
- `/blog` — Daftar blog
- `/blog/[slug]` — Detail artikel
- `/review` — Halaman ulasan pengguna
- `/about` — Tentang XL Net
- `/contact` — Kontak & Form
- `/faq` — FAQ
- `/status` — Status jaringan
- `/careers` — Karir (simple)
- `/kebijakan-privasi` — Kebijakan privasi
- `/syarat-dan-ketentuan` — Syarat & ketentuan
- Admin: `/admin/packages/page.tsx` — List paket
- Admin: `/admin/packages/create/page.tsx` — Create paket
- Admin: `/admin/providers/[id]/edit/page.tsx` — Edit provider
- Admin: `/admin/blog/create/page.tsx` — Create artikel
- Admin: `/admin/blog/[id]/edit/page.tsx` — Edit artikel

---

## 🔴 BUGS YANG HARUS DIPERBAIKI

### Bug #1: Import circular di hooks/index.ts
File `src/lib/hooks/index.ts` mengimport `useNavbarScroll` dari `@/lib/utils` padahal fungsi itu tidak ada di utils, melainkan di hooks itu sendiri. Ini akan menyebabkan runtime error.

**File:** `frontend/src/lib/hooks/index.ts`
**Bug:** `import { cn, useNavbarScroll } from '@/lib/utils'` — `useNavbarScroll` tidak ada di utils
**Fix:** Hapus import `useNavbarScroll` dari utils, karena sudah didefinisikan di hooks itu sendiri.

### Bug #2: Navbar import `useNavbarScroll` dari tempat yang salah
**File:** `frontend/src/components/layout/Navbar.tsx`
**Bug:** Ada dua import berbeda:
```ts
import { cn, useNavbarScroll } from '@/lib/utils'; // useNavbarScroll tidak ada di utils
import { useNavbarScroll as useScroll } from '@/lib/hooks'; // ini yang benar
```
**Fix:** Hapus baris pertama yang salah, gunakan import dari `@/lib/hooks` saja.

### Bug #3: DTO files tidak lengkap di backend
**File:** `backend/src/modules/providers/dto/create-provider.dto.ts`
**Bug:** File ini mendefinisikan `CreateProviderDto`, `UpdateProviderDto`, dan `ProviderFilterDto` dalam satu file tapi tidak ada export terpisah. `providers.service.ts` mengimport dari `./dto/update-provider.dto` dan `./dto/provider-filter.dto` yang tidak ada.
**Fix:** Buat file terpisah:
- `dto/create-provider.dto.ts`
- `dto/update-provider.dto.ts`
- `dto/provider-filter.dto.ts`

### Bug #4: `blog.service.ts` mengimport `UpdateBlogDto` yang tidak ada
**File:** `backend/src/modules/blog/blog.service.ts`
**Bug:** `export class UpdateBlogDto extends CreateBlogDto {}` — ini mengextend class yang baru saja didefinisikan di file yang sama, tidak menggunakan PartialType dari NestJS.
**Fix:** Buat DTO yang proper menggunakan `PartialType`.

### Bug #5: `packages.service.ts` — `PackageFilterDto` tidak di-export dengan benar
**File:** `backend/src/modules/packages/packages.service.ts`
**Bug:** `PackageFilterDto` didefinisikan di service file, padahal seharusnya ada di folder `dto/` terpisah agar bisa diimport di controller dan modul lain.
**Fix:** Pindahkan ke `dto/` folder.

### Bug #6: `coverage.service.ts` — query `distinct` pada relasi tidak valid di Prisma
**File:** `backend/src/modules/coverage/coverage.service.ts`
**Bug:** 
```ts
const coverageAreas = await this.prisma.coverageArea.findMany({
  ...
  distinct: ['providerId'], // OK
  include: { provider: { include: { packages: ... } } } // Nested include pada distinct bisa conflict
});
```
**Fix:** Gunakan query terpisah: pertama ambil providerIds yang cover area tersebut, kemudian ambil provider dengan packages-nya.

### Bug #7: `transform.interceptor.ts` — response shape tidak konsisten
**File:** `backend/src/common/interceptors/transform.interceptor.ts`
**Bug:** Ketika response dari service adalah array (misal `findFeatured()` return array langsung), interceptor tidak membungkusnya dengan benar karena tidak ada properti `meta`.
**Fix:** Tambahkan pengecekan apakah payload adalah array, dan wrap dengan `{ data: payload }`.

### Bug #8: `admin/providers/create/page.tsx` — `useDebounce` diimport dari utils tapi ada di hooks
**File:** `frontend/src/app/admin/providers/page.tsx` dan `admin/blog/page.tsx`
**Bug:** `import { formatIDR, useDebounce } from '@/lib/utils'` — `useDebounce` ada di `@/lib/hooks`, bukan utils.
**Fix:** Import `useDebounce` dari `@/lib/hooks`.

### Bug #9: `CompareSection.tsx` — `useFeaturedProviders`, `useBlogPosts`, `useReviews` tidak diimport dengan benar
**File:** `frontend/src/components/sections/CompareSection.tsx`
**Bug:** File ini adalah satu file yang berisi 4 exported components (`CompareSection`, `ReviewsSection`, `BlogSection`, `CTASection`) dan mengimport semua hooks di satu tempat, tapi beberapa hooks tidak termasuk dalam import statement.
**Fix:** Pastikan semua hooks (`useScrollReveal`, `useReviews`, `useBlogPosts`) diimport dari `@/lib/hooks`.

### Bug #10: `admin/reviews/page.tsx` — `reviewService.delete` tidak ada method delete di services.ts frontend
**File:** `frontend/src/lib/api/services.ts`
**Bug:** Ada method `delete` di `reviewService` tapi controller backend menggunakan endpoint `DELETE /reviews/:id` yang sudah benar. Pastikan method ini ada dan terhubung.

### Bug #11: Backend `blog.controller.ts` — route `GET /blog/:slug` akan konflik dengan `GET /blog/id/:id` dan `GET /blog/published`
**File:** `backend/src/modules/blog/blog.controller.ts`
**Bug:** NestJS routing: `GET /blog/published` akan ditangkap oleh `GET /blog/:slug` jika `findBySlug` didefinisikan sebelum `findPublished`. Express/Fastify matching adalah sequential.
**Fix:** Pastikan semua static routes (`/published`, `/categories`, `/id/:id`) didefinisikan SEBELUM dynamic route `/:slug`.

### Bug #12: `packages.controller.ts` — route konflik antara `GET /packages/featured` dan `GET /packages/:slug`
**Fix:** Sama seperti Bug #11, pindahkan static routes ke atas.

### Bug #13: Frontend `HeroSection.tsx` — memanggil `useCoverageCheck` dari hooks tapi juga mengimport `useNavbarScroll` dari utils yang salah
**Fix:** Pastikan semua imports benar.

### Bug #14: `AdminLayout.tsx` — `useRouter` dan `authService` tidak diimport dengan path yang benar
**File:** `frontend/src/components/admin/AdminLayout.tsx`
**Bug:** Ada kemungkinan import conflict antara dua AdminLayout (satu di components, satu di app).
**Fix:** Verifikasi dan pastikan path import konsisten.

---

## ✨ FITUR BARU YANG HARUS DIIMPLEMENTASIKAN

### FITUR 1: Sistem Leads & WhatsApp Integration

Ini adalah fitur **paling penting** untuk bisnis. Setiap user yang tertarik harus bisa langsung diarahkan ke WhatsApp sales XL.

#### 1A. Lead Model (Backend — Prisma Schema)
Tambahkan model `Lead` di `prisma/schema.prisma`:
```prisma
model Lead {
  id          String     @id @default(cuid())
  name        String
  phone       String
  email       String?
  city        String
  address     String?
  interest    String     // "xl-home-50", "xl-gamer-150", etc
  packageId   String?
  package     Package?   @relation(fields: [packageId], references: [id])
  providerId  String?
  provider    Provider?  @relation(fields: [providerId], references: [id])
  source      LeadSource @default(WEBSITE)
  status      LeadStatus @default(NEW)
  message     String?
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  ipAddress   String?
  userAgent   String?
  referrer    String?
  whatsappSent Boolean   @default(false)
  notes       String?
  assignedTo  String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([status])
  @@index([createdAt])
  @@index([phone])
  @@map("leads")
}

enum LeadSource {
  WEBSITE
  COVERAGE_CHECK
  PACKAGE_DETAIL
  COMPARE_PAGE
  BLOG
  POPUP
  WHATSAPP_BUTTON
  CONTACT_FORM
  STICKY_CTA
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  LOST
}
```

**Catatan:** Tambahkan relasi di `Package` dan `Provider`:
```prisma
// Di model Package
leads Lead[]

// Di model Provider  
leads Lead[]
```

#### 1B. Leads Module (Backend)
Buat module lengkap `backend/src/modules/leads/`:

**`leads.module.ts`** — Standard NestJS module

**`leads.service.ts`** — Methods:
- `create(dto, metadata)` — Simpan lead, return WhatsApp URL
- `findAll(filters)` — Paginated, filter by status/source/dateRange
- `findById(id)` — Detail lead
- `updateStatus(id, status, notes)` — Update status lead
- `delete(id)` — Soft delete atau hard delete
- `getStats()` — Stats leads: total, new today, converted, by source
- `generateWhatsAppUrl(phone, name, packageName, city)` — Generate WA link dengan template pesan

**WhatsApp Number Config:** Nomor WA sales XL bisa dikonfigurasi via environment variable `WHATSAPP_SALES_NUMBER` (default: `6281709998817`).

**Template pesan WhatsApp:**
```
Halo, saya [nama] dari [kota]. Saya tertarik dengan paket [nama paket]. 
Boleh saya mendapatkan informasi lebih lanjut?
```

**`leads.controller.ts`** — Endpoints:
- `POST /api/leads` — Public, submit lead
- `GET /api/leads` — Admin only, list semua leads
- `GET /api/leads/stats` — Admin only, statistik leads
- `GET /api/leads/:id` — Admin only, detail lead
- `PATCH /api/leads/:id/status` — Admin only, update status
- `DELETE /api/leads/:id` — Admin only, hapus lead

#### 1C. Frontend Lead Capture Components

**`src/components/shared/WhatsAppButton.tsx`** — Floating WhatsApp button:
- Fixed position, bottom-right
- Green bubble dengan ikon WhatsApp
- Pulse animation
- Onclick: buka wa.me link dengan pesan pre-filled
- Props: `packageName?`, `providerName?`

**`src/components/shared/LeadCaptureForm.tsx`** — Form capture lead:
- Fields: Nama, Nomor HP, Kota, Paket yang Diminati (optional)
- Validation dengan Zod
- Submit → POST /api/leads → Redirect ke WhatsApp
- Loading state, error state
- Desain menarik dengan gradient brand

**`src/components/shared/LeadModal.tsx`** — Modal popup lead capture:
- Trigger setelah user di halaman 30 detik (atau scroll 60%)
- Dismissable
- Gunakan LeadCaptureForm di dalamnya
- Cookie-based: jangan tampilkan lagi jika sudah dismiss dalam 24 jam
- Judul: "Mau Internet XL? Konsultasi Gratis!"

**`src/components/shared/StickyLeadBar.tsx`** — Sticky bottom bar:
- Muncul setelah scroll 300px
- Dismissable dengan tanda X
- "Pasang XL Internet Sekarang — Gratis Konsultasi" + tombol WhatsApp + tombol Daftar
- Jangan tampilkan di halaman admin

**`src/components/sections/LeadSection.tsx`** — Section form di homepage:
- Background gradient gelap (navy/violet)
- Judul: "Konsultasi Gratis dengan Tim XL"
- Subtitle: "Ceritakan kebutuhan internet Anda, kami bantu pilihkan paket terbaik"
- Embed LeadCaptureForm
- Tampilkan nomor WA dan jam operasional

#### 1D. Visitor Tracking (Basic)
Tambahkan endpoint `POST /api/leads/track-visit` untuk mencatat page visit (anonymous), termasuk:
- `page` (URL path)
- `referrer`
- `userAgent`
- `ipAddress`

Ini untuk dashboard analytics sederhana.

---

### FITUR 2: Halaman Publik yang Belum Ada

#### 2A. `/provider` — Daftar Provider
**File:** `frontend/src/app/provider/page.tsx`

- Fetch dari `GET /api/providers` dengan pagination
- Filter by: Tipe (fiber/wireless), Rating minimum, Kota
- Sort: Rating, Harga, Coverage
- Grid 2-4 kolom menggunakan ProviderCard yang sudah ada
- Skeleton loading state
- Empty state jika tidak ada hasil
- Breadcrumb navigation
- SEO metadata

#### 2B. `/provider/[slug]` — Detail Provider
**File:** `frontend/src/app/provider/[slug]/page.tsx`

- Fetch dari `GET /api/providers/:slug`
- Sections:
  1. **Hero Provider** — Logo besar, nama, rating, kota coverage, CTA "Lihat Paket"
  2. **Packages List** — Semua paket provider ini, sortable
  3. **Coverage Map** — Daftar kota yang di-cover (grid/list)
  4. **Provider Pros & Cons** — Dua kolom kelebihan/kekurangan
  5. **Reviews** — Ulasan pengguna untuk provider ini
  6. **Submit Review Form** — Form kirim review langsung
  7. **WhatsApp CTA** — Tombol "Hubungi Sales" yang redirect ke WA
- Schema.org JSON-LD untuk LocalBusiness
- Dynamic SEO metadata

#### 2C. `/paket-internet` — Daftar Paket
**File:** `frontend/src/app/paket-internet/page.tsx`

- Fetch dari `GET /api/packages` dengan pagination
- Filter sidebar/top:
  - Kategori: Semua, Basic, Standard, Premium, Gaming, Business
  - Harga: Range slider (0 - 2jt)
  - Kecepatan: Pilihan (30, 50, 100, 150, 300, 500, 1000+ Mbps)
  - Kontrak: Semua, Tanpa Kontrak, 12 Bulan, 24 Bulan
  - Kota (select)
- Sort: Termurah, Tercepat, Terpopuler
- Grid PackageCard
- Pagination
- URL params untuk filter (shareable URL)
- SEO metadata

#### 2D. `/paket-internet/[slug]` — Detail Paket
**File:** `frontend/src/app/paket-internet/[slug]/page.tsx`

- Fetch dari `GET /api/packages/:slug`
- Sections:
  1. **Hero** — Nama paket, provider, kecepatan besar, harga, CTA
  2. **Detail specs** — Semua spesifikasi teknis
  3. **Features list** — Daftar fitur lengkap
  4. **Comparison mini** — Bandingkan dengan paket lain dari provider yang sama
  5. **Lead Form** — Form "Saya Tertarik" yang submit lead
  6. **Reviews** — Ulasan spesifik paket ini
- Breadcrumb: Beranda > Paket Internet > [nama paket]
- Schema.org JSON-LD untuk Product + Offer
- Dynamic SEO

#### 2E. `/coverage-check` — Cek Coverage
**File:** `frontend/src/app/coverage-check/page.tsx`

- Hero section dengan form cek coverage (address, kota, kode pos)
- Pada submit: POST /api/coverage/check
- **Result state:**
  - ✅ **Tersedia:** Tampilkan provider yang cover area, dengan paket-paketnya
  - ❌ **Tidak tersedia:** Tampilkan form "Daftarkan email untuk notifikasi"
  - Jika tersedia: Tombol "Pasang Sekarang" → buka LeadCaptureForm pre-filled
- Tambahkan section daftar kota yang sudah di-cover (grid)
- Map visual sederhana (bisa SVG Indonesia atau just grid kota)
- SEO metadata

#### 2F. `/compare` — Perbandingan
**File:** `frontend/src/app/compare/page.tsx`

- Dua mode: **Bandingkan Paket** dan **Bandingkan Provider**
- Pilih hingga 4 item untuk dibandingkan
- Tabel perbandingan detail dengan highlight nilai terbaik (hijau)
- Untuk paket: speed, price, contract, installation, latency, features, rating
- Untuk provider: rating, coverage, min price, max speed, review count
- Tombol "Pilih Paket Ini" → lead form
- Share comparison via URL params
- SEO metadata

#### 2G. `/blog` — Daftar Blog
**File:** `frontend/src/app/blog/page.tsx`

- Fetch dari `GET /api/blog/published`
- Featured post (artikel terbaru/terpopuler) — besar di atas
- Grid artikel lainnya
- Filter by kategori (pills)
- Search artikel
- Pagination
- SEO metadata

#### 2H. `/blog/[slug]` — Detail Artikel
**File:** `frontend/src/app/blog/[slug]/page.tsx`

- Fetch dari `GET /api/blog/:slug`
- Layout dua kolom: konten kiri (70%), sidebar kanan (30%)
- Konten: Render markdown/HTML dengan prose styling
- Sidebar: Artikel terkait, CTA WhatsApp, Paket populer
- Share buttons (WhatsApp, Twitter, copy link)
- Reading progress bar
- Schema.org Article JSON-LD
- Dynamic SEO (seoTitle, seoDescription dari CMS)
- Related posts dari `GET /api/blog/:id/related`

#### 2I. `/review` — Halaman Ulasan
**File:** `frontend/src/app/review/page.tsx`

- Summary rating per provider (top section)
- Filter: by provider, by rating (bintang), by tanggal
- Grid ulasan
- Form submit ulasan baru (bottom section)
- Modal konfirmasi setelah submit: "Ulasan Anda sedang diverifikasi"
- Pagination
- SEO metadata

#### 2J. `/about` — Tentang XL Net
**File:** `frontend/src/app/about/page.tsx`

- Hero section
- Cerita tentang platform (marketing content)
- Statistik: 50K+ pelanggan, 300+ kota, 99.9% uptime, dll
- Tim/Values section
- Mitra/Partner section
- CTA Contact
- SEO metadata

#### 2K. `/contact` — Kontak
**File:** `frontend/src/app/contact/page.tsx`

- Form kontak dengan fields: Nama, Email, HP, Kota, Topik, Pesan
- Submit → POST /api/leads dengan source=CONTACT_FORM
- Setelah submit: Tampilkan nomor WA + redirect option
- Info kontak: WA, Telepon, Email, Jam operasional
- SEO metadata

#### 2L. `/faq` — FAQ
**File:** `frontend/src/app/faq/page.tsx`

- Accordion FAQ yang bisa expand/collapse
- Kategorikan per topik: Pendaftaran, Teknis, Billing, Coverage, Umum
- Search FAQ
- Di bawah: CTA "Tidak menemukan jawaban? Chat dengan kami"
- SEO metadata

#### 2M. `/status` — Status Jaringan
**File:** `frontend/src/app/status/page.tsx`

- Static page dengan informasi status (bisa dummy/placeholder)
- Tampilkan status per region
- Link ke customer service

#### 2N. `/careers` — Karir
**File:** `frontend/src/app/careers/page.tsx`

- Simple page: "Bergabunglah dengan Tim XL"
- Redirect ke xl.co.id/careers atau WhatsApp HR

#### 2O. `/kebijakan-privasi` dan `/syarat-dan-ketentuan`
- Static legal pages dengan content placeholder

---

### FITUR 3: Admin Pages yang Belum Ada

#### 3A. `/admin/packages/page.tsx` — List Packages
Mirip dengan admin providers list, dengan columns: Nama, Provider, Speed, Harga, Kategori, Status, Aksi

#### 3B. `/admin/packages/create/page.tsx` — Create Package
Form create paket dengan semua fields. Provider select mengambil dari `/api/providers`.

#### 3C. `/admin/providers/[id]/edit/page.tsx` — Edit Provider
Pre-fill form dengan data existing provider.

#### 3D. `/admin/blog/create/page.tsx` — Create Blog Post
Form lengkap dengan:
- Title, Slug (auto-generate dari title)
- Rich text area untuk Content
- Category select
- Tags input (comma-separated)
- SEO fields: meta title, description, keywords
- Featured image upload
- Toggle publish/draft
- Preview button

#### 3E. `/admin/blog/[id]/edit/page.tsx` — Edit Blog Post
Pre-fill form create dengan data existing.

#### 3F. `/admin/leads/page.tsx` — Manajemen Leads ⭐ BARU
- Tabel semua leads dengan filter status
- Stats: Total, Baru Hari Ini, Dalam Proses, Converted
- Actions per lead: Update status, Hubungi via WA, Hapus
- Export CSV (bonus)
- Real-time badge jika ada lead baru (polling setiap 30 detik)

---

### FITUR 4: Perbaikan & Enhancement Halaman Admin Existing

#### 4A. Admin Packages — hanya ada di list/create, belum ada edit
Tambahkan `admin/packages/[id]/edit/page.tsx`

#### 4B. Admin Dashboard — tambahkan Leads Statistics
Di `admin/page.tsx`, tambahkan card untuk:
- Total Leads
- Leads Hari Ini
- Conversion Rate
- Chart sederhana leads per hari (7 hari terakhir) menggunakan Recharts

---

## 🧪 TESTING AUTOMATION

### Setup Testing

#### Backend — Jest + Supertest
**Install dev dependencies:**
```bash
cd backend
npm install --save-dev @nestjs/testing supertest @types/supertest jest-mock-extended
```

**Buat file test berikut:**

#### `backend/test/auth.e2e-spec.ts`
Test cases:
- POST /api/auth/login dengan credential valid → return tokens
- POST /api/auth/login dengan credential invalid → 401
- POST /api/auth/login dengan email tidak ada → 401
- GET /api/auth/me dengan valid token → return user data
- GET /api/auth/me tanpa token → 401
- POST /api/auth/refresh dengan valid refresh token → new access token
- POST /api/auth/refresh dengan invalid token → 401

#### `backend/test/providers.e2e-spec.ts`
Test cases:
- GET /api/providers → return paginated list
- GET /api/providers/featured → return featured providers
- GET /api/providers/:slug dengan slug valid → return provider detail dengan packages dan reviews
- GET /api/providers/:slug dengan slug tidak ada → 404
- POST /api/providers tanpa auth → 401
- POST /api/providers dengan auth valid → create provider, return 201
- POST /api/providers dengan duplicate slug → 409 ConflictException
- PUT /api/providers/:id dengan auth → update provider
- PATCH /api/providers/:id/toggle-active → toggle isActive
- DELETE /api/providers/:id dengan auth → delete, return 204

#### `backend/test/packages.e2e-spec.ts`
Test cases:
- GET /api/packages → return paginated list
- GET /api/packages?category=gaming → filter by category
- GET /api/packages?minPrice=200000&maxPrice=400000 → filter by price range
- GET /api/packages?sortBy=price → sort by price ascending
- GET /api/packages/featured → return featured packages
- GET /api/packages/:slug → return package dengan provider data
- GET /api/packages/provider/:providerId → return packages by provider
- POST /api/packages dengan auth → create package
- POST /api/packages dengan providerId tidak valid → 404
- PUT /api/packages/:id → update package
- DELETE /api/packages/:id → delete package

#### `backend/test/reviews.e2e-spec.ts`
Test cases:
- GET /api/reviews/approved → return approved reviews only
- POST /api/reviews → create review, isApproved=false by default
- POST /api/reviews dengan rating < 1 → 400 BadRequest
- POST /api/reviews dengan providerId tidak valid → 404
- PATCH /api/reviews/:id/approve tanpa auth → 401
- PATCH /api/reviews/:id/approve dengan auth → approve review, update provider rating
- PATCH /api/reviews/:id/reject dengan auth → set isApproved=false
- DELETE /api/reviews/:id dengan auth → delete, update provider rating
- PATCH /api/reviews/:id/helpful → increment helpfulCount

#### `backend/test/blog.e2e-spec.ts`
Test cases:
- GET /api/blog/published → return published posts only
- GET /api/blog/categories → return blog categories
- GET /api/blog/:slug → return post detail + increment viewCount
- GET /api/blog/:slug dengan slug tidak ada → 404
- POST /api/blog tanpa auth → 401
- POST /api/blog dengan auth → create post, isPublished=false by default
- PATCH /api/blog/:id/publish → set isPublished=true, set publishedAt
- PATCH /api/blog/:id/unpublish → set isPublished=false
- GET /api/blog/:id/related → return related posts by same category

#### `backend/test/coverage.e2e-spec.ts`
Test cases:
- POST /api/coverage/check dengan kota valid → return providers tersedia
- POST /api/coverage/check dengan kota tidak ada di database → return empty availableProviders
- GET /api/coverage/cities → return list kota unik
- POST /api/coverage/areas/:providerId tanpa auth → 401
- POST /api/coverage/areas/:providerId dengan auth → add coverage areas

#### `backend/test/leads.e2e-spec.ts`
Test cases:
- POST /api/leads → create lead, return whatsapp_url
- POST /api/leads dengan phone tidak valid → 400
- POST /api/leads tanpa name → 400
- GET /api/leads tanpa auth → 401
- GET /api/leads dengan auth → return paginated leads
- GET /api/leads/stats dengan auth → return statistics
- PATCH /api/leads/:id/status dengan auth → update status
- DELETE /api/leads/:id dengan auth → delete lead

#### `backend/test/setup.ts` — Global test setup
```typescript
// Setup database test (gunakan database terpisah atau prisma mock)
// Seed minimal data untuk testing
// Teardown setelah semua test selesai
```

#### Frontend — Jest + React Testing Library
**Install:**
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

**`frontend/src/__tests__/components/Button.test.tsx`**
- Render correctly dengan berbagai variant
- Click handler dipanggil
- Loading state menampilkan spinner
- Disabled state mencegah click

**`frontend/src/__tests__/components/PackageCard.test.tsx`**
- Render dengan props lengkap
- Tampilkan harga dengan format IDR yang benar
- Tampilkan speed dengan format yang benar
- Badge "Terpopuler" muncul jika isPopular=true
- Callback onSelect dipanggil saat click button

**`frontend/src/__tests__/components/LeadCaptureForm.test.tsx`**
- Render form dengan fields yang benar
- Validation: submit tanpa name → error message
- Validation: nomor HP invalid → error message
- Submit form valid → loading state → redirect to WhatsApp URL

**`frontend/src/__tests__/utils/formatIDR.test.ts`**
- `formatIDR(199000)` → "Rp199.000"
- `formatIDR(199000, true)` → "Rp199rb"
- `formatIDR(1500000, true)` → "Rp1.5jt"
- `formatIDR(0)` → "Rp0"

**`frontend/src/__tests__/utils/formatDate.test.ts`**
- `formatDate('2024-01-15', 'short')` → format tanggal pendek Indonesia
- `formatDate('2024-01-15', 'long')` → format tanggal panjang Indonesia
- `formatDate` dengan tanggal hari ini + relative → "Hari ini"
- `formatDate` dengan tanggal kemarin + relative → "Kemarin"

**`frontend/src/__tests__/utils/contractLabel.test.ts`**
- `contractLabel(0)` → "Tanpa Kontrak"
- `contractLabel(12)` → "1 Tahun"
- `contractLabel(24)` → "2 Tahun"
- `contractLabel(6)` → "6 Bulan"

---

## 📋 CHECKLIST IMPLEMENTASI LENGKAP

Setelah semua pekerjaan selesai, pastikan setiap item berikut ✅:

### Bug Fixes
- [ ] Bug #1: Import circular di hooks/index.ts — hapus `useNavbarScroll` dari utils import
- [ ] Bug #2: Navbar import salah — fix import path
- [ ] Bug #3: DTO files backend — buat file terpisah yang benar
- [ ] Bug #4: Blog UpdateBlogDto — gunakan PartialType
- [ ] Bug #5: PackageFilterDto — pindah ke dto/ folder
- [ ] Bug #6: Coverage distinct query — refactor query
- [ ] Bug #7: Transform interceptor — handle array response
- [ ] Bug #8: useDebounce import salah di admin pages
- [ ] Bug #9: CompareSection hooks import
- [ ] Bug #10: reviewService.delete di frontend
- [ ] Bug #11: Blog controller route order
- [ ] Bug #12: Packages controller route order
- [ ] Bug #13: HeroSection imports
- [ ] Bug #14: AdminLayout imports

### Fitur Baru — Backend
- [ ] Lead model + migration
- [ ] Lead module (module, service, controller, DTO)
- [ ] WhatsApp URL generator
- [ ] Visitor tracking endpoint
- [ ] Lead statistics endpoint
- [ ] Dashboard stats tambah leads count
- [ ] Tambah `leads` module ke `app.module.ts`

### Fitur Baru — Frontend Components
- [ ] `WhatsAppButton.tsx` — floating WA button
- [ ] `LeadCaptureForm.tsx` — form dengan WA redirect
- [ ] `LeadModal.tsx` — popup dengan trigger
- [ ] `StickyLeadBar.tsx` — sticky bottom bar
- [ ] `LeadSection.tsx` — section di homepage
- [ ] Tambahkan `LeadSection` ke homepage `page.tsx`
- [ ] Tambahkan `WhatsAppButton` ke `SiteLayout.tsx`
- [ ] Tambahkan `StickyLeadBar` ke `SiteLayout.tsx`
- [ ] Tambahkan lead service ke `services.ts`
- [ ] Tambahkan lead hooks ke `hooks/index.ts`
- [ ] Tambahkan Lead types ke `types/index.ts`

### Halaman Publik Baru
- [ ] `/provider` — list provider
- [ ] `/provider/[slug]` — detail provider
- [ ] `/paket-internet` — list paket
- [ ] `/paket-internet/[slug]` — detail paket
- [ ] `/coverage-check` — cek coverage
- [ ] `/compare` — perbandingan
- [ ] `/blog` — list blog
- [ ] `/blog/[slug]` — detail artikel
- [ ] `/review` — halaman ulasan
- [ ] `/about` — tentang
- [ ] `/contact` — kontak
- [ ] `/faq` — FAQ
- [ ] `/status` — status jaringan
- [ ] `/careers` — karir
- [ ] `/kebijakan-privasi` — legal
- [ ] `/syarat-dan-ketentuan` — legal

### Halaman Admin Baru
- [ ] `/admin/packages` — list packages
- [ ] `/admin/packages/create` — create package
- [ ] `/admin/packages/[id]/edit` — edit package
- [ ] `/admin/providers/[id]/edit` — edit provider
- [ ] `/admin/blog/create` — create blog post
- [ ] `/admin/blog/[id]/edit` — edit blog post
- [ ] `/admin/leads` — manajemen leads
- [ ] Update dashboard dengan lead stats + chart

### Testing
- [ ] Backend e2e: auth
- [ ] Backend e2e: providers
- [ ] Backend e2e: packages
- [ ] Backend e2e: reviews
- [ ] Backend e2e: blog
- [ ] Backend e2e: coverage
- [ ] Backend e2e: leads
- [ ] Frontend unit: Button
- [ ] Frontend unit: PackageCard
- [ ] Frontend unit: LeadCaptureForm
- [ ] Frontend unit: utils (formatIDR, formatDate, contractLabel)
- [ ] `jest.config.js` untuk frontend dan backend

---

## 🏗️ PANDUAN IMPLEMENTASI

### Urutan Pengerjaan yang Disarankan

1. **Pertama: Perbaiki semua bug** — ini akan membuat project bisa run tanpa error
2. **Kedua: Backend leads module** — karena halaman frontend butuh API ini
3. **Ketiga: Leads frontend components** — WhatsApp button, form, modal, sticky bar
4. **Keempat: Halaman publik** — mulai dari yang paling penting: /provider, /paket-internet, /coverage-check, /blog, /review
5. **Kelima: Halaman admin baru** — leads management, packages admin, edit pages
6. **Keenam: Pages pendukung** — /about, /contact, /faq, /status, /careers, legal pages
7. **Ketujuh: Testing** — tulis semua test setelah fitur selesai

### Konvensi Kode yang HARUS Diikuti

```typescript
// ✅ BENAR: Gunakan cn() untuk conditional classes
className={cn('base-class', condition && 'conditional-class', className)}

// ✅ BENAR: Import dari barrel files
import { Button, Badge, Card } from '@/components/ui';
// (buat index.ts di setiap folder komponen)

// ✅ BENAR: Typed API responses
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: () => service.method(),
});

// ✅ BENAR: Error handling dengan toast
onError: (error: any) => {
  toast.error(error?.response?.data?.message ?? 'Terjadi kesalahan');
}

// ✅ BENAR: Form dengan react-hook-form + zod
const schema = z.object({ ... });
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

// ❌ SALAH: Jangan gunakan HTML <form> tag di React artifacts
// ❌ SALAH: Jangan hardcode URLs
// ❌ SALAH: Jangan skip TypeScript types (no 'any' kecuali terpaksa)
```

### Pattern untuk WhatsApp URL
```typescript
// Nomor: 6281709998817 (tanpa +)
// Template pesan harus di-encode dengan encodeURIComponent
export function generateWhatsAppUrl(params: {
  name: string;
  city: string;
  packageName?: string;
  phone?: string; // nomor sales
}): string {
  const salesNumber = process.env.NEXT_PUBLIC_WA_SALES || '6281709998817';
  const message = encodeURIComponent(
    `Halo, saya ${params.name} dari ${params.city}.${params.packageName ? ` Saya tertarik dengan paket ${params.packageName}.` : ''} Boleh saya mendapatkan informasi lebih lanjut?`
  );
  return `https://wa.me/${salesNumber}?text=${message}`;
}
```

### Pattern untuk Lead Form Submit
```typescript
// 1. Submit form → POST /api/leads → dapatkan response dengan whatsapp_url
// 2. Simpan lead ke database
// 3. Return URL WA ke frontend
// 4. Frontend redirect user ke WA URL
// 5. Tampilkan toast "Anda akan diarahkan ke WhatsApp..."
```

### Environment Variables yang Dibutuhkan
```bash
# Backend .env
WHATSAPP_SALES_NUMBER=6281709998817
WHATSAPP_SALES_NAME="Tim Sales XL"

# Frontend .env.local
NEXT_PUBLIC_WA_SALES=6281709998817
NEXT_PUBLIC_WA_BUSINESS=6281709998817
```

### Desain Guide
- Gunakan warna brand: `brand-blue (#0057B8)`, `brand-violet (#6D28D9)`, `brand-green (#10B981)`
- WhatsApp button: `#25D366` (warna resmi WA)
- Semua card menggunakan `rounded-2xl border border-neutral-200 bg-white`
- Animasi masuk menggunakan Framer Motion: `initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}`
- Hover card: `hover:-translate-y-1 hover:shadow-card-lg transition-all duration-300`
- Semua section publik menggunakan `<SiteLayout>` wrapper
- Skeleton loading untuk semua async data
- Mobile-first responsive design

---

## ⚠️ PERHATIAN KHUSUS

1. **Jangan break existing features** — Setiap perubahan pada file existing harus backward compatible

2. **Prisma migration** — Setiap perubahan schema HARUS disertai migration file. Gunakan:
   ```bash
   npx prisma migrate dev --name add_leads_table
   ```

3. **Seed data leads** — Tambahkan beberapa leads dummy di `prisma/seed.ts` untuk testing admin dashboard

4. **Route guards admin** — Semua halaman admin (kecuali /admin/login) harus check token di localStorage. Jika tidak ada, redirect ke /admin/login. Buat `AdminAuthGuard` component atau middleware Next.js.

5. **Error boundaries** — Tambahkan error boundary di root layout untuk catch runtime errors

6. **Loading states** — Setiap halaman yang fetch data HARUS punya loading skeleton, bukan spinner kosong

7. **Empty states** — Setiap list yang bisa kosong HARUS punya empty state yang informatif dengan CTA

8. **SEO untuk dynamic pages** — Gunakan `generateMetadata()` function Next.js untuk semua halaman dynamic

9. **TypeScript strict mode** — Jangan disable TypeScript. Jika ada error type, fix dengan benar

10. **Relasi database** — Setiap kali hapus Provider, pastikan cascade delete ke: Packages, Reviews, CoverageAreas, Leads. Ini sudah di-set di schema tapi verifikasi ulang.

11. **Nomor WA format** — Selalu gunakan format internasional tanpa tanda + untuk wa.me link: `62XXXXXXXXXX`

12. **Mobile responsiveness** — Test semua halaman di viewport 375px (mobile), 768px (tablet), 1280px (desktop)

---

## 🎁 BONUS FEATURES (jika waktu memungkinkan)

- **Perbandingan URL sharing** — `/compare?packages=xl-home-100,xl-gamer-150` → load pre-selected
- **WhatsApp share button** di setiap PackageCard: "Bagikan ke WA"
- **Print/PDF paket** — Button print detail paket
- **Breadcrumb component** — Reusable breadcrumb di semua halaman
- **Back to top button** — Floating button untuk scroll ke atas
- **Reading progress bar** — Di halaman blog detail
- **Search global** — Searchbar di navbar untuk cari paket/artikel
- **Promo banner** — Banner promosi dismissable di top navbar

---

*Selesaikan semua task di atas dengan kualitas production-ready. Pastikan semua import path benar, TypeScript types lengkap, dan tidak ada console.error yang muncul saat runtime. Good luck! 🚀*