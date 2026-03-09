'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Wifi, ArrowLeft, Check, ChevronRight, Zap,
  Shield, Clock, Award, MessageCircle, Star,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LeadCaptureForm } from '@/components/shared/LeadCaptureForm';
import { packageService } from '@/lib/api/services';
import { MOCK_PACKAGES } from '@/lib/api/mock-data';
import { formatIDR, contractLabel, cn } from '@/lib/utils';
import type { Package } from '@/lib/types';

// ─── MOCK FALLBACK DATA ──────────────────────────────────────────────────────
const MOCK_PACKAGE: Package = {
  id: '2',
  name: 'XL Home 150Mbps',
  slug: 'xl-home-150',
  providerId: '1',
  provider: {
    id: '1',
    name: 'XL Home',
    slug: 'xlhome',
    description: 'Layanan internet fiber optik tercepat dengan kualitas terbaik',
    tagline: 'Koneksi Berkecepatan Tinggi',
    logo: '',
    type: 'fiber',
    rating: 4.4,
    reviewCount: 18420,
    minPrice: 199000,
    maxSpeed: 1000,
    features: ['Fiber Optik', 'Free WiFi Router', 'Unlimited', 'Support 24/7'],
    pros: ['Coverage terluas di Indonesia', 'Customer service responsif 24/7', 'Harga terjangkau'],
    cons: ['Kontrak minimum 12 bulan'],
    website: 'https://xl.co.id',
    phone: '087 777 777 777',
    isActive: true,
    isFeatured: true,
    coverageAreas: [
      { id: '1', province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Kebayoran Baru', postalCode: '12950', isAvailable: true },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-03-08',
  },
  speed: 150,
  price: 299000,
  installationFee: 0,
  contractMonths: 12,
  quota: 'unlimited',
  latency: 10,
  features: ['Unlimited tanpa FUP', 'Free Installation', 'Router WiFi 6', 'Support 24/7', 'IP Static Gratis'],
  isPopular: true,
  isFeatured: true,
  category: 'standard',
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-03-08',
};

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── LOADING SKELETON ────────────────────────────────────────────────────────
function PackageDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 bg-neutral-200 rounded mb-8" />
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-4">
              <div className="h-6 w-32 bg-neutral-200 rounded-full" />
              <div className="h-12 w-80 bg-neutral-200 rounded" />
              <div className="h-5 w-40 bg-neutral-200 rounded" />
              <div className="flex items-end gap-2 mt-4">
                <div className="h-10 w-48 bg-neutral-200 rounded" />
                <div className="h-5 w-20 bg-neutral-200 rounded" />
              </div>
              <div className="flex gap-3 mt-6">
                <div className="h-12 w-44 bg-neutral-200 rounded-xl" />
                <div className="h-12 w-44 bg-neutral-200 rounded-xl" />
              </div>
            </div>
            <div className="w-full lg:w-80 h-48 bg-neutral-100 rounded-2xl" />
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-neutral-100 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-neutral-100 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── SPEC CARD COMPONENT ─────────────────────────────────────────────────────
function SpecCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl border border-neutral-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-bold text-neutral-900">{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['package', slug],
    queryFn: () => packageService.getBySlug(slug),
    enabled: !!slug,
  });

  // Use API data, or fallback to mock
  const pkg: Package = data?.data
    ?? MOCK_PACKAGES.find((p) => p.slug === slug) as unknown as Package
    ?? MOCK_PACKAGE;

  if (isLoading) return <PackageDetailSkeleton />;

  if (isError && !pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <Wifi className="w-16 h-16 text-neutral-300 mb-6" />
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-4">Paket Tidak Ditemukan</h1>
        <p className="text-neutral-500 mb-8 text-center max-w-md">
          Maaf, paket internet yang Anda cari tidak tersedia atau sudah tidak aktif.
        </p>
        <Button onClick={() => router.push('/site/paket-internet')}>
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Paket
        </Button>
      </div>
    );
  }

  // Derived values
  const quotaLabel = pkg.quota === 'unlimited' ? 'Unlimited' : `${pkg.quota} GB`;
  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo, saya tertarik dengan paket ${pkg.name} dari ${pkg.provider?.name}. Mohon info lebih lanjut.`
  )}`;

  const specs = [
    { icon: Zap, label: 'Kecepatan', value: `${pkg.speed} Mbps`, sub: 'Download & Upload', color: 'bg-blue-500' },
    { icon: Clock, label: 'Latency', value: `${pkg.latency} ms`, sub: 'Rata-rata ping', color: 'bg-violet-500' },
    { icon: Shield, label: 'Kontrak', value: contractLabel(pkg.contractMonths), sub: 'Masa berlangganan', color: 'bg-amber-500' },
    { icon: Wifi, label: 'Kuota', value: quotaLabel, sub: 'Per bulan', color: 'bg-green-500' },
    { icon: Award, label: 'Biaya Pasang', value: pkg.installationFee === 0 ? 'GRATIS' : formatIDR(pkg.installationFee), sub: 'Sekali bayar', color: 'bg-cyan-500' },
    { icon: Star, label: 'Kategori', value: pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1), sub: 'Tipe paket', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-white pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-sm text-neutral-500 mb-8 md:mb-10 flex-wrap"
          >
            <Link href="/site" className="hover:text-brand-blue transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/site/paket-internet" className="hover:text-brand-blue transition-colors">Paket Internet</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-neutral-900 font-medium truncate">{pkg.name}</span>
          </motion.nav>

          {/* Hero content */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: Package info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 min-w-0"
            >
              {/* Provider badge */}
              <Link
                href={`/site/provider/${pkg.provider?.slug}`}
                className="inline-flex items-center gap-2 mb-4 group"
              >
                <Badge variant="blue" size="sm">
                  <Wifi className="w-3 h-3" />
                  {pkg.provider?.name}
                </Badge>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-blue transition-colors" />
              </Link>

              {/* Package name */}
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-neutral-900 mb-3 leading-tight">
                {pkg.name}
              </h1>

              {/* Speed highlight */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-brand-blue">
                  {pkg.speed}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-neutral-400">Mbps</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2 mb-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-neutral-900">
                  {formatIDR(pkg.price)}
                </span>
                <span className="text-neutral-500 text-sm mb-1">/bulan</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {pkg.isPopular && <Badge variant="amber" dot size="sm">Populer</Badge>}
                {pkg.isFeatured && <Badge variant="violet" size="sm">Unggulan</Badge>}
                {pkg.installationFee === 0 && <Badge variant="green" size="sm">Gratis Pasang</Badge>}
                {pkg.quota === 'unlimited' && <Badge variant="cyan" size="sm">Unlimited</Badge>}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  <MessageCircle className="w-5 h-5" />
                  Berlangganan Sekarang
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(whatsappUrl, '_blank')}
                >
                  <MessageCircle className="w-5 h-5" />
                  Tanya via WhatsApp
                </Button>
              </div>
            </motion.div>

            {/* Right: Quick summary card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="w-full lg:w-96 flex-shrink-0"
            >
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-xl p-6 space-y-4">
                <h3 className="font-display font-bold text-lg text-neutral-900">Ringkasan Paket</h3>
                <div className="divide-y divide-neutral-100">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-neutral-500">Kecepatan</span>
                    <span className="text-sm font-bold text-neutral-900">{pkg.speed} Mbps</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-neutral-500">Harga</span>
                    <span className="text-sm font-bold text-neutral-900">{formatIDR(pkg.price)}/bln</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-neutral-500">Kuota</span>
                    <span className="text-sm font-bold text-neutral-900">{quotaLabel}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-neutral-500">Kontrak</span>
                    <span className="text-sm font-bold text-neutral-900">{contractLabel(pkg.contractMonths)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-neutral-500">Biaya Pasang</span>
                    <span className={cn(
                      'text-sm font-bold',
                      pkg.installationFee === 0 ? 'text-green-600' : 'text-neutral-900'
                    )}>
                      {pkg.installationFee === 0 ? 'GRATIS' : formatIDR(pkg.installationFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-neutral-500">Latency</span>
                    <span className="text-sm font-bold text-neutral-900">{pkg.latency} ms</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-neutral-400 text-center">
                    * Harga dapat berubah sewaktu-waktu
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SPECS SECTION ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 mb-3">
              Spesifikasi Teknis
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto">
              Detail lengkap paket {pkg.name} untuk kebutuhan internet Anda
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {specs.map((spec, i) => (
              <SpecCard key={spec.label} index={i} {...spec} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Features list */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 mb-3">
                  Fitur Unggulan
                </h2>
                <p className="text-neutral-500 mb-8">
                  Nikmati berbagai fitur premium yang sudah termasuk dalam paket ini
                </p>
              </motion.div>

              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {pkg.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    custom={i}
                    variants={fadeUp}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-neutral-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-neutral-700 font-medium">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Provider info card */}
            <div className="lg:w-80 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-6 border border-blue-100 sticky top-24"
              >
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">
                  Tentang Provider
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {pkg.provider?.name?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{pkg.provider?.name}</p>
                    <p className="text-xs text-neutral-500">{pkg.provider?.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.round(pkg.provider?.rating ?? 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-neutral-200'
                      )}
                    />
                  ))}
                  <span className="text-sm font-medium text-neutral-600 ml-1">
                    {pkg.provider?.rating?.toFixed(1)}
                  </span>
                  <span className="text-xs text-neutral-400 ml-1">
                    ({pkg.provider?.reviewCount?.toLocaleString('id-ID')} ulasan)
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {pkg.provider?.description}
                </p>

                <Link href={`/site/provider/${pkg.provider?.slug}`}>
                  <Button variant="secondary" size="sm" fullWidth>
                    Lihat Profil Provider
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEAD CAPTURE SECTION ─────────────────────────────────────── */}
      <section id="lead-form" className="py-16 md:py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 mb-3">
              Tertarik dengan Paket Ini?
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto">
              Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda untuk proses pemasangan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-neutral-100 shadow-xl p-6 md:p-8"
          >
            <LeadCaptureForm
              source="WEBSITE"
              packageId={pkg.id}
              providerId={pkg.providerId}
              defaultInterest={pkg.name}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA SECTION ─────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
                Butuh Bantuan?
              </h2>
              <p className="text-green-100 max-w-md mx-auto mb-8">
                Tim kami siap membantu Anda memilih paket yang tepat. Hubungi kami via WhatsApp untuk konsultasi gratis.
              </p>
              <Button
                variant="white"
                size="lg"
                onClick={() => window.open(whatsappUrl, '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
                Chat via WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── BACK NAVIGATION ──────────────────────────────────────────── */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/site/paket-internet">
            <Button variant="ghost" size="md">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Paket Internet
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
