'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, CheckCircle2, XCircle, Loader2, ArrowRight, Wifi, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PackageCard } from '@/components/shared/PackageCard';
import { useCoverageCheck } from '@/lib/hooks';
import { useScrollReveal } from '@/lib/hooks';
import { useLeadModal } from '@/context/LeadModalContext';
import type { CoverageCheckResult } from '@/lib/types';

export function CoverageSection() {
  const { ref, inView } = useScrollReveal();
  const { mutate, isPending, data, reset } = useCoverageCheck();
  const { open: openLeadModal } = useLeadModal();
  const [form, setForm] = useState({ address: '', city: '', postalCode: '' });
  
  // data dari mutation adalah ApiResponse<CoverageCheckResult>
  const result = data?.data as CoverageCheckResult | undefined;

  const handleCheck = () => {
    if (!form.city) return;
    mutate(form);
  };

  return (
    <section ref={ref} className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F1A3A 50%, #140D30 100%)' }}>
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-brand-violet/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              eyebrow="Coverage Checker"
              title="Cek Provider XL di Area Anda"
              description="Masukkan alamat Anda dan temukan paket internet XL yang tersedia secara instan."
              align="left"
              dark
            />

            {/* Feature points */}
            <div className="space-y-4">
              {[
                { icon: '📍', title: 'Real-time Coverage', desc: 'Data coverage diperbarui langsung dari server XL' },
                { icon: '⚡', title: 'Hasil Instan', desc: 'Cek tersedia dalam hitungan detik' },
                { icon: '💰', title: 'Langsung Pesan', desc: 'Pilih paket terbaik dan langsung daftar' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-sm text-white/40 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-dark rounded-3xl p-8"
          >
            <h3 className="font-display font-bold text-xl text-white mb-1.5">Cek Coverage XL</h3>
            <p className="text-sm text-white/40 mb-6">Temukan paket yang tersedia di lokasi Anda</p>

            <div className="space-y-4">
              <Input
                label="Alamat Lengkap"
                placeholder="Jl. Sudirman No. 10, Blok A"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                dark
                icon={<MapPin className="w-4 h-4" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Kota / Kabupaten"
                  placeholder="Jakarta Selatan"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  dark
                />
                <Input
                  label="Kode Pos"
                  placeholder="12190"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  dark
                />
              </div>

              <Button
                fullWidth
                loading={isPending}
                onClick={handleCheck}
                className="mt-2"
                size="lg"
              >
                <Search className="w-4 h-4" />
                Cek Coverage Sekarang
              </Button>
            </div>

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                {result.availableProviders.length > 0 ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">
                        XL tersedia di area Anda!
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.availableProviders.map(({ provider }) => (
                        <span key={provider.id} className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs font-semibold text-white">
                          <Wifi className="w-3 h-3" />
                          {provider.name}
                        </span>
                      ))}
                    </div>
                    <Button onClick={openLeadModal} variant="ghost" size="sm" className="mt-3 text-green-400 hover:bg-green-500/10 p-0 gap-1 w-full justify-center">
                      Pesan Sekarang <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-red-400">
                        Maaf, XL belum tersedia di area ini
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mb-3">Tapi jangan khawatir! Hubungi tim sales kami untuk informasi terbaru tentang ketersediaan layanan.</p>
                    <div className="flex gap-2">
                      <Button onClick={openLeadModal} size="sm" className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20">
                        <Phone className="w-3.5 h-3.5" /> Hubungi Sales
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
