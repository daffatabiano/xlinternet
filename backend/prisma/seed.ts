import { PrismaClient, PackageCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123!', 12);
  const admin = await prisma.adminUser.upsert({
    where:  { email: 'admin@xlnet.id' },
    update: {},
    create: { name: 'Super Admin', email: 'admin@xlnet.id', passwordHash, role: 'SUPER_ADMIN' },
  });
  console.log('✅ Admin user:', admin.email);

  // ── Blog Categories ────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.blogCategory.upsert({ where: { slug: 'panduan'     }, update: {}, create: { name: 'Panduan',     slug: 'panduan',     description: 'Panduan lengkap internet',  color: '#0057B8' } }),
    prisma.blogCategory.upsert({ where: { slug: 'tutorial'    }, update: {}, create: { name: 'Tutorial',    slug: 'tutorial',    description: 'Tutorial step-by-step',     color: '#10B981' } }),
    prisma.blogCategory.upsert({ where: { slug: 'review'      }, update: {}, create: { name: 'Review',      slug: 'review',      description: 'Review provider & paket',   color: '#7C3AED' } }),
    prisma.blogCategory.upsert({ where: { slug: 'tips'        }, update: {}, create: { name: 'Tips',        slug: 'tips',        description: 'Tips internet rumah',       color: '#F59E0B' } }),
    prisma.blogCategory.upsert({ where: { slug: 'perbandingan'}, update: {}, create: { name: 'Perbandingan',slug: 'perbandingan',description: 'Perbandingan paket & provider',color: '#EF4444'} }),
  ]);
  console.log('✅ Blog categories:', categories.length);

  // ── Providers ──────────────────────────────────────────────────────────────
  const xlHomeFiber = await prisma.provider.upsert({
    where:  { slug: 'xl-home-fiber' },
    update: {},
    create: {
      name:        'XL Home Fiber',
      slug:        'xl-home-fiber',
      description: 'Internet fiber optik XL untuk keluarga Indonesia. Kecepatan stabil, harga terjangkau, coverage luas, dan layanan 24 jam.',
      tagline:     'Rumah Bahagia, Internet Kencang',
      type:        'FIBER',
      minPrice:    199000,
      maxSpeed:    1000,
      rating:      4.4,
      reviewCount: 18420,
      website:     'https://xl.co.id/home',
      phone:       '817',
      isFeatured:  true,
      isActive:    true,
      features:    ['Unlimited tanpa FUP', 'Gratis instalasi', 'Router WiFi gratis', 'Support 24/7'],
      pros:        ['Coverage terluas', 'Harga terjangkau', 'Stabil', 'Gratis instalasi'],
      cons:        ['Kontrak 12 bulan', 'Latency bervariasi saat peak hour'],
    },
  });

  const xlGamer = await prisma.provider.upsert({
    where:  { slug: 'xl-home-gamer' },
    update: {},
    create: {
      name:        'XL Home Gamer',
      slug:        'xl-home-gamer',
      description: 'Paket khusus gamer dengan latency ultra-rendah, bandwidth dedicated, dan gaming priority traffic.',
      tagline:     'Main Tanpa Lag, Menang Terus',
      type:        'FIBER',
      minPrice:    299000,
      maxSpeed:    500,
      rating:      4.6,
      reviewCount: 8200,
      website:     'https://xl.co.id/home/gamer',
      phone:       '817',
      isFeatured:  true,
      isActive:    true,
      features:    ['Gaming priority traffic', 'Ultra-low latency', 'Dedicated bandwidth', 'Tanpa kontrak'],
      pros:        ['Ping sangat rendah', 'Tanpa throttling', 'Tanpa kontrak'],
      cons:        ['Harga lebih mahal', 'Area masih terbatas'],
    },
  });

  const xlPremium = await prisma.provider.upsert({
    where:  { slug: 'xl-home-premium' },
    update: {},
    create: {
      name:        'XL Home Premium',
      slug:        'xl-home-premium',
      description: 'Layanan premium untuk keluarga aktif dengan kecepatan tertinggi, SLA 99.9%, dan dukungan prioritas.',
      tagline:     'Premium Speed, Premium Life',
      type:        'FIBER',
      minPrice:    399000,
      maxSpeed:    2500,
      rating:      4.5,
      reviewCount: 5100,
      website:     'https://xl.co.id/home/premium',
      phone:       '817',
      isFeatured:  false,
      isActive:    true,
      features:    ['Hingga 2.5 Gbps', '4K streaming', 'SLA 99.9%', 'Dedicated support'],
      pros:        ['Kecepatan tertinggi', 'SLA tinggi', 'Support prioritas'],
      cons:        ['Harga premium', 'Kontrak 24 bulan'],
    },
  });

  const xlBusiness = await prisma.provider.upsert({
    where:  { slug: 'xl-business' },
    update: {},
    create: {
      name:        'XL Business',
      slug:        'xl-business',
      description: 'Solusi internet bisnis XL dengan IP publik, SLA guaranteed 99.99%, dan dedicated bandwidth untuk usaha Anda.',
      tagline:     'Bisnis Lancar, Koneksi Tangguh',
      type:        'FIBER',
      minPrice:    599000,
      maxSpeed:    10000,
      rating:      4.7,
      reviewCount: 3200,
      website:     'https://xl.co.id/business',
      phone:       '817',
      isFeatured:  false,
      isActive:    true,
      features:    ['Dedicated bandwidth', 'IP publik statis', 'SLA 99.99%', 'Business support 24/7'],
      pros:        ['SLA sangat tinggi', 'IP publik', 'Dedicated support', 'Skalabel'],
      cons:        ['Harga lebih tinggi', 'Khusus segmen bisnis'],
    },
  });

  console.log('✅ Providers created:', [xlHomeFiber, xlGamer, xlPremium, xlBusiness].map(p => p.name));

  // ── Coverage Areas ─────────────────────────────────────────────────────────
  const coverageCities = [
    { province: 'DKI Jakarta',    city: 'Jakarta Pusat',  postalCode: '10000' },
    { province: 'DKI Jakarta',    city: 'Jakarta Selatan', postalCode: '12000' },
    { province: 'DKI Jakarta',    city: 'Jakarta Barat',  postalCode: '11000' },
    { province: 'DKI Jakarta',    city: 'Jakarta Timur',  postalCode: '13000' },
    { province: 'DKI Jakarta',    city: 'Jakarta Utara',  postalCode: '14000' },
    { province: 'Jawa Barat',     city: 'Bandung',        postalCode: '40000' },
    { province: 'Jawa Timur',     city: 'Surabaya',       postalCode: '60000' },
    { province: 'Jawa Tengah',    city: 'Semarang',       postalCode: '50000' },
    { province: 'Banten',         city: 'Tangerang',      postalCode: '15000' },
    { province: 'Jawa Barat',     city: 'Bekasi',         postalCode: '17000' },
    { province: 'Jawa Barat',     city: 'Depok',          postalCode: '16400' },
    { province: 'DI Yogyakarta',  city: 'Yogyakarta',     postalCode: '55000' },
    { province: 'Bali',           city: 'Denpasar',       postalCode: '80000' },
    { province: 'Sumatera Utara', city: 'Medan',          postalCode: '20000' },
    { province: 'Sulawesi Selatan',city: 'Makassar',      postalCode: '90000' },
  ];

  for (const provider of [xlHomeFiber, xlGamer, xlPremium, xlBusiness]) {
    const citiesToCover = provider.slug === 'xl-home-fiber' ? coverageCities :
                          provider.slug === 'xl-home-gamer'  ? coverageCities.slice(0, 8) :
                          provider.slug === 'xl-home-premium' ? coverageCities.slice(0, 10) :
                          coverageCities.slice(0, 5);
    await prisma.coverageArea.createMany({
      data: citiesToCover.map((c) => ({ ...c, providerId: provider.id, isAvailable: true })),
      skipDuplicates: true,
    });
  }
  console.log('✅ Coverage areas created');

  // ── Packages ───────────────────────────────────────────────────────────────
  const packages = [
    // XL Home Fiber packages
    { name: 'XL Home 30Mbps',   slug: 'xl-home-30',   providerId: xlHomeFiber.id, speed: 30,   price: 199000, installationFee: 0, contractMonths: 12, quota: 'unlimited', latency: 20, features: ['Unlimited', 'Free Router'], category: 'BASIC' as PackageCategory,    isFeatured: false, isPopular: false },
    { name: 'XL Home 50Mbps',   slug: 'xl-home-50',   providerId: xlHomeFiber.id, speed: 50,   price: 249000, installationFee: 0, contractMonths: 12, quota: 'unlimited', latency: 15, features: ['Unlimited', 'Free Router', 'TV Lokal'], category: 'BASIC' as PackageCategory, isFeatured: false, isPopular: true },
    { name: 'XL Home 100Mbps',  slug: 'xl-home-100',  providerId: xlHomeFiber.id, speed: 100,  price: 299000, installationFee: 0, contractMonths: 12, quota: 'unlimited', latency: 12, features: ['Unlimited tanpa FUP', 'Free Installation', 'Router WiFi 6'], category: 'STANDARD' as PackageCategory, isFeatured: true, isPopular: true },
    { name: 'XL Home 150Mbps',  slug: 'xl-home-150',  providerId: xlHomeFiber.id, speed: 150,  price: 349000, installationFee: 0, contractMonths: 12, quota: 'unlimited', latency: 10, features: ['Unlimited', 'WiFi 6', '2 IP Privat'], category: 'STANDARD' as PackageCategory, isFeatured: false, isPopular: false },
    { name: 'XL Home 500Mbps',  slug: 'xl-home-500',  providerId: xlHomeFiber.id, speed: 500,  price: 499000, installationFee: 0, contractMonths: 12, quota: 'unlimited', latency: 8,  features: ['Unlimited', '4K Streaming', 'Multi-device'], category: 'PREMIUM' as PackageCategory, isFeatured: false, isPopular: false },
    { name: 'XL Home 1Gbps',    slug: 'xl-home-1gbps',providerId: xlHomeFiber.id, speed: 1000, price: 699000, installationFee: 0, contractMonths: 12, quota: 'unlimited', latency: 5,  features: ['Unlimited', '4K/8K Streaming', 'Multi-device', 'Priority Support'], category: 'PREMIUM' as PackageCategory, isFeatured: false, isPopular: false },
    // XL Gamer packages
    { name: 'XL Gamer 50Mbps',  slug: 'xl-gamer-50',  providerId: xlGamer.id, speed: 50,  price: 299000, installationFee: 0, contractMonths: 0, quota: 'unlimited', latency: 5, features: ['Gaming Priority', 'Low Latency', 'Tanpa Kontrak'], category: 'GAMING' as PackageCategory, isFeatured: false, isPopular: false },
    { name: 'XL Gamer 150Mbps', slug: 'xl-gamer-150', providerId: xlGamer.id, speed: 150, price: 399000, installationFee: 0, contractMonths: 0, quota: 'unlimited', latency: 3, features: ['Gaming Priority', 'Ultra-low Latency', 'Dedicated BW', 'Tanpa Kontrak'], category: 'GAMING' as PackageCategory, isFeatured: true, isPopular: true },
    { name: 'XL Gamer 300Mbps', slug: 'xl-gamer-300', providerId: xlGamer.id, speed: 300, price: 549000, installationFee: 0, contractMonths: 0, quota: 'unlimited', latency: 2, features: ['Gaming Priority', 'Ultra-low Latency <2ms', 'Dedicated BW', 'Pro Gaming Support'], category: 'GAMING' as PackageCategory, isFeatured: false, isPopular: false },
    // XL Premium packages
    { name: 'XL Premium 500Mbps',slug: 'xl-premium-500', providerId: xlPremium.id, speed: 500,  price: 599000, installationFee: 0, contractMonths: 24, quota: 'unlimited', latency: 5, features: ['4K Streaming', 'Multi-device', 'Priority Support', 'SLA 99.9%'], category: 'PREMIUM' as PackageCategory, isFeatured: false, isPopular: false },
    { name: 'XL Premium 1Gbps',  slug: 'xl-premium-1g',  providerId: xlPremium.id, speed: 1000, price: 799000, installationFee: 0, contractMonths: 24, quota: 'unlimited', latency: 3, features: ['4K/8K Streaming', 'SLA 99.9%', 'Dedicated Support', 'IP Publik'], category: 'PREMIUM' as PackageCategory, isFeatured: true, isPopular: false },
    { name: 'XL Premium 2.5Gbps',slug: 'xl-premium-25g', providerId: xlPremium.id, speed: 2500, price: 1299000, installationFee: 0, contractMonths: 24, quota: 'unlimited', latency: 2, features: ['Ultra HD', 'SLA 99.99%', 'Dedicated Fiber', 'VIP Support'], category: 'PREMIUM' as PackageCategory, isFeatured: false, isPopular: false },
    // XL Business packages
    { name: 'XL Business 100Mbps', slug: 'xl-biz-100', providerId: xlBusiness.id, speed: 100,   price: 599000,  installationFee: 500000, contractMonths: 24, quota: 'unlimited', latency: 10, features: ['IP Publik', 'SLA 99.9%', 'Business Support'], category: 'BUSINESS' as PackageCategory, isFeatured: false, isPopular: false },
    { name: 'XL Business 500Mbps', slug: 'xl-biz-500', providerId: xlBusiness.id, speed: 500,   price: 1299000, installationFee: 500000, contractMonths: 24, quota: 'unlimited', latency: 5,  features: ['IP Publik Statis', 'SLA 99.99%', 'Dedicated BW', '24/7 Support'], category: 'BUSINESS' as PackageCategory, isFeatured: true, isPopular: false },
    { name: 'XL Business 1Gbps',   slug: 'xl-biz-1g',  providerId: xlBusiness.id, speed: 1000,  price: 1999000, installationFee: 500000, contractMonths: 24, quota: 'unlimited', latency: 3,  features: ['Multi IP Publik', 'SLA 99.99%', 'Dedicated Fiber', 'Priority NOC'], category: 'BUSINESS' as PackageCategory, isFeatured: false, isPopular: false },
    { name: 'XL Business 10Gbps',  slug: 'xl-biz-10g', providerId: xlBusiness.id, speed: 10000, price: 9999000, installationFee: 1000000, contractMonths: 36, quota: 'unlimited', latency: 1,  features: ['Enterprise Grade', 'SLA 99.999%', 'Dedicated NOC', 'Custom Solution'], category: 'BUSINESS' as PackageCategory, isFeatured: false, isPopular: false },
  ] as const;

  await prisma.package.createMany({ data: packages as any, skipDuplicates: true });
  console.log('✅ Packages created:', packages.length);

  // ── Blog Posts ─────────────────────────────────────────────────────────────
  const panduanCat = categories[0];
  await prisma.blogPost.createMany({
    data: [
      {
        title:          'Kenapa XL Home Fiber Terbaik untuk Keluarga Indonesia 2025',
        slug:           'xl-home-fiber-terbaik-2025',
        excerpt:        'Analisis mendalam mengapa XL Home Fiber menjadi pilihan utama jutaan keluarga Indonesia di tahun 2025.',
        content:        '## XL Home Fiber: Pilihan Terbaik Keluarga\n\nDengan jaringan fiber optik terluas di Indonesia, XL Home hadir memenuhi kebutuhan internet keluarga modern...',
        categoryId:     panduanCat.id,
        authorId:       admin.id,
        tags:           ['xl home', 'fiber', 'internet rumah', '2025'],
        readTime:       8,
        isPublished:    true,
        publishedAt:    new Date('2024-11-18'),
        seoTitle:       'XL Home Fiber Terbaik 2025 — Review & Perbandingan Lengkap',
        seoDescription: 'Review lengkap XL Home Fiber 2025. Kecepatan, harga, coverage, dan perbandingan dengan kompetitor.',
        seoKeywords:    ['xl home fiber', 'internet rumah terbaik 2025', 'xl internet'],
      },
      {
        title:          'Cara Daftar XL Home: Panduan Lengkap dari A sampai Z',
        slug:           'cara-daftar-xl-home',
        excerpt:        'Panduan step-by-step cara mendaftar paket internet XL Home mulai dari cek coverage hingga instalasi.',
        content:        '## Cara Daftar XL Home\n\nMendaftar paket internet XL Home sangat mudah. Ikuti langkah-langkah berikut ini...',
        categoryId:     categories[1].id,
        authorId:       admin.id,
        tags:           ['cara daftar', 'xl home', 'tutorial'],
        readTime:       5,
        isPublished:    true,
        publishedAt:    new Date('2024-11-12'),
        seoTitle:       'Cara Daftar XL Home — Panduan Mudah 2025',
        seoDescription: 'Cara mudah daftar paket internet XL Home. Cek coverage, pilih paket, dan jadwalkan instalasi.',
        seoKeywords:    ['cara daftar xl home', 'pasang xl home', 'registrasi xl internet'],
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Blog posts created');

  // ── Reviews ────────────────────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      { userName: 'Andi Pratama',    userCity: 'Jakarta Selatan', rating: 5, speedRating: 5, priceRating: 4, supportRating: 5, comment: 'XL Home 150Mbps kencang banget! Streaming 4K lancar, gaming ping di bawah 10ms. Worth it banget. Instalasi juga cepat, teknisi ramah.', providerId: xlHomeFiber.id, isVerified: true, isApproved: true },
      { userName: 'Sinta Dewi',      userCity: 'Surabaya',        rating: 4, speedRating: 4, priceRating: 5, supportRating: 4, comment: 'Sudah 8 bulan pakai XL Home 100Mbps untuk WFH. Stabil banget, belum pernah down. Harga terjangkau untuk kualitas yang didapat.', providerId: xlHomeFiber.id, isVerified: true, isApproved: true },
      { userName: 'Rizky Fadhlan',   userCity: 'Bandung',         rating: 5, speedRating: 5, priceRating: 4, supportRating: 5, comment: 'XL Gamer 150Mbps cocok banget! Ping ke server game internasional bisa di bawah 5ms. Main kompetitif jadi makin enak!', providerId: xlGamer.id, isVerified: true, isApproved: true },
      { userName: 'Budi Santoso',    userCity: 'Tangerang',       rating: 4, speedRating: 4, priceRating: 4, supportRating: 3, comment: 'Paket XL Home 50Mbps cukup untuk keluarga 4 orang. Harga standar, kualitas oke. CS agak lama tapi akhirnya teratasi.', providerId: xlHomeFiber.id, isVerified: false, isApproved: true },
      { userName: 'Diana Putri',     userCity: 'Yogyakarta',      rating: 5, speedRating: 5, priceRating: 5, supportRating: 5, comment: 'XL Home Premium 1Gbps luar biasa! Buat streaming 4K dan WFH bersamaan sama sekali tidak ada masalah. Recommended untuk yang butuh koneksi premium!', providerId: xlPremium.id, isVerified: true, isApproved: true },
      { userName: 'Ahmad Fauzi',     userCity: 'Semarang',        rating: 5, speedRating: 5, priceRating: 4, supportRating: 5, comment: 'XL Business sangat andal untuk operasional kantor kami. Uptime hampir 100%, tim support responsif, IP publik stabil.', providerId: xlBusiness.id, isVerified: true, isApproved: true },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Reviews created');

  console.log('\n🎉 Seeding complete!');
  console.log('📧 Admin login: admin@xlnet.id');
  console.log('🔑 Admin password: admin123!');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
