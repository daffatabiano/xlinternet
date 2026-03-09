import type { Metadata } from 'next';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { PackagesSection } from '@/components/sections/PackagesSection';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Paket Internet XL — Fiber Optik Cepat & Terjangkau',
  description: 'Pilih paket internet XL fiber optik terbaik. Kecepatan hingga 1 Gbps, unlimited tanpa FUP, gratis instalasi.',
};

const allPackages = [
  { name: 'XL Home 30Mbps', speed: 30, price: 199000, features: ['Unlimited', 'Free Router', 'Basic support'] },
  { name: 'XL Home 50Mbps', speed: 50, price: 249000, features: ['Unlimited', 'Free Router', 'TV Lokal', 'Email support'] },
  { name: 'XL Home 100Mbps', speed: 100, price: 299000, features: ['Unlimited tanpa FUP', 'Free Installation', 'WiFi 6 Router', 'Priority support'] },
  { name: 'XL Home 150Mbps', speed: 150, price: 349000, features: ['Unlimited', 'WiFi 6', '2 IP Privat', 'Priority support 24/7'] },
  { name: 'XL Gamer 50Mbps', speed: 50, price: 299000, features: ['Gaming Priority', 'Low Latency <5ms', 'Tanpa Kontrak', 'Gaming support'] },
  { name: 'XL Gamer 150Mbps', speed: 150, price: 399000, features: ['Gaming Priority', 'Ultra-low Latency <3ms', 'Dedicated BW', 'Pro Gaming Support'] },
  { name: 'XL Premium 500Mbps', speed: 500, price: 599000, features: ['4K Streaming', 'Multi-device', 'Priority Support', 'SLA 99.9%'] },
  { name: 'XL Premium 1Gbps', speed: 1000, price: 799000, features: ['4K/8K Streaming', 'SLA 99.9%', 'Dedicated Support', 'IP Publik'] },
];

export default function PackagesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6">
              Semua Paket Internet XL
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Kecepatan fiber optik yang luar biasa dengan harga terjangkau. Pilih paket yang sesuai dengan kebutuhan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {allPackages.map((pkg) => (
              <Card key={pkg.name} className="flex flex-col hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1">
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-brand-blue">{pkg.speed}</span>
                    <span className="text-neutral-600 ml-2">Mbps</span>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3 mb-6">
                    <div className="text-2xl font-bold text-neutral-900">Rp{(pkg.price / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-neutral-500">/bulan</div>
                  </div>
                  <ul className="space-y-2 flex-grow mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Order Sekarang</Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8">
            <h3 className="font-display font-bold text-lg mb-3 text-neutral-900">ℹ️ Semua Paket Termasuk</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-neutral-700">Gratis Instalasi</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-neutral-700">Free WiFi Router</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-neutral-700">Support 24 Jam</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-neutral-700">Unlimited Data</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-brand text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
            Masih Ragu Memilih Paket?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Cek coverage area Anda dan dapatkan rekomendasi paket yang tepat dari tim kami.
          </p>
          <Link href="/site/coverage-check">
            <Button size="lg" className="bg-white hover:bg-white/90 text-brand-blue">
              Cek Coverage Anda <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
