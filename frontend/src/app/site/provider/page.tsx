import type { Metadata } from 'next';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Star, Check, X, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Semua Provider Internet — XL Home & Paket Khusus',
  description: 'Lihat semua pilihan provider internet XL dengan detail lengkap, coverage area, dan paket terbaik.',
};

const providers = [
  {
    name: 'XL Home Fiber',
    tagline: 'Rumah Bahagia, Internet Kencang',
    rating: 4.4,
    reviews: 18420,
    minPrice: 199000,
    maxSpeed: 1000,
    coverage: '300+ kota',
    pros: ['Coverage terluas', 'Harga terjangkau', 'Stabil', 'Gratis instalasi'],
    cons: ['Kontrak 12 bulan', 'Latency bervariasi saat peak hour'],
    featured: true,
  },
  {
    name: 'XL Home Gamer',
    tagline: 'Main Tanpa Lag, Menang Terus',
    rating: 4.6,
    reviews: 8200,
    minPrice: 299000,
    maxSpeed: 500,
    coverage: '200+ kota',
    pros: ['Ping sangat rendah', 'Tanpa throttling', 'Tanpa kontrak', 'Priority gaming'],
    cons: ['Harga lebih mahal', 'Area masih terbatas'],
    featured: true,
  },
  {
    name: 'XL Home Premium',
    tagline: 'Premium Speed, Premium Life',
    rating: 4.5,
    reviews: 5100,
    minPrice: 399000,
    maxSpeed: 2500,
    coverage: '150+ kota',
    pros: ['Kecepatan tertinggi', 'SLA 99.9%', 'Support prioritas', '4K ready'],
    cons: ['Harga premium', 'Kontrak 24 bulan'],
    featured: false,
  },
  {
    name: 'XL Business',
    tagline: 'Bisnis Lancar, Koneksi Tangguh',
    rating: 4.7,
    reviews: 3200,
    minPrice: 599000,
    maxSpeed: 10000,
    coverage: '100+ kota',
    pros: ['SLA sangat tinggi', 'IP publik', 'Dedicated support', 'Enterprise grade'],
    cons: ['Biaya lebih tinggi', 'Khusus segmen bisnis'],
    featured: false,
  },
];

export default function ProvidersPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6">
              Semua Provider XL
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Bandingkan provider XL dengan layanan khusus untuk berbagai kebutuhan: rumah, gaming, atau bisnis.
            </p>
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {providers.map((provider) => (
              <Card key={provider.name} className={`flex flex-col p-8 ${provider.featured ? 'border-2 border-brand-blue bg-blue-50' : ''}`}>
                {/* Header */}
                <div className="mb-6">
                  <h3 className="font-display font-black text-2xl text-neutral-900 mb-2">{provider.name}</h3>
                  <p className="text-neutral-600 italic">&ldquo;{provider.tagline}&rdquo;</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{provider.rating}</span>
                    <span className="text-sm text-neutral-500">({provider.reviews.toLocaleString()} reviews)</span>
                  </div>
                </div>

                {/* Specs */}
                <div className="bg-white rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Harga Mulai:</span>
                    <span className="font-bold text-brand-blue">Rp{(provider.minPrice / 1000).toFixed(0)}K/bulan</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Kecepatan Max:</span>
                    <span className="font-bold">{provider.maxSpeed} Mbps</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Coverage:</span>
                    <span className="font-bold flex items-center gap-1"><MapPin className="w-4 h-4" /> {provider.coverage}</span>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-grow">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" /> Keunggulan
                    </h4>
                    <ul className="space-y-2">
                      {provider.pros.map((pro) => (
                        <li key={pro} className="text-sm text-neutral-700">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <X className="w-4 h-4" /> Kelemahan
                    </h4>
                    <ul className="space-y-2">
                      {provider.cons.map((con) => (
                        <li key={con} className="text-sm text-neutral-700">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Button */}
                <Button className="w-full">Lihat Paket {provider.name}</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Tips */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-black text-3xl md:text-4xl text-center mb-12 text-neutral-900">
            Bagaimana Memilih Provider yang Tepat?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">✅ Pilih XL Home Fiber Jika:</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>• Keluarga kebers yang mencari harga terjangkau</li>
                <li>• Membutuhkan coverage yang luas</li>
                <li>• Menggunakan internet untuk streaming & browsing</li>
                <li>• Budget terbatas</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">🎮 Pilih XL Home Gamer Jika:</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>• Keturunan gamer atau esports player</li>
                <li>• Membutuhkan latency ultra rendah</li>
                <li>• Bermain game online kompetitif</li>
                <li>• Butuh bandwidth dedicated</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">⚡ Pilih XL Home Premium Jika:</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>• Keluarga dengan banyak pengguna sekaligus</li>
                <li>• Sering streaming 4K/8K</li>
                <li>• Multiple video call sekaligus</li>
                <li>• Butuh SLA tinggi & support prioritas</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">🏢 Pilih XL Business Jika:</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>• Bisnis atau perusahaan</li>
                <li>• Membutuhkan IP publik statis</li>
                <li>• SLA 99.99% adalah keharusan</li>
                <li>• Butuh dedicated support & bandwidth</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
