'use client';
import { motion } from 'framer-motion';
import { Phone, Clock, MessageCircle, Headphones } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LeadCaptureForm } from '@/components/shared/LeadCaptureForm';
import { useScrollReveal } from '@/lib/hooks';

export function LeadSection() {
  const { ref, inView } = useScrollReveal();

  const salesNumber = process.env.NEXT_PUBLIC_WA_SALES || '6281709998817';

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 md:p-14"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — info */}
            <div>
              <SectionHeader
                eyebrow="Konsultasi Gratis"
                eyebrowVariant="green"
                title="Konsultasi Gratis dengan Tim XL"
                description="Ceritakan kebutuhan internet Anda, kami bantu pilihkan paket terbaik. Tim sales kami siap membantu via WhatsApp."
                align="left"
                dark
              />

              <div className="space-y-4 mt-8">
                {[
                  { icon: Phone, label: 'Telepon Sales', value: '817', color: 'bg-brand-blue/20 text-brand-blue' },
                  { icon: MessageCircle, label: 'WhatsApp', value: `+62 817 0999 8817`, color: 'bg-green-500/20 text-green-400' },
                  { icon: Clock, label: 'Jam Operasional', value: '08.00 – 22.00 WIB', color: 'bg-amber-500/20 text-amber-400' },
                  { icon: Headphones, label: 'Respon Rata-rata', value: '< 5 menit', color: 'bg-violet-500/20 text-violet-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 font-medium">{item.label}</p>
                      <p className="text-sm font-bold text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl"
            >
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-1">Hubungi Kami Sekarang</h3>
              <p className="text-sm text-neutral-500 mb-5">Isi form di bawah, kami akan langsung menghubungi via WhatsApp</p>
              <LeadCaptureForm source="WEBSITE" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
