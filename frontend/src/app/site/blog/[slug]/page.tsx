'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CalendarDays, Clock, Eye, Share2,
  MessageCircle, Twitter, Link2, ChevronRight, BookOpen,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, estimateReadTime, cn } from '@/lib/utils';
import { useScrollReveal } from '@/lib/hooks';
import { blogService } from '@/lib/api/services';
import { MOCK_BLOG_POSTS } from '@/lib/api/mock-data';
import type { BlogPost } from '@/lib/types';

// ─── MOCK FALLBACK ────────────────────────────────────────────────────────────
const MOCK_POST: BlogPost = {
  id: '1',
  title: 'Cara Memilih Paket Internet Terbaik Untuk Rumah Anda',
  slug: 'cara-memilih-paket-internet',
  content: `
    <h2>Mengapa Memilih Paket Internet yang Tepat Itu Penting?</h2>
    <p>Internet sudah menjadi kebutuhan pokok di zaman modern. Mulai dari bekerja dari rumah,
    belajar online, hingga streaming hiburan — semuanya membutuhkan koneksi internet yang stabil
    dan cepat. Namun, dengan banyaknya pilihan provider dan paket yang tersedia, bagaimana cara
    memilih yang terbaik?</p>
    <h2>1. Tentukan Kebutuhan Anda</h2>
    <p>Langkah pertama adalah menentukan kebutuhan internet Anda. Apakah Anda hanya browsing dan
    media sosial? Atau membutuhkan bandwidth besar untuk gaming dan streaming 4K?</p>
    <ul>
      <li><strong>Browsing & Media Sosial:</strong> 10-30 Mbps sudah cukup</li>
      <li><strong>Streaming HD:</strong> 30-50 Mbps direkomendasikan</li>
      <li><strong>Gaming & Streaming 4K:</strong> 50-100 Mbps ideal</li>
      <li><strong>Remote Work + Keluarga Besar:</strong> 100 Mbps ke atas</li>
    </ul>
    <h2>2. Cek Coverage Area</h2>
    <p>Sebelum memilih provider, pastikan area tempat tinggal Anda sudah tercakup oleh jaringan
    provider tersebut. Gunakan fitur <strong>Cek Coverage</strong> di website kami untuk memastikan
    ketersediaan layanan di lokasi Anda.</p>
    <h2>3. Bandingkan Harga dan Kecepatan</h2>
    <p>Jangan hanya tergiur dengan harga murah. Perhatikan rasio harga terhadap kecepatan yang
    ditawarkan. Terkadang, paket yang sedikit lebih mahal memberikan value yang jauh lebih baik.</p>
    <h2>4. Perhatikan Ulasan Pengguna</h2>
    <p>Baca ulasan dari pengguna lain untuk mengetahui kualitas layanan sebenarnya, termasuk
    kecepatan, stabilitas, dan kualitas customer support.</p>
    <h2>Kesimpulan</h2>
    <p>Memilih paket internet bukan hanya soal kecepatan — pertimbangkan juga stabilitas,
    customer support, dan harga. Gunakan tools kami untuk membandingkan paket dan membuat keputusan
    yang tepat!</p>
  `,
  excerpt: 'Pelajari tips dan trik memilih paket internet yang sesuai dengan kebutuhan rumah Anda.',
  featuredImage: '',
  category: { id: 'cat-1', name: 'Tutorial', slug: 'tutorial', description: 'Tutorial dan panduan lengkap', color: '#3B82F6' },
  categoryId: 'cat-1',
  author: { id: '1', name: 'Daffa Tabiano', avatar: '', bio: 'Tech writer dan internet enthusiast' },
  authorId: '1',
  tags: ['internet', 'tips', 'tutorial'],
  readTime: 5,
  viewCount: 2540,
  isPublished: true,
  publishedAt: '2025-03-15T10:00:00Z',
  seoTitle: 'Cara Memilih Paket Internet Terbaik',
  seoDescription: 'Panduan lengkap memilih paket internet yang sesuai dengan kebutuhan rumah Anda',
  seoKeywords: ['internet', 'paket', 'tips memilih'],
  createdAt: '2025-03-15',
  updatedAt: '2025-03-15',
};

