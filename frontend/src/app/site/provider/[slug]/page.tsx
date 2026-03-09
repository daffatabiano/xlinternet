'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronRight, MapPin, Star, Globe, Phone, Wifi,
  ThumbsUp, ThumbsDown, CheckCircle2, XCircle,
  MessageCircle, ArrowLeft, Zap, Shield, Clock,
} from 'lucide-react';
import Link from 'next/link';

import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { PackageCard } from '@/components/shared/PackageCard';
import { useProvider, useScrollReveal } from '@/lib/hooks';
import { formatIDR, formatDate, getProviderColor, cn } from '@/lib/utils';
import type { Provider, Package, Review } from '@/lib/types';

// ─── MOCK FALLBACK DATA ──────────────────────────────────────────────────────
const MOCK_PROVIDER: Provider = {
  id: '1',
  name: 'XL Home',
  slug: 'xlhome',
  description: 'Layanan internet fiber optik tercepat dengan kualitas terbaik untuk kebutuhan rumah tangga modern Anda.',
  tagline: 'Koneksi Berkecepatan Tinggi',
  logo: '',
  type: 'fiber',
  rating: 4.4,
  reviewCount: 18420,
  minPrice: 199000,
  maxSpeed: 1000,
  features: ['Fiber Optik', 'Free WiFi Router', 'Unlimited', 'Support 24/7'],
  pros: ['Coverage terluas di Indonesia', 'Customer service responsif 24/7', 'Harga terjangkau', 'Gratis instalasi'],
  cons: ['Kontrak minimum 12 bulan', 'Latency bervariasi saat peak hour'],
  website: 'https://xl.co.id',
  phone: '087 777 777 777',
  isActive: true,
  isFeatured: true,
  coverageAreas: [
    { id: '1', province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Kebayoran Baru', postalCode: '12950', isAvailable: true },
    { id: '2', province: 'DKI Jakarta', city: 'Jakarta Pusat', district: 'Menteng', postalCode: '10310', isAvailable: true },
    { id: '3', province: 'Jawa Barat', city: 'Bandung', district: 'Coblong', postalCode: '40132', isAvailable: true },
    { id: '4', province: 'Jawa Timur', city: 'Surabaya', district: 'Gubeng', postalCode: '60281', isAvailable: true },
    { id: '5', province: 'Bali', city: 'Denpasar', district: 'Denpasar Selatan', postalCode: '80228', isAvailable: true },
    { id: '6', province: 'Jawa Tengah', city: 'Semarang', district: 'Tembalang', postalCode: '50275', isAvailable: true },
  ],
  createdAt: '2024-01-01',
  updatedAt: '2024-03-08',
};

const MOCK_PACKAGES: Package[] = [
  {
    id: '1', name: 'XL Home 50Mbps', slug: 'xl-home-50', providerId: '1',
    provider: MOCK_PROVIDER, speed: 50, price: 199000, installationFee: 0,
    contractMonths: 12, quota: 'unlimited', latency: 15,
    features: ['Unlimited', 'Free WiFi Router', 'TV Lokal'],
    isPopular: false, isFeatured: false, category: 'basic', isActive: true,
    createdAt: '2024-01-01', updatedAt: '2024-03-08',
  },
  {
    id: '2', name: 'XL Home 150Mbps', slug: 'xl-home-150', providerId: '1',
    provider: MOCK_PROVIDER, speed: 150, price: 299000, installationFee: 0,
    contractMonths: 12, quota: 'unlimited', latency: 10,
    features: ['Unlimited tanpa FUP', 'Free Installation', 'Router WiFi 6'],
    isPopular: true, isFeatured: true, category: 'standard', isActive: true,
    createdAt: '2024-01-01', updatedAt: '2024-03-08',
  },
  {
    id: '3', name: 'XL Home 300Mbps', slug: 'xl-home-300', providerId: '1',
    provider: MOCK_PROVIDER, speed: 300, price: 449000, installationFee: 0,
    contractMonths: 12, quota: 'unlimited', latency: 5,
    features: ['Unlimited tanpa FUP', 'Free Installation', 'Router WiFi 6', 'Priority Support'],
    isPopular: false, isFeatured: true, category: 'premium', isActive: true,
    createdAt: '2024-01-01', updatedAt: '2024-03-08',
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: '1', userName: 'Budi Santoso', userAvatar: '', userCity: 'Jakarta',
    provider: MOCK_PROVIDER, providerId: '1', rating: 5, speedRating: 5,
    priceRating: 4, supportRating: 5,
    comment: 'Saya sudah menggunakan XL Home selama 2 tahun dan sangat puas dengan layanannya. Internet stabil dan customer service responsif.',
    isVerified: true, isApproved: true, helpfulCount: 45, createdAt: '2025-03-01',
  },
  {
    id: '2', userName: 'Sari Dewi', userAvatar: '', userCity: 'Bandung',
    provider: MOCK_PROVIDER, providerId: '1', rating: 4, speedRating: 4,
    priceRating: 4, supportRating: 3,
    comment: 'Overall bagus, kecepatan sesuai promosi. Kadang sedikit lambat saat malam, tapi masih acceptable untuk kerja remote.',
    isVerified: true, isApproved: true, helpfulCount: 22, createdAt: '2025-02-15',
  },
  {
    id: '3', userName: 'Ahmad Rizki', userAvatar: '', userCity: 'Surabaya',
    provider: MOCK_PROVIDER, providerId: '1', rating: 5, speedRating: 5,
    priceRating: 5, supportRating: 4,
    comment: 'Harga worth it dengan kecepatan yang didapat. Instalasi cepat dan teknisi profesional.',
    isVerified: false, isApproved: true, helpfulCount: 18, createdAt: '2025-01-20',
  },
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── LOADING SKELETON ────────────────────────────────────────────────────────
function ProviderSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-b from-neutral-50 to-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 bg-neutral-200 rounded mb-8" />
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-neutral-200" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-64 bg-neutral-200 rounded" />
              <div className="h-5 w-40 bg-neutral-200 rounded" />
              <div className="h-4 w-full max-w-lg bg-neutral-200 rounded" />
              <div className="flex gap-3">
                <div className="h-8 w-24 bg-neutral-200 rounded-full" />
                <div className="h-8 w-24 bg-neutral-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-neutral-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-neutral-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data, isLoading, isError } = useProvider(slug);

  const { ref: packagesRef, inView: packagesInView } = useScrollReveal();
  const { ref: coverageRef, inView: coverageInView } = useScrollReveal();
  const { ref: prosConsRef, inView: prosConsInView } = useScrollReveal();
  const { ref: reviewsRef, inView: reviewsInView } = useScrollReveal();

  // Use API data, or fallback to mock
  const provider: Provider = data?.data ?? MOCK_PROVIDER;
  const packages: Package[] = (data as any)?.packages ?? MOCK_PACKAGES;
  const reviews: Review[] = (data as any)?.reviews ?? MOCK_REVIEWS;

  const color = getProviderColor(provider.slug);
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : provider.rating;

  if (isLoading) return <ProviderSkeleton />;

  if (isError && !provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-4">Provider Tidak Ditemukan</h1>
        <p className="text-neutral-500 mb-8">Maaf, provider yang Anda cari tidak tersedia.</p>
        <Button onClick={() => router.push('/site/provider')}>
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Provider
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-neutral-50 to-white pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-sm text-neutral-500 mb-8 md:mb-10"
          >
            <Link href="/site" className="hover:text-brand-blue transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/site/provider" className="hover:text-brand-blue transition-colors">Provider</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-900 font-medium">{provider.name}</span>
          </motion.nav>

          {/* Hero content */}
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
            {/* Logo area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={cn(
                'w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br flex-shrink-0',
                'flex items-center justify-center shadow-lg',
                color.bg
              )}
            >
              {provider.logo ? (
                <img src={provider.logo} alt={provider.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              ) : (
                <span className="text-white font-black text-2xl md:text-3xl tracking-tight">
                  {provider.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-neutral-900">
                  {provider.name}
                </h1>
                {provider.isFeatured && (
                  <Badge variant="blue" dot>Featured</Badge>
                )}
              </div>

              <p className="text-lg md:text-xl text-neutral-500 italic mb-4">
                &ldquo;{provider.tagline}&rdquo;
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={provider.rating} size="md" showValue />
                <span className="text-sm text-neutral-400">
                  ({provider.reviewCount.toLocaleString('id-ID')} ulasan)
                </span>
              </div>

              <p className="text-neutral-600 leading-relaxed max-w-2xl mb-6">
                {provider.description}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="green" size="sm">
                  <Zap className="w-3 h-3 mr-1 inline" />
                  Hingga {provider.maxSpeed} Mbps
                </Badge>
                <Badge variant="blue" size="sm">
                  <Shield className="w-3 h-3 mr-1 inline" />
                  {provider.type === 'fiber' ? 'Fiber Optik' : provider.type}
                </Badge>
                <Badge variant="amber" size="sm">
                  Mulai {formatIDR(provider.minPrice)}/bln
                </Badge>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    const wa = `https://wa.me/6287777777777?text=${encodeURIComponent(`Halo, saya tertarik dengan layanan ${provider.name}. Bisa info lebih lanjut?`)}`;
                    window.open(wa, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi via WhatsApp
                </Button>
                {provider.website && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => window.open(provider.website, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                    Kunjungi Website
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES STRIP ───────────────────────────────────────────── */}
      {provider.features.length > 0 && (
        <section className="border-y border-neutral-100 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {provider.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PACKAGES SECTION ─────────────────────────────────────────── */}
      <section ref={packagesRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={packagesInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <SectionHeader
              eyebrow="Paket Internet"
              title={`Pilihan Paket ${provider.name}`}
              description="Temukan paket internet yang sesuai dengan kebutuhan dan budget Anda."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <motion.div key={pkg.id} custom={i} variants={fadeUp}>
                  <PackageCard
                    pkg={pkg}
                    index={i}
                    onSelect={() => router.push(`/site/paket-internet/${pkg.slug}`)}
                  />
                </motion.div>
              ))}
            </div>

            {packages.length === 0 && (
              <div className="text-center py-12">
                <Wifi className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">Belum ada paket tersedia untuk provider ini.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── COVERAGE AREAS ───────────────────────────────────────────── */}
      <section ref={coverageRef} className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={coverageInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <SectionHeader
              eyebrow="Area Coverage"
              eyebrowVariant="green"
              title="Jangkauan Layanan"
              description={`${provider.name} tersedia di berbagai kota besar di Indonesia.`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {provider.coverageAreas.map((area, i) => (
                <motion.div
                  key={area.id}
                  custom={i}
                  variants={fadeUp}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border bg-white',
                    'hover:shadow-card transition-shadow duration-200',
                    area.isAvailable ? 'border-green-200' : 'border-neutral-200 opacity-60'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    area.isAvailable ? 'bg-green-50' : 'bg-neutral-100'
                  )}>
                    <MapPin className={cn(
                      'w-4 h-4',
                      area.isAvailable ? 'text-green-600' : 'text-neutral-400'
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 text-sm">{area.city}</p>
                    <p className="text-xs text-neutral-500">{area.district}, {area.province}</p>
                    {area.isAvailable ? (
                      <span className="text-[11px] font-medium text-green-600">Tersedia</span>
                    ) : (
                      <span className="text-[11px] font-medium text-neutral-400">Segera Hadir</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/site/coverage-check">
                <Button variant="outline" size="md">
                  <MapPin className="w-4 h-4" />
                  Cek Coverage di Alamat Anda
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PROS & CONS ──────────────────────────────────────────────── */}
      <section ref={prosConsRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={prosConsInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <SectionHeader
              eyebrow="Kelebihan & Kekurangan"
              eyebrowVariant="violet"
              title="Penilaian Jujur"
              description="Evaluasi lengkap berdasarkan pengalaman pengguna dan pengujian kami."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Pros */}
              <motion.div
                custom={0}
                variants={fadeUp}
                className="bg-green-50/60 border border-green-200 rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-green-800">Kelebihan</h3>
                </div>
                <ul className="space-y-3">
                  {provider.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-green-900">{pro}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Cons */}
              <motion.div
                custom={1}
                variants={fadeUp}
                className="bg-red-50/60 border border-red-200 rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <ThumbsDown className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-red-800">Kekurangan</h3>
                </div>
                <ul className="space-y-3">
                  {provider.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-red-900">{con}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── REVIEWS SECTION ──────────────────────────────────────────── */}
      <section ref={reviewsRef} className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={reviewsInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <SectionHeader
              eyebrow="Ulasan Pengguna"
              eyebrowVariant="amber"
              title="Apa Kata Mereka?"
              description={`Ulasan asli dari pengguna ${provider.name} di seluruh Indonesia.`}
            />

            {/* Rating summary */}
            <motion.div
              custom={0}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 mb-8 max-w-2xl mx-auto text-center"
            >
              <div className="font-display font-black text-5xl md:text-6xl text-neutral-900 mb-2">
                {avgRating.toFixed(1)}
              </div>
              <StarRating rating={avgRating} size="lg" className="justify-center mb-2" />
              <p className="text-sm text-neutral-500">
                Dari {provider.reviewCount.toLocaleString('id-ID')} ulasan pengguna
              </p>
            </motion.div>

            {/* Review cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  custom={i + 1}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-card transition-shadow duration-200"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-neutral-900 text-sm truncate">{review.userName}</p>
                        {review.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">{review.userCity} · {formatDate(review.createdAt, 'relative')}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <StarRating rating={review.rating} size="sm" className="mb-3" />

                  {/* Comment */}
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {/* Sub-ratings */}
                  <div className="flex gap-4 text-[11px] text-neutral-400 border-t border-neutral-100 pt-3">
                    <div>
                      <span className="text-neutral-500 font-medium">Kecepatan</span>{' '}
                      <span className="text-amber-500 font-bold">{review.speedRating}/5</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-medium">Harga</span>{' '}
                      <span className="text-amber-500 font-bold">{review.priceRating}/5</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-medium">Support</span>{' '}
                      <span className="text-amber-500 font-bold">{review.supportRating}/5</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View all reviews link */}
            <div className="text-center mt-10">
              <Link href="/site/review">
                <Button variant="secondary" size="md">
                  Lihat Semua Ulasan
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
              Tertarik dengan {provider.name}?
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">
              Tim kami siap membantu Anda memilih paket terbaik. Konsultasi gratis via WhatsApp, respon cepat!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="white"
                size="lg"
                onClick={() => {
                  const wa = `https://wa.me/6287777777777?text=${encodeURIComponent(`Halo, saya ingin berlangganan ${provider.name}. Bisa dibantu?`)}`;
                  window.open(wa, '_blank');
                }}
              >
                <MessageCircle className="w-5 h-5" />
                Chat via WhatsApp
              </Button>
              {provider.phone && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10"
                  onClick={() => window.open(`tel:${provider.phone}`, '_self')}
                >
                  <Phone className="w-4 h-4" />
                  {provider.phone}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
