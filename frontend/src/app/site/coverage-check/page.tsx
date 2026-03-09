import type { Metadata } from 'next';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Search, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cek Coverage XL — Apakah XL Tersedia di Area Anda?',
  description: 'Periksa ketersediaan layanan XL Home Fiber di lokasi Anda dengan mudah.',
};

export default function CoverageCheckPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6">
              Cek Coverage XL di Area Anda
            </h1>
            <p className="text-lg text-neutral-600 mb-12">
              Masukkan alamat Anda dan temukan paket internet XL yang tersedia secara instant.
            </p>

            {/* Search Form */}
            <Card className="p-6 md:p-8 shadow-card-lg">
              <div className="space-y-6">
                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Alamat Lengkap
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Contoh: Jl. Sudirman No. 123, Jakarta..."
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Kota
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <select className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue appearance-none bg-white">
                        <option>Jakarta Selatan</option>
                        <option>Jakarta Pusat</option>
                        <option>Surabaya</option>
                        <option>Bandung</option>
                        <option>Medan</option>
                        <option>Yogyakarta</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Kode Pos (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 12000"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                {/* Submit */}
                <Button size="lg" className="w-full">
                  Cek Ketersediaan XL
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Result: Available */}
          <div className="mb-12">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 md:p-8 rounded-lg mb-6">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-green-900 mb-1">
                    ✓ XL Home Fiber Tersedia!
                  </h3>
                  <p className="text-green-800">
                    Great news! XL Home Fiber sudah tersedia di area Jl. Sudirman, Jakarta Selatan.
                  </p>
                </div>
              </div>
            </div>

            {/* Available Packages */}
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-lg text-neutral-900">Paket yang Tersedia:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'XL Home 50Mbps', price: 249000, features: ['50 Mbps', 'Unlimited', 'Free Installation'] },
                  { name: 'XL Home 100Mbps', price: 299000, features: ['100 Mbps', 'Unlimited', 'WiFi 6 Router'] },
                  { name: 'XL Home 150Mbps', price: 349000, features: ['150 Mbps', 'Unlimited', '2 IP Privat'] },
                  { name: 'XL Premium 1Gbps', price: 799000, features: ['1000 Mbps', 'SLA 99.9%', 'Priority Support'] },
                ].map((pkg) => (
                  <Card key={pkg.name} className="p-4 hover:shadow-card transition-all duration-300">
                    <h4 className="font-bold text-neutral-900 mb-2">{pkg.name}</h4>
                    <div className="text-2xl font-bold text-brand-blue mb-3">
                      Rp{(pkg.price / 1000).toFixed(0)}K <span className="text-sm text-neutral-600">/bulan</span>
                    </div>
                    <ul className="text-xs text-neutral-600 space-y-1 mb-4">
                      {pkg.features.map((f) => (
                        <li key={f}>✓ {f}</li>
                      ))}
                    </ul>
                    <Button className="w-full text-sm">Pesan Sekarang</Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 md:p-8">
              <h3 className="font-bold text-lg text-neutral-900 mb-6">Langkah Selanjutnya:</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Pilih Paket',
                    desc: 'Pilih paket XL yang paling sesuai dengan kebutuhan dan budget Anda.',
                  },
                  {
                    step: 2,
                    title: 'Konfirmasi Data',
                    desc: 'Isi formulir data diri dan pilih waktu instalasi yang sesuai.',
                  },
                  {
                    step: 3,
                    title: 'Proses Instalasi',
                    desc: 'Tim teknisi profesional kami akan datang ke rumah Anda.',
                  },
                  {
                    step: 4,
                    title: 'Aktivasi',
                    desc: 'Nikmati internet XL fiber dengan kecepatan yang dijanjikan!',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-blue text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-neutral-900">{item.title}</h4>
                      <p className="text-neutral-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Result: Not Available (Example) */}
          <div className="mt-16 pt-16 border-t border-neutral-200">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 md:p-8 rounded-lg mb-6">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-amber-900 mb-1">
                    📡 XL Belum Tersedia di Area Ini
                  </h3>
                  <p className="text-amber-800">
                    Sayangnya, XL Home Fiber belum mencakup area ini. Namun, kami terus mengembangkan jaringan kami.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h4 className="font-bold text-neutral-900 mb-3">Hubungi sales kami:</h4>
                <div className="space-y-2 text-sm text-neutral-600">
                  <p>📞 Telepon: +62-817-XLNET (817-95638)</p>
                  <p>💬 WhatsApp: Hubungi kami untuk info terbaru</p>
                  <p>✉️ Email: sales@xlnet.id</p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h4 className="font-bold text-neutral-900 mb-3">Update Coverage:</h4>
                <div className="space-y-2 text-sm text-neutral-600">
                  <p>Daftarkan email Anda untuk mendapat notifikasi ketika XL tersedia di area Anda.</p>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="email"
                      placeholder="Email Anda"
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-brand-blue"
                    />
                    <Button size="sm">Submit</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
