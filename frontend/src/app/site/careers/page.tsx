'use client';
import { motion } from 'framer-motion';
import { Briefcase, ExternalLink, MessageCircle, Users, Wifi, Heart } from 'lucide-react';

const perks = [
  { icon: Wifi, title: 'Internet Gratis', desc: 'Paket internet unlimited untuk karyawan.' },
  { icon: Users, title: 'Tim Solid', desc: 'Bekerja dengan profesional berpengalaman.' },
  { icon: Heart, title: 'Work-Life Balance', desc: 'Fleksibel WFH dan jam kerja yang seimbang.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-violet text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Briefcase className="w-4 h-4" /> Karir
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">Bergabung Bersama Kami</h1>
            <p className="text-white/60 max-w-xl mx-auto">Jadilah bagian dari tim yang membangun masa depan internet Indonesia.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-surface-dim">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {/* Perks */}
          <div>
            <h2 className="font-display font-bold text-2xl text-neutral-900 mb-6 text-center">Mengapa Bergabung?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {perks.map((p, i) => (
                <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                    <p.icon className="w-6 h-6 text-brand-blue" />
                  </div>
                  <h3 className="font-display font-bold text-neutral-900 mb-1">{p.title}</h3>
                  <p className="text-sm text-neutral-500">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Current Openings */}
          <div>
            <h2 className="font-display font-bold text-2xl text-neutral-900 mb-6 text-center">Lowongan Saat Ini</h2>
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
              <Briefcase className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 mb-1">Saat ini belum ada lowongan terbuka di XL Net.</p>
              <p className="text-sm text-neutral-400 mb-6">Kunjungi portal karir XL Axiata untuk peluang lainnya.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="https://www.xl.co.id/id/careers" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-blue text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-blue-dark transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" /> Portal Karir XL Axiata
                </a>
                <a href="https://wa.me/6281709998817?text=Halo,%20saya%20tertarik%20untuk%20bergabung%20dengan%20tim%20XL%20Net" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-green/90 transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Hubungi HR via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
