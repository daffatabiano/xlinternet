'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Check, X, ArrowRight, Star, Quote, CalendarDays, Clock } from 'lucide-react';
import { SectionHeader }  from '@/components/shared/SectionHeader';
import { Button }         from '@/components/ui/Button';
import { Badge }          from '@/components/ui/Badge';
import { StarRating }     from '@/components/ui/StarRating';
import { useScrollReveal, useReviews, useBlogPosts } from '@/lib/hooks';
import { formatDate, formatIDR } from '@/lib/utils';

// ─── COMPARE SECTION ─────────────────────────────────────────────────────────
const compareData = {
  headers: ['Fitur', 'XL Basic', 'XL Standard', 'XL Gamer', 'XL Premium'],
  rows: [
    { label: 'Kecepatan Maks',   values: ['50 Mbps', '150 Mbps', '300 Mbps', '1 Gbps'],   bests: [false, false, false, true] },
    { label: 'Harga/Bulan',      values: ['Rp199rb', 'Rp299rb', 'Rp399rb', 'Rp599rb'],    bests: [true, false, false, false] },
    { label: 'Kontrak',          values: ['12 Bln', '12 Bln', 'Tanpa', 'Tanpa'],           bests: [false, false, true, true] },
    { label: 'Instalasi',        values: ['Gratis', 'Gratis', 'Gratis', 'Gratis'],         bests: [true, true, true, true] },
    { label: 'Latency',          values: ['<20ms', '<15ms', '<5ms', '<3ms'],               bests: [false, false, false, true] },
    { label: 'Gaming Priority',  values: [false, false, true, true],                       bests: [false, false, true, true] },
    { label: 'WiFi Router',      values: [true, true, true, true],                         bests: [true, true, true, true] },
    { label: 'IP Publik',        values: [false, false, false, true],                      bests: [false, false, false, true] },
    { label: 'SLA Uptime',       values: ['99%', '99.5%', '99.8%', '99.9%'],               bests: [false, false, false, true] },
  ],
};

