'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ProviderCard }  from '@/components/shared/ProviderCard';
import { Button }        from '@/components/ui/Button';
import { useFeaturedProviders } from '@/lib/hooks';
import { useScrollReveal }     from '@/lib/hooks';
import type { Provider } from '@/lib/types';

// Static fallback for SSR / demo
const DEMO_PROVIDERS: Provider[] = [
  {
    id: '1', name: 'XL Home Fiber', slug: 'xlhome', logo: '',
    description: 'Internet fiber optik XL untuk rumah dan keluarga. Kecepatan stabil, harga terjangkau, dan layanan 24 jam.',
    tagline: 'Rumah Bahagia, Internet Kencang',
    type: 'fiber', rating: 4.4, reviewCount: 18420, minPrice: 199000, maxSpeed: 1000,
    features: ['Unlimited', 'No FUP', 'Free Installation', '24/7 Support'],
    pros: ['Harga terjangkau', 'Coverage luas', 'Instalasi gratis'],
    cons: ['Kontrak 12 bulan', 'Latency bervariasi'],
    website: 'https://xl.co.id', phone: '817',
    isActive: true, isFeatured: true,
    coverageAreas: [], createdAt: '', updatedAt: '',
  },
  {
    id: '2', name: 'XL Home Gamer', slug: 'xlhome-gamer', logo: '',
    description: 'Paket khusus gamer dengan latency ultra-rendah dan bandwidth dedicated untuk gaming online.',
    tagline: 'Main Tanpa Lag, Menang Terus',
    type: 'fiber', rating: 4.6, reviewCount: 8200, minPrice: 299000, maxSpeed: 500,
    features: ['Gaming Priority', 'Low Latency', 'Dedicated BW'],
    pros: ['Ping sangat rendah', 'Prioritas gaming', 'Tanpa throttling'],
    cons: ['Harga lebih mahal', 'Area terbatas'],
    website: 'https://xl.co.id', phone: '817',
    isActive: true, isFeatured: true,
    coverageAreas: [], createdAt: '', updatedAt: '',
  },
  {
    id: '3', name: 'XL Home Premium', slug: 'xlhome-premium', logo: '',
    description: 'Layanan premium untuk keluarga aktif dengan kebutuhan streaming 4K, video call, dan WFH intensif.',
    tagline: 'Premium Speed, Premium Life',
    type: 'fiber', rating: 4.5, reviewCount: 5100, minPrice: 399000, maxSpeed: 2500,
    features: ['4K Streaming', 'Multi-device', 'Priority Support'],
    pros: ['Kecepatan tertinggi', 'SLA 99.9%', 'Dedicated support'],
    cons: ['Harga premium', 'Kontrak 24 bulan'],
    website: 'https://xl.co.id', phone: '817',
    isActive: true, isFeatured: false,
    coverageAreas: [], createdAt: '', updatedAt: '',
  },
  {
    id: '4', name: 'XL Business', slug: 'xlbusiness', logo: '',
    description: 'Solusi internet bisnis XL dengan IP publik, SLA guaranteed, dan dedicated bandwidth untuk usaha Anda.',
    tagline: 'Bisnis Lancar, Koneksi Tangguh',
    type: 'fiber', rating: 4.7, reviewCount: 3200, minPrice: 599000, maxSpeed: 10000,
    features: ['Dedicated BW', 'Public IP', 'SLA 99.99%', 'Business Support'],
    pros: ['SLA tinggi', 'IP publik', 'Support prioritas'],
    cons: ['Biaya lebih tinggi', 'Untuk bisnis'],
    website: 'https://xl.co.id', phone: '817',
    isActive: true, isFeatured: false,
    coverageAreas: [], createdAt: '', updatedAt: '',
  },
];

export function ProvidersSection() {
  const { ref, inView } = useScrollReveal();
  const { data, isLoading } = useFeaturedProviders();
  
  // API returns Provider[] directly, fallback to DEMO
  const providers = (Array.isArray(data) ? data : (data as unknown as typeof DEMO_PROVIDERS)) ?? DEMO_PROVIDERS;

  return (
    <section ref={ref} className="section section--alt">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="Paket XL Tersedia"
            title="Pilih Paket XL yang Tepat"
            description="Dari paket ekonomis hingga ultra-premium, XL memiliki pilihan yang pas untuk setiap kebutuhan."
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-2xl" />
              ))
            : providers.map((provider, i) => (
                <ProviderCard key={provider.id} provider={provider} index={i} />
              ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <Link href="/site/provider">
            <Button variant="secondary" size="lg">
              Lihat Semua Paket XL
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
