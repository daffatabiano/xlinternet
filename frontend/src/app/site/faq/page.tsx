'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';

type FAQ = { q: string; a: string };

const faqCategories: Record<string, FAQ[]> = {
  'Pendaftaran': [
    { q: 'Bagaimana cara mendaftar XL Home?', a: 'Anda bisa mendaftar melalui website ini, WhatsApp sales kami di 0817-0999-8817, atau mengunjungi XL Center terdekat. Proses pendaftaran hanya membutuhkan KTP dan 10-15 menit.' },
    { q: 'Dokumen apa saja yang diperlukan?', a: 'Cukup siapkan KTP yang masih berlaku. Untuk pelanggan bisnis, diperlukan NPWP dan surat keterangan domisili usaha.' },
    { q: 'Berapa lama proses instalasi?', a: 'Setelah pendaftaran disetujui, instalasi akan dilakukan dalam 3-7 hari kerja. Teknisi kami akan menghubungi Anda untuk menjadwalkan waktu instalasi.' },
    { q: 'Apakah ada biaya pemasangan?', a: 'Biaya pemasangan bervariasi tergantung paket yang dipilih. Beberapa paket sudah termasuk gratis instalasi. Hubungi sales kami untuk informasi terbaru.' },
  ],
  'Teknis': [
    { q: 'Berapa kecepatan internet yang ditawarkan?', a: 'Kecepatan mulai dari 20 Mbps hingga 1 Gbps tergantung paket yang dipilih. Semua paket menggunakan teknologi Fiber To The Home (FTTH).' },
    { q: 'Apakah ada batasan kuota?', a: 'Tidak. Semua paket XL Home adalah unlimited tanpa FUP (Fair Usage Policy). Anda bisa menggunakan internet sepuasnya.' },
    { q: 'Apa yang harus dilakukan jika internet lambat?', a: 'Restart router dengan mencabut dan memasang kembali kabel power. Jika masih bermasalah, hubungi CS kami di 0800-1-500-838 atau WhatsApp 0817-0999-8817.' },
    { q: 'Apakah bisa menggunakan router sendiri?', a: 'Ya, Anda bisa menggunakan router sendiri. Namun kami merekomendasikan menggunakan router yang kami sediakan untuk performa optimal.' },
  ],
  'Billing': [
    { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Pembayaran bisa melalui transfer bank, virtual account, e-wallet (GoPay, OVO, Dana, ShopeePay), minimarket (Alfamart, Indomaret), dan auto-debit kartu kredit.' },
    { q: 'Kapan tanggal jatuh tempo pembayaran?', a: 'Tanggal jatuh tempo adalah tanggal 20 setiap bulannya. Tagihan akan dikirim melalui email dan SMS pada tanggal 1.' },
    { q: 'Apa yang terjadi jika terlambat bayar?', a: 'Layanan akan dinonaktifkan sementara setelah 7 hari dari tanggal jatuh tempo. Aktifasi kembali otomatis setelah pembayaran lunas.' },
    { q: 'Bagaimana cara upgrade/downgrade paket?', a: 'Hubungi CS kami melalui WhatsApp atau telepon. Perubahan paket akan berlaku di periode billing berikutnya.' },
  ],
  'Coverage': [
    { q: 'Bagaimana cara cek coverage area?', a: 'Gunakan fitur Cek Coverage di website kami. Masukkan alamat lengkap atau kota Anda untuk mengetahui ketersediaan layanan.' },
    { q: 'Area mana saja yang sudah tercover?', a: 'XL Home sudah tersedia di 300+ kota di Pulau Jawa, Sumatera, Kalimantan, Sulawesi, dan Bali. Coverage terus diperluas setiap bulan.' },
    { q: 'Bagaimana jika area saya belum tercover?', a: 'Anda bisa mendaftarkan minat melalui form di website atau WhatsApp kami. Kami akan menghubungi Anda ketika layanan tersedia di area Anda.' },
  ],
  'Umum': [
    { q: 'Apakah ada kontrak minimal?', a: 'Ya, kontrak minimal 12 bulan. Pembatalan sebelum masa kontrak berakhir akan dikenakan biaya penalti sesuai ketentuan berlaku.' },
    { q: 'Apakah ada garansi layanan?', a: 'Ya, kami menjamin SLA 99.9% uptime. Jika terjadi gangguan lebih dari 24 jam, Anda berhak mendapat kompensasi sesuai ketentuan.' },
    { q: 'Bagaimana cara menghubungi Customer Service?', a: 'Hubungi 0800-1-500-838 (24/7), WhatsApp 0817-0999-8817, atau email cs@xlhome.co.id.' },
    { q: 'Apakah bisa pindah alamat?', a: 'Ya, Anda bisa mengajukan relokasi layanan. Proses relokasi membutuhkan waktu 7-14 hari kerja dan biaya teknis. Hubungi CS untuk informasi lebih lanjut.' },
  ],
};

const allCategories = Object.keys(faqCategories);

export default function FAQPage() {
  const [active, setActive] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const filteredFaqs = useMemo(() => {
    const cats = category === 'Semua' ? allCategories : [category];
    const results: { cat: string; q: string; a: string }[] = [];
    cats.forEach(cat => {
      (faqCategories[cat] || []).forEach(f => {
        if (!search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) {
          results.push({ cat, ...f });
        }
      });
    });
    return results;
  }, [search, category]);

  const toggle = (key: string) => setActive(prev => (prev === key ? null : key));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-violet text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <HelpCircle className="w-4 h-4" /> Pusat Bantuan
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">Frequently Asked Questions</h1>
            <p className="text-white/60 max-w-xl mx-auto mb-8">Temukan jawaban untuk pertanyaan yang sering diajukan seputar layanan XL Home.</p>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-2xl bg-white/10 backdrop-blur border border-white/20 pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 outline-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-surface-dim">
        <div className="max-w-4xl mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {['Semua', ...allCategories].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-brand-blue'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Tidak ada pertanyaan yang cocok.</p>
              </div>
            )}
            {filteredFaqs.map((faq, i) => {
              const key = `${faq.cat}-${i}`;
              const isOpen = active === key;
              return (
                <motion.div key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <button
                    onClick={() => toggle(key)}
                    className={`w-full text-left rounded-2xl border bg-white p-5 transition-all duration-300 ${
                      isOpen ? 'border-brand-blue shadow-card' : 'border-neutral-200 hover:shadow-card-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-block text-xs font-medium text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-lg">{faq.cat}</span>
                        <span className="font-medium text-neutral-900 text-sm md:text-base">{faq.q}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-neutral-600 text-sm leading-relaxed mt-4 pt-4 border-t border-neutral-100">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center rounded-2xl bg-white border border-neutral-200 p-8">
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Belum menemukan jawaban?</h3>
            <p className="text-neutral-500 text-sm mb-4">Tim sales kami siap membantu Anda melalui WhatsApp.</p>
            <a href="https://wa.me/6281709998817?text=Halo,%20saya%20butuh%20bantuan%20terkait%20layanan%20XL%20Home" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-green/90 transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
