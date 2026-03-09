'use client';
import { motion } from 'framer-motion';
import { Wifi, Users, Globe, Award, Shield, Heart, Target, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const stats = [
  { value: '50K+', label: 'Pelanggan Aktif' },
  { value: '300+', label: 'Kota Terjangkau' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Customer Support' },
];

const values = [
  { icon: Zap, title: 'Kecepatan', desc: 'Internet fiber optik super cepat hingga 1 Gbps untuk kebutuhan rumah dan bisnis.' },
  { icon: Shield, title: 'Keamanan', desc: 'Jaringan terlindungi dengan standar keamanan enterprise-grade.' },
  { icon: Heart, title: 'Kepuasan', desc: 'Komitmen kami memberikan pengalaman terbaik untuk setiap pelanggan.' },
  { icon: Target, title: 'Inovasi', desc: 'Terus berinovasi menghadirkan solusi internet terdepan di Indonesia.' },
];

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-violet text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Wifi className="w-4 h-4" /> Tentang Kami
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl mb-6 leading-tight">
              Platform Resmi Internet<br />XL untuk Indonesia
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              XL Net adalah platform marketing sales resmi XL Axiata yang memudahkan Anda menemukan, membandingkan, dan mendaftar paket internet XL terbaik.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-display font-black text-4xl text-neutral-900">{s.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-surface-dim">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <h2 className="font-display font-bold text-3xl text-neutral-900 mb-6 text-center">Cerita Kami</h2>
            <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed space-y-4">
              <p>XL Net hadir sebagai jawaban atas kebutuhan masyarakat Indonesia akan informasi internet rumah yang lengkap dan terpercaya. Sebagai platform resmi XL Axiata, kami menyediakan akses mudah ke seluruh produk internet XL Home.</p>
              <p>Visi kami sederhana: memastikan setiap rumah di Indonesia bisa menikmati internet cepat dan terjangkau. Dengan jaringan fiber optik yang mencakup 300+ kota, kami terus memperluas cakupan untuk menjangkau lebih banyak keluarga Indonesia.</p>
              <p>Tim sales profesional kami siap membantu Anda 24/7 melalui WhatsApp untuk konsultasi gratis, pemilihan paket, dan proses pendaftaran yang mudah.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display font-bold text-3xl text-neutral-900 mb-10 text-center">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="bg-surface-dim rounded-2xl border border-neutral-200 p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="font-display font-bold text-neutral-900 mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface-dim">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl text-neutral-900 mb-4">Tertarik Bergabung?</h2>
          <p className="text-neutral-500 mb-8">Cek coverage area Anda dan dapatkan penawaran terbaik hari ini.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/site/coverage-check"><Button size="lg">Cek Coverage Area</Button></Link>
            <Link href="/site/contact"><Button variant="secondary" size="lg">Hubungi Kami <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
