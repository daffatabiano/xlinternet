'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, DollarSign, Gamepad2, Zap, Briefcase } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PackageCard }   from '@/components/shared/PackageCard';
import { Button }        from '@/components/ui/Button';
import { useFeaturedPackages } from '@/lib/hooks';
import { useScrollReveal }    from '@/lib/hooks';
import { useLeadModal } from '@/context/LeadModalContext';
import type { Package } from '@/lib/types';

const DEMO_PACKAGES: Package[] = [
  {
    id: '1', name: 'XL Home 50Mbps', slug: 'xl-home-50',
    provider: { id: '1', name: 'XL Home', slug: 'xlhome', logo: '', description: '', tagline: '', type: 'fiber' as const, rating: 4.4, reviewCount: 18420, minPrice: 199000, maxSpeed: 1000, features: [], pros: [], cons: [], website: '', phone: '', isActive: true, isFeatured: true, coverageAreas: [], createdAt: '', updatedAt: '' },
    providerId: '1', speed: 50, price: 199000, installationFee: 0, contractMonths: 12,
    quota: 'unlimited' as const, latency: 15, features: ['Unlimited', 'Free WiFi Router', 'TV Lokal'],
    isPopular: false, isFeatured: false, category: 'basic', isActive: true, createdAt: '', updatedAt: '',
  },
  {
    id: '2', name: 'XL Home 150Mbps', slug: 'xl-home-150',
    provider: { id: '1', name: 'XL Home', slug: 'xlhome', logo: '', description: '', tagline: '', type: 'fiber' as const, rating: 4.4, reviewCount: 18420, minPrice: 199000, maxSpeed: 1000, features: [], pros: [], cons: [], website: '', phone: '', isActive: true, isFeatured: true, coverageAreas: [], createdAt: '', updatedAt: '' },
    providerId: '1', speed: 150, price: 299000, installationFee: 0, contractMonths: 12,
    quota: 'unlimited' as const, latency: 10, features: ['Unlimited tanpa FUP', 'Free Installation', 'Router WiFi 6'],
    isPopular: true, isFeatured: true, category: 'standard', isActive: true, createdAt: '', updatedAt: '',
  },
  {
    id: '3', name: 'XL Gamer 300Mbps', slug: 'xl-gamer-300',
    provider: { id: '2', name: 'XL Home Gamer', slug: 'xlhome-gamer', logo: '', description: '', tagline: '', type: 'fiber' as const, rating: 4.6, reviewCount: 8200, minPrice: 299000, maxSpeed: 500, features: [], pros: [], cons: [], website: '', phone: '', isActive: true, isFeatured: true, coverageAreas: [], createdAt: '', updatedAt: '' },
    providerId: '2', speed: 300, price: 399000, installationFee: 0, contractMonths: 0,
    quota: 'unlimited' as const, latency: 3, features: ['Gaming Priority Traffic', 'Ultra-low Latency', 'Dedicated BW'],
    isPopular: false, isFeatured: false, category: 'gaming', isActive: true, createdAt: '', updatedAt: '',
  },
];

const filterOptions = [
  { label: 'Semua',   value: 'all', Icon: null },
  { label: 'Termurah', value: 'basic', Icon: DollarSign },
  { label: 'Gaming',  value: 'gaming', Icon: Gamepad2 },
  { label: 'Standar', value: 'standard', Icon: Zap },
  { label: 'Premium',  value: 'premium', Icon: Zap },
  { label: 'Bisnis',  value: 'business', Icon: Briefcase },
];

export function PackagesSection() {
  const { ref, inView } = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('all');
  const { data, isLoading } = useFeaturedPackages();
  const { open: openLeadModal } = useLeadModal();
  
  // API returns Package[] directly in data field, fallback to DEMO
  const packages = (Array.isArray(data) ? data : (data && typeof data === 'object' && 'data' in data ? (data as any).data : null)) ?? DEMO_PACKAGES;
  
  // Filter packages by category
  const filtered = activeFilter === 'all' 
    ? packages 
    : packages.filter((p: Package) => p.category === activeFilter);

  return (
    <section ref={ref} className="section">
      <div className="container-page">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <SectionHeader
            eyebrow="Paket Internet XL"
            eyebrowVariant="violet"
            title="Pilih Paket yang Sesuai Kebutuhan"
            description="Filter berdasarkan kategori untuk menemukan paket XL yang paling cocok untuk Anda."
          />
        </motion.div>

        {/* Filter pills */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 flex-wrap justify-center mb-10"
        >
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
                activeFilter === opt.value
                  ? 'bg-brand-blue text-white border-brand-blue shadow-brand'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-blue/50 hover:text-brand-blue'
              }`}
            >
              {opt.Icon && <opt.Icon className="w-4 h-4" />}
              {opt.label}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-96 rounded-2xl" />)
            : filtered.map((pkg: Package, i: number) => (
                <PackageCard 
                  key={pkg.id} 
                  pkg={pkg} 
                  index={i} 
                  onSelect={() => openLeadModal()} 
                />
              ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/site/paket-internet">
            <Button variant="secondary" size="lg">Lihat Semua Paket XL <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