const MOCK_RELATED: BlogPost[] = [
  {
    ...MOCK_POST,
    id: '2',
    title: 'Review XL Home Fiber: Kecepatan dan Stabilitas',
    slug: 'review-xl-home-fiber',
    excerpt: 'Review lengkap layanan XL Home Fiber dari sisi kecepatan, stabilitas, dan harga.',
    category: { id: 'cat-2', name: 'Review', slug: 'review', description: 'Review produk', color: '#10B981' },
    viewCount: 1830,
    readTime: 7,
  },
  {
    ...MOCK_POST,
    id: '3',
    title: 'Tips Optimasi WiFi Router untuk Kecepatan Maksimal',
    slug: 'tips-optimasi-wifi-router',
    excerpt: 'Pelajari cara mengoptimalkan router WiFi Anda agar mendapat sinyal terkuat.',
    category: { id: 'cat-3', name: 'Tips', slug: 'tips', description: 'Tips & trik', color: '#F59E0B' },
    viewCount: 3120,
    readTime: 4,
  },
  {
    ...MOCK_POST,
    id: '4',
    title: 'Perbandingan Provider Internet Fiber di Indonesia 2025',
    slug: 'perbandingan-provider-fiber-2025',
    excerpt: 'Kami membandingkan semua provider internet fiber optik utama di Indonesia.',
    category: { id: 'cat-4', name: 'Perbandingan', slug: 'perbandingan', description: 'Perbandingan produk', color: '#8B5CF6' },
    viewCount: 4200,
    readTime: 10,
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

// ─── READING PROGRESS BAR ────────────────────────────────────────────────────
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/50">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-8">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content skeleton */}
          <div className="flex-1 lg:w-[70%]">
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">
              <div className="h-6 w-24 bg-gray-200 rounded-full mb-4" />
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
              <div className="h-10 w-1/2 bg-gray-200 rounded mb-6" />
              <div className="flex gap-4 mb-8">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={cn('h-4 bg-gray-200 rounded', i % 3 === 2 ? 'w-2/3' : 'w-full')} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:w-[30%] space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <div className="w-20 h-16 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-full bg-gray-200 rounded mb-4" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARE BUTTONS ────────────────────────────────────────────────────────────
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/site/blog/${slug}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium mr-1">
        <Share2 className="w-4 h-4 inline -mt-0.5 mr-1" />
        Bagikan:
      </span>
      <button
        onClick={shareWhatsApp}
        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
        title="Share via WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      <button
        onClick={shareTwitter}
        className="p-2 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors"
        title="Share via Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopyLink}
        className={cn(
          'p-2 rounded-lg transition-colors',
          copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        )}
        title="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="text-xs text-green-600 font-medium"
          >
            Tersalin!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { ref: contentRef, inView: contentInView } = useScrollReveal();

  // Fetch blog post by slug
  const { data: postData, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      try {
        const result = await blogService.getBySlug(slug);
        return result.data ?? MOCK_POST;
      } catch {
        return MOCK_POST;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const post: BlogPost = postData ?? MOCK_POST;

  // Fetch related posts once we have the post id
  const { data: relatedData } = useQuery({
    queryKey: ['blog-related', post.id],
    queryFn: async () => {
      try {
        const result = await blogService.getRelated(post.id);
        return result.data ?? MOCK_RELATED;
      } catch {
        return MOCK_RELATED;
      }
    },
    enabled: !!post.id && !isLoading,
    staleTime: 10 * 60 * 1000,
  });

  const relatedPosts: BlogPost[] = relatedData ?? MOCK_RELATED;
  const readTime = post.readTime || estimateReadTime(post.content || '');

  if (isLoading) return <BlogDetailSkeleton />;

  return (
    <>
      <ReadingProgressBar />

      <div className="min-h-screen bg-gray-50 pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Breadcrumb ───────────────────────────────────────────── */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-sm text-gray-500 mb-8 flex-wrap"
          >
            <Link href="/site" className="hover:text-brand-blue transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/site/blog" className="hover:text-brand-blue transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium truncate max-w-[260px] sm:max-w-md">
              {post.title}
            </span>
          </motion.nav>

          {/* ── Back Link ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Link
              href="/site/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Blog
            </Link>
          </motion.div>

          {/* ── Two-Column Layout ────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ═══ CONTENT COLUMN (70%) ═══════════════════════════════ */}
            <motion.article
              ref={contentRef}
              className="flex-1 lg:w-[70%]"
              initial="hidden"
              animate={contentInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={0}
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative w-full aspect-[2/1] bg-gray-100">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="p-6 sm:p-10">
                  {/* Category badge */}
                  <div className="mb-4">
                    <Badge variant="blue" size="sm">
                      {post.category?.name || 'Artikel'}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
                    {post.title}
                  </h1>

                  {/* Author & Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {post.author?.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="rounded-full ring-2 ring-blue-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                          {post.author?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {post.author?.name || 'Tim XL Net'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {post.author?.bio || 'Penulis'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 sm:ml-auto">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {post.publishedAt ? formatDate(post.publishedAt, 'long') : 'Draft'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {readTime} menit baca
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {(post.viewCount ?? 0).toLocaleString('id-ID')} views
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div
                    className={cn(
                      'prose prose-lg max-w-none',
                      'prose-headings:font-bold prose-headings:text-gray-900',
                      'prose-p:text-gray-600 prose-p:leading-relaxed',
                      'prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline',
                      'prose-strong:text-gray-800',
                      'prose-ul:text-gray-600 prose-ol:text-gray-600',
                      'prose-li:marker:text-brand-blue',
                      'prose-img:rounded-xl prose-img:shadow-md',
                      'prose-blockquote:border-brand-blue prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1',
                    )}
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                  />

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <ShareButtons title={post.title} slug={post.slug} />
                  </div>
                </div>
              </div>
            </motion.article>

            {/* ═══ SIDEBAR (30%) ══════════════════════════════════════ */}
            <aside className="lg:w-[30%] space-y-6">

              {/* ── Related Posts ──────────────────────────────────── */}
              <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-blue" />
                  Artikel Terkait
                </h3>
                <div className="space-y-4">
                  {relatedPosts.slice(0, 4).map((related) => (
                    <Link
                      key={related.id}
                      href={`/site/blog/${related.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      {related.featuredImage ? (
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={related.featuredImage}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center text-2xl shrink-0">
                          📄
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {related.readTime || estimateReadTime(related.content || '')} menit baca
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* ── WhatsApp CTA ───────────────────────────────────── */}
              <motion.div
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-sm p-6 text-white"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
              >
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Butuh Bantuan?</h3>
                </div>
                <p className="text-sm text-green-100 mb-4 leading-relaxed">
                  Konsultasikan kebutuhan internet Anda dengan tim kami melalui WhatsApp. Gratis!
                </p>
                <a
                  href="https://wa.me/6287777777777?text=Halo,%20saya%20ingin%20konsultasi%20paket%20internet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white text-green-600 font-semibold text-sm rounded-xl hover:bg-green-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat via WhatsApp
                </a>
              </motion.div>

              {/* ── Popular Packages ───────────────────────────────── */}
              <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">Paket Populer</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Temukan paket internet fiber terbaik untuk Anda.
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'XL Home 50 Mbps', price: 'Rp299.000/bln', slug: 'xl-home-50mbps' },
                    { name: 'XL Home 100 Mbps', price: 'Rp449.000/bln', slug: 'xl-home-100mbps' },
                    { name: 'XL Home 300 Mbps', price: 'Rp699.000/bln', slug: 'xl-home-300mbps' },
                  ].map((pkg) => (
                    <Link
                      key={pkg.slug}
                      href={`/site/paket-internet/${pkg.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-blue transition-colors">
                          {pkg.name}
                        </p>
                        <p className="text-xs text-gray-500">{pkg.price}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                    </Link>
                  ))}
                </div>

                <Link href="/site/paket-internet" className="block mt-4">
                  <Button variant="outline" size="sm" fullWidth>
                    Lihat Semua Paket
                  </Button>
                </Link>
              </motion.div>

              {/* ── Sticky Share (Desktop) ─────────────────────────── */}
              <motion.div
                className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={4}
              >
                <h3 className="text-sm font-bold text-gray-700 mb-3">Bagikan Artikel</h3>
                <ShareButtons title={post.title} slug={post.slug} />
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
