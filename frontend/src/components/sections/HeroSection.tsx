'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Wifi, ArrowRight, CheckCircle2, Zap, Activity, Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCoverageCheck } from '@/lib/hooks';

const stats = [
  { value: '50+', label: 'Paket XL' },
  { value: '300+', label: 'Kota Coverage' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50K+', label: 'Pelanggan Aktif' },
];

const floatingCards = [
  { Icon: Zap, title: 'XL Fiber 300Mbps', sub: 'Rp399.000/bulan', color: 'text-blue-500', delay: 0 },
  { Icon: Activity, title: 'Latency < 5ms', sub: 'Sempurna untuk Gaming', color: 'text-green-500', delay: 2 },
  { Icon: Radio, title: 'Coverage Luas', sub: 'Tersedia di 300+ kota', color: 'text-violet-500', delay: 4 },
];

export function HeroSection() {
  const router = useRouter();
  const { mutate: checkCoverage, isPending } = useCoverageCheck();
  const [address, setAddress]   = useState('');
  const [city, setCity]         = useState('Jakarta');
  const [postalCode, setPostal] = useState('');

  const handleSearch = () => {
    if (address.trim()) {
      router.push(`/site/coverage-check?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&postal=${encodeURIComponent(postalCode)}`);
    } else {
      router.push('/site/paket-internet');
    }
  };

  const handleScrollToPackages = () => {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-hero pt-20 pb-32">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[120px] animate-blob-drift" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-brand-violet/10 rounded-full blur-[120px] animate-blob-drift [animation-delay:-7s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-cyan/8 rounded-full blur-[100px] animate-blob-drift [animation-delay:-3.5s]" />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-60" />
      </div>

      {/* Floating cards — desktop only */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ duration: 0.6, delay: 1 + i * 0.2, repeat: Infinity, repeatDelay: 2 + i, repeatType: 'reverse' }}
          className={`hidden lg:flex absolute items-center gap-3 glass-card rounded-2xl px-4 py-3 shadow-card
            ${i === 0 ? 'top-[22%] left-[8%]' : i === 1 ? 'top-[40%] right-[7%]' : 'bottom-[28%] left-[10%]'}`}
        >
          <card.Icon className={`w-6 h-6 ${card.color}`} />
          <div>
            <p className={`text-sm font-bold ${card.color}`}>{card.title}</p>
            <p className="text-xs text-neutral-500">{card.sub}</p>
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur border border-white/90 rounded-full px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
            Platform Resmi XL Marketing Sales
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-neutral-900 leading-[1.07] tracking-tight mb-6 text-balance"
        >
          Internet XL{' '}
          <span className="relative inline-block">
            <span className="gradient-text">Terbaik</span>
            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
              <path d="M0 5 Q50 1 100 5 Q150 9 200 5" stroke="#0057B8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"/>
            </svg>
          </span>
          {' '}untuk Rumah Anda
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-500 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Temukan paket internet XL yang paling sesuai kebutuhan. Fiber optik cepat, coverage luas, harga terjangkau.
        </motion.p>

        {/* Search box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/85 backdrop-blur-xl border border-white/95 rounded-2xl p-2 shadow-[0_20px_80px_rgba(0,0,0,0.12)] w-full max-w-2xl mx-auto mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-1">
            <div className="flex items-center gap-2.5 flex-1 px-3">
              <Search className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Masukkan alamat atau nama area..."
                className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none py-3 sm:py-2.5"
              />
            </div>
            <div className="hidden sm:block w-px self-stretch bg-neutral-200 my-1" />
            <div className="flex items-center gap-2 px-3 min-w-fit">
              <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kota"
                className="bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 outline-none py-3 sm:py-2.5 w-full sm:w-auto"
              />
            </div>
            <Button onClick={handleSearch} loading={isPending} size="md" className="rounded-xl shrink-0">
              Cek Provider
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 text-xs text-neutral-400 flex-wrap"
        >
          {['Gratis tanpa biaya pendaftaran', 'Respons dalam 24 jam', 'Instalasi profesional'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-6 md:gap-12 mt-14 flex-wrap"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display font-black text-3xl md:text-4xl text-neutral-900">{stat.value}</p>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-[11px] text-neutral-400 font-medium">Scroll untuk melihat lebih</span>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-neutral-300 flex items-start justify-center pt-1.5 pointer-events-none"
        >
          <div className="w-1 h-1.5 rounded-full bg-neutral-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
