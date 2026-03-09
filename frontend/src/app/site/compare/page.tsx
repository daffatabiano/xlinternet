import type { Metadata } from 'next';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bandingkan Paket Internet XL — Pilih Mana Terbaik',
  description: 'Bandingkan paket internet XL secara detail. Lihat perbedaan kecepatan, harga, fitur, dan pilih yang cocok.',
};

const compareData = [
  {
    category: 'Kecepatan',
    items: [
      { label: 'XL Home 50', value: '50 Mbps' },
      { label: 'XL Home 100', value: '100 Mbps' },
      { label: 'XL Gamer 150', value: '150 Mbps' },
      { label: 'XL Premium 1G', value: '1000 Mbps' },
    ],
  },
  {
    category: 'Harga per Bulan',
    items: [
      { label: 'XL Home 50', value: 'Rp249K' },
      { label: 'XL Home 100', value: 'Rp299K' },
      { label: 'XL Gamer 150', value: 'Rp399K' },
      { label: 'XL Premium 1G', value: 'Rp799K' },
    ],
  },
  {
    category: 'Latency',
    items: [
      { label: 'XL Home 50', value: '15-20 ms' },
      { label: 'XL Home 100', value: '12-15 ms' },
      { label: 'XL Gamer 150', value: '2-5 ms' },
      { label: 'XL Premium 1G', value: '2-8 ms' },
    ],
  },
  {
    category: 'Kontrak',
    items: [
      { label: 'XL Home 50', value: '12 bulan' },
      { label: 'XL Home 100', value: '12 bulan' },
      { label: 'XL Gamer 150', value: 'Tanpa Kontrak' },
      { label: 'XL Premium 1G', value: '24 bulan' },
    ],
  },
];

const features = [
  'Unlimited Data',
  'Free Installation',
  'Free WiFi Router',
  '4K Streaming',
  'Multi-Device',
  'Gaming Priority',
  'SLA Guarantee',
  'IP Publik',
  'Priority Support',
];

const packageFeatures: Record<string, boolean[]> = {
  'XL Home 50': [true, true, true, false, true, false, false, false, false],
  'XL Home 100': [true, true, true, true, true, false, false, false, false],
  'XL Gamer 150': [true, true, true, true, true, true, false, false, false],
  'XL Premium 1G': [true, true, true, true, true, true, true, true, true],
};

export default function ComparePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6">
              Bandingkan Paket XL
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Lihat perbedaan detail antar paket untuk memilih yang paling sesuai dengan kebutuhan dan budget Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Tables */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Specs Table */}
          <div className="overflow-x-auto mb-12">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-neutral-200">
                  <th className="text-left py-4 px-4 font-bold text-neutral-900">Kriteria</th>
                  <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Home 50</th>
                  <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Home 100</th>
                  <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Gamer 150</th>
                  <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Premium 1G</th>
                </tr>
              </thead>
              <tbody>
                {compareData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                    <td className="py-4 px-4 font-semibold text-neutral-900">{row.category}</td>
                    {row.items.map((item, j) => (
                      <td key={j} className="text-center py-4 px-4 text-neutral-700">{item.value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Features Table */}
          <div className="mb-12">
            <h2 className="font-bold text-2xl mb-6 text-neutral-900">Fitur & Benefit</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200 bg-neutral-50">
                    <th className="text-left py-4 px-4 font-bold text-neutral-900">Fitur</th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Home 50</th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Home 100</th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Gamer 150</th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-900">XL Premium 1G</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                      <td className="py-4 px-4 text-neutral-900">{feature}</td>
                      {Object.entries(packageFeatures).map(([pkg, hasFeatures]) => (
                        <td key={pkg} className="text-center py-4 px-4">
                          {hasFeatures[i] ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-neutral-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['XL Home 50', 'XL Home 100', 'XL Gamer 150', 'XL Premium 1G'].map((pkg) => (
              <Card key={pkg} className="p-6 text-center hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-bold text-lg mb-4">{pkg}</h3>
                <Button className="w-full">Pilih Paket</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-black text-3xl md:text-4xl text-center mb-12">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              { q: 'Paket mana yang paling cocok untuk keluarga?', a: 'XL Home 100Mbps atau XL Home 150Mbps cocok untuk keluarga 4-5 orang dengan multiple devices.' },
              { q: 'Apakah semua paket unlimited data?', a: 'Ya, semua paket XL adalah unlimited tanpa FUP (Fair Usage Policy).' },
              { q: 'Berapa lama instalasi?', a: 'Instalasi biasanya selesai dalam 1-2 hari kerja setelah order.' },
              { q: 'Apakah bisa tukar paket?', a: 'Bisa, Anda dapat upgrade atau downgrade paket kapan saja dengan menghubungi customer service.' },
            ].map((faq, i) => (
              <details key={i} className="group p-6 border border-neutral-200 rounded-lg hover:border-brand-blue transition-colors">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-neutral-900">
                  {faq.q}
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-neutral-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-brand text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
            Sudah Tahu Pilihan Anda?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Pesan paket XL Anda sekarang dan nikmati internet cepat dengan gratis instalasi!
          </p>
          <Link href="/site/paket-internet">
            <Button size="lg" className="bg-white hover:bg-white/90 text-brand-blue">
              Lihat Paket <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