export function CompareSection() {
  const { ref, inView } = useScrollReveal();
  return (
    <section ref={ref} className="section section--alt">
      <div className="container-page">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <SectionHeader eyebrow="Perbandingan Paket" title="Bandingkan Paket XL Secara Detail" description="Lihat perbedaan lengkap antar paket untuk memilih yang paling sesuai." />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
          className="overflow-x-auto rounded-2xl shadow-card border border-neutral-200"
        >
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-surface-dim border-b border-neutral-200">
                {compareData.headers.map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-left font-display font-bold text-sm whitespace-nowrap ${i === 0 ? 'text-neutral-500 min-w-[140px]' : 'text-neutral-900'}`}>
                    {i === 0 ? h : (
                      <div className="flex flex-col gap-1">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center mb-1`}>
                          <span className="text-white text-[10px] font-black">XL</span>
                        </div>
                        {h}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareData.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-3.5 text-sm font-semibold text-neutral-500">{row.label}</td>
                  {row.values.map((val, vi) => (
                    <td key={vi} className="px-6 py-3.5">
                      {typeof val === 'boolean' ? (
                        val
                          ? <Check className="w-4 h-4 text-green-500" />
                          : <X className="w-4 h-4 text-red-400 opacity-50" />
                      ) : (
                        <span className={`text-sm font-semibold ${row.bests[vi] ? 'text-green-600' : 'text-neutral-800'}`}>
                          {val}
                          {row.bests[vi] && <span className="ml-1 text-[10px] text-green-500">✓</span>}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="flex justify-center mt-8">
          <Link href="/site/compare"><Button variant="secondary" size="lg">Bandingkan Lebih Detail <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

// ─── REVIEWS SECTION ─────────────────────────────────────────────────────────
const DEMO_REVIEWS = [
  { id: '1', userName: 'Andi Pratama', userCity: 'Jakarta Selatan', provider: { name: 'XL Home 150Mbps' } as any, rating: 5, speedRating: 5, priceRating: 4, supportRating: 5, comment: 'XL Home benar-benar kencang! Streaming 4K lancar, gaming ping di bawah 10ms. Worth every rupiah. Instalasi juga cepat, teknisi datang sehari setelah daftar.', isVerified: true, isApproved: true, helpfulCount: 42, createdAt: '2024-11-15', package: undefined, packageId: undefined, userAvatar: undefined, providerId: '1' },
  { id: '2', userName: 'Sinta Dewi', userCity: 'Surabaya', provider: { name: 'XL Home 50Mbps' } as any, rating: 4, speedRating: 4, priceRating: 5, supportRating: 4, comment: 'Sudah 8 bulan pakai XL Home 50Mbps untuk WFH. Stabil banget, belum pernah down. Harga juga terjangkau untuk kualitas yang didapat. Recommended!', isVerified: true, isApproved: true, helpfulCount: 28, createdAt: '2024-10-28', package: undefined, packageId: undefined, userAvatar: undefined, providerId: '1' },
  { id: '3', userName: 'Rizky Fadhlan', userCity: 'Bandung', provider: { name: 'XL Gamer 300Mbps' } as any, rating: 5, speedRating: 5, priceRating: 4, supportRating: 5, comment: 'Gamer wajib coba XL Gamer! Ping ke server Singapura bisa 8ms doang. Main Mobile Legend, PUBG, FF semuanya kenceng. Tanpa kontrak pula, mantap!', isVerified: true, isApproved: true, helpfulCount: 61, createdAt: '2024-11-05', package: undefined, packageId: undefined, userAvatar: undefined, providerId: '2' },
];

const avatarColors = ['from-brand-blue to-brand-violet', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-pink-500 to-rose-600'];

export function ReviewsSection() {
  const { ref, inView } = useScrollReveal();
  const { data } = useReviews({ limit: 3 });
  const reviews = (data?.data ?? []).filter((r) => r && r.userName);

  return (
    <section ref={ref} className="section">
      <div className="container-page">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <SectionHeader eyebrow="Ulasan Pengguna" eyebrowVariant="green" title="Apa Kata Pelanggan XL?" description="Ulasan jujur dari pelanggan nyata yang sudah merasakan layanan XL Net." />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{review.userName.charAt(0) || 'U'}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">{review.userName || 'Pengguna'}</p>
                    <p className="text-xs text-neutral-400">{review.userCity || 'Indonesia'} · {review.createdAt ? formatDate(review.createdAt, 'relative') : 'Baru saja'}</p>
                  </div>
                </div>
                <Quote className="w-5 h-5 text-neutral-200 flex-shrink-0" />
              </div>

              {review.rating && <StarRating rating={review.rating} size="sm" className="mb-3" />}
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">{review.comment || 'Layanan sangat memuaskan!'}</p>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <span className="inline-flex items-center gap-1.5 bg-surface-dim border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-neutral-500">
                  📶 {review.provider?.name || 'XL Net'}
                </span>
                {review.isVerified && <Badge variant="green" size="sm">✓ Terverifikasi</Badge>}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/site/review"><Button variant="secondary" size="lg">Baca Semua Ulasan <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

// ─── BLOG SECTION ─────────────────────────────────────────────────────────────
const DEMO_POSTS = [
  { id: '1', title: '10 Alasan Kenapa XL Home Fiber Terbaik untuk Keluarga Indonesia 2025', slug: 'xl-home-terbaik-2025', excerpt: 'Analisis mendalam tentang mengapa XL Home menjadi pilihan pertama keluarga Indonesia.', featuredImage: '', category: { id: '1', name: 'Panduan', slug: 'panduan', description: '', color: '#0057B8' }, author: { id: '1', name: 'Tim XL Net', avatar: '', bio: '' }, authorId: '1', categoryId: '1', tags: [], readTime: 8, viewCount: 12400, isPublished: true, publishedAt: '2024-11-18', seoTitle: '', seoDescription: '', seoKeywords: [], createdAt: '', updatedAt: '', content: '' },
  { id: '2', title: 'Cara Daftar XL Home: Panduan Lengkap dari A sampai Z', slug: 'cara-daftar-xl-home', excerpt: 'Step-by-step panduan pendaftaran paket internet XL Home dengan mudah.', featuredImage: '', category: { id: '2', name: 'Tutorial', slug: 'tutorial', description: '', color: '#10B981' }, author: { id: '1', name: 'Tim XL Net', avatar: '', bio: '' }, authorId: '1', categoryId: '2', tags: [], readTime: 5, viewCount: 8700, isPublished: true, publishedAt: '2024-11-12', seoTitle: '', seoDescription: '', seoKeywords: [], createdAt: '', updatedAt: '', content: '' },
  { id: '3', title: 'XL Gamer vs Paket Reguler: Mana yang Lebih Baik untuk Gaming?', slug: 'xl-gamer-vs-reguler', excerpt: 'Perbandingan teknis antara paket gaming khusus XL Gamer vs paket biasa.', featuredImage: '', category: { id: '3', name: 'Review', slug: 'review', description: '', color: '#7C3AED' }, author: { id: '1', name: 'Tim XL Net', avatar: '', bio: '' }, authorId: '1', categoryId: '3', tags: [], readTime: 6, viewCount: 6200, isPublished: true, publishedAt: '2024-11-08', seoTitle: '', seoDescription: '', seoKeywords: [], createdAt: '', updatedAt: '', content: '' },
];

const catColors: Record<string, string> = {
  'Panduan':  'badge-blue', 'Tutorial': 'badge-green',
  'Review':   'badge-violet', 'Tips':   'badge-amber',
};
const emojis = ['🏆', '📋', '🎮'];

export function BlogSection() {
  const { ref, inView } = useScrollReveal();
  const { data } = useBlogPosts({ limit: 3 });
  const posts = (data?.data ?? DEMO_POSTS).map(post => ({
    ...post,
    category: typeof post.category === 'string' 
      ? { id: '0', name: post.category, slug: 'uncategorized', description: '', color: '#999' }
      : post.category
  }));

  return (
    <section ref={ref} className="section section--alt">
      <div className="container-page">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <SectionHeader eyebrow="Tips & Edukasi" eyebrowVariant="violet" title="Artikel Terbaru XL Net" description="Panduan, review, dan tips memilih internet terbaik untuk Anda." />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <Link href={`/site/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-surface-muted to-blue-100 flex items-center justify-center text-5xl">
                  {emojis[i]}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${catColors[post.category?.name || 'Artikel'] || 'badge-gray'}`}>{post.category?.name || 'Artikel'}</span>
                  </div>
                  <h3 className="font-display font-bold text-neutral-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime || 5} min baca</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/site/blog"><Button variant="secondary" size="lg">Baca Semua Artikel <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ─────────────────────────────────────────────────────────────
export function CTASection() {
  const { ref, inView } = useScrollReveal();
  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand p-12 md:p-16 text-center"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Content */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <Badge variant="gray" className="!bg-white/15 !text-white !border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Pasang Sekarang, Aktif Besok
              </Badge>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4 leading-tight">
              Siap Upgrade ke<br />Internet XL?
            </h2>
            <p className="text-lg text-white/70 max-w-md mx-auto mb-8">
              Cek coverage di area Anda dan dapatkan penawaran terbaik paket internet XL hari ini.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/site/coverage-check">
                <Button variant="white" size="lg">
                  📍 Cek Coverage Area
                </Button>
              </Link>
              <Link href="/site/paket-internet">
                <Button variant="outline" size="lg" className="!border-white/40 !text-white hover:!bg-white/10">
                  Lihat Semua Paket <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/40">
              Hubungi sales XL: <span className="font-bold text-white/70">817</span> · WhatsApp: <span className="font-bold text-white/70">+62 817 9999 817</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
