import type { Metadata } from 'next';
import { SiteLayout } from '@/components/layout/SiteLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const metadata: Metadata = {
  title: 'Blog XL Net — Tips, Tutorial & Review Internet Fiber',
  description: 'Baca artikel terbaru tentang internet XL, tips menggunakan fiber, tutorial, dan review paket internet terbaik.',
};

const blogPosts = [
  {
    id: 1,
    title: 'Kenapa XL Home Fiber Terbaik untuk Keluarga Indonesia 2025',
    slug: 'xl-home-fiber-terbaik-2025',
    excerpt: 'Analisis mendalam mengapa XL Home Fiber menjadi pilihan utama jutaan keluarga Indonesia.',
    category: 'Review',
    author: 'Tim XL Net',
    date: '18 Mar 2024',
    readTime: 8,
    image: '🌐',
  },
  {
    id: 2,
    title: 'Cara Daftar XL Home: Panduan Lengkap dari A sampai Z',
    slug: 'cara-daftar-xl-home',
    excerpt: 'Panduan step-by-step cara mendaftar paket internet XL Home mulai dari cek coverage hingga instalasi.',
    category: 'Tutorial',
    author: 'Tim XL Net',
    date: '15 Mar 2024',
    readTime: 5,
    image: '📝',
  },
  {
    id: 3,
    title: 'Optimasi WiFi Router: Tips Agar Signal WiFi Lebih Kuat',
    slug: 'tips-optimasi-wifi',
    excerpt: 'Pelajari cara mengoptimalkan pengaturan router XL untuk mendapatkan sinyal WiFi terkuat di seluruh rumah.',
    category: 'Tips',
    author: 'Tim XL Net',
    date: '12 Mar 2024',
    readTime: 6,
    image: '📡',
  },
  {
    id: 4,
    title: 'Perbandingan Kecepatan: XL Fiber vs Provider Lain',
    slug: 'perbandingan-kecepatan-provider',
    excerpt: 'Kami melakukan test kecepatan dan membandingkan performa XL Home Fiber dengan provider internet lain.',
    category: 'Perbandingan',
    author: 'Tim XL Net',
    date: '10 Mar 2024',
    readTime: 10,
    image: '⚡',
  },
  {
    id: 5,
    title: 'Streaming 4K Lancar: Kecepatan Minimum yang Dibutuhkan',
    slug: 'kecepatan-minimum-streaming-4k',
    excerpt: 'Berapa kecepatan internet yang dibutuhkan untuk streaming video 4K tanpa buffering? Pelajari lebih lanjut.',
    category: 'Tips',
    author: 'Tim XL Net',
    date: '8 Mar 2024',
    readTime: 5,
    image: '📺',
  },
  {
    id: 6,
    title: 'Gaming Online Tanpa Lag: Panduan Lengkap untuk Gamer',
    slug: 'gaming-online-tanpa-lag',
    excerpt: 'Semua yang perlu Anda ketahui untuk gaming online dengan latency rendah dan tidak ada lag.',
    category: 'Panduan',
    author: 'Tim XL Net',
    date: '5 Mar 2024',
    readTime: 7,
    image: '🎮',
  },
];

const categories = ['Semua', 'Review', 'Tutorial', 'Tips', 'Perbandingan', 'Panduan'];

export default function BlogPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6">
              Blog & Artikel XL Net
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Temukan tips, tutorial, dan informasi terbaru tentang internet fiber XL untuk meningkatkan pengalaman online Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:justify-center flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-150 border ${
                  cat === 'Semua'
                    ? 'bg-brand-blue text-white border-brand-blue'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col">
                  {/* Image/Icon area */}
                  <div className="w-full h-40 bg-gradient-to-br from-brand-blue/10 to-brand-violet/10 flex items-center justify-center text-5xl">
                    {post.image}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue/10 text-brand-blue">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg md:text-xl text-neutral-900 mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-neutral-600 text-sm mb-4 flex-grow line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 text-xs text-neutral-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-brand text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
            Jangan Lewatkan Artikel Terbaru
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Dapatkan tips dan informasi terbaru langsung di email Anda setiap minggu.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Masukkan email Anda..."
              className="flex-1 px-4 py-3 rounded-lg text-neutral-900 outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button size="lg" className="bg-white hover:bg-white/90 text-brand-blue">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
