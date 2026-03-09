'use client';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-violet text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Shield className="w-4 h-4" /> Legal
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">Kebijakan Privasi</h1>
            <p className="text-white/60">Terakhir diperbarui: 1 Januari 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-surface-dim">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-10 prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-p:text-neutral-600 prose-li:text-neutral-600 prose-p:leading-relaxed">
            <h2>1. Pendahuluan</h2>
            <p>PT XL Axiata Tbk (&ldquo;Kami&rdquo;, &ldquo;XL&rdquo;, &ldquo;XL Net&rdquo;) berkomitmen untuk melindungi privasi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan XL Net.</p>

            <h2>2. Data yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan informasi berikut:</p>
            <ul>
              <li><strong>Data Identitas:</strong> Nama lengkap, nomor KTP, tanggal lahir.</li>
              <li><strong>Data Kontak:</strong> Nomor telepon, alamat email, alamat rumah.</li>
              <li><strong>Data Layanan:</strong> Paket yang dipilih, riwayat pembayaran, penggunaan layanan.</li>
              <li><strong>Data Teknis:</strong> Alamat IP, jenis perangkat, browser, lokasi.</li>
              <li><strong>Data Formulir:</strong> Informasi yang Anda isi pada formulir pendaftaran, kontak, atau lead capture.</li>
            </ul>

            <h2>3. Penggunaan Data</h2>
            <p>Data Anda digunakan untuk:</p>
            <ul>
              <li>Memproses pendaftaran dan aktivasi layanan.</li>
              <li>Menghubungi Anda terkait layanan, promo, dan informasi penting.</li>
              <li>Meningkatkan kualitas layanan dan pengalaman pengguna.</li>
              <li>Memenuhi kewajiban hukum dan regulasi yang berlaku.</li>
              <li>Analisis internal untuk pengembangan produk.</li>
            </ul>

            <h2>4. Penyimpanan dan Keamanan Data</h2>
            <p>Data Anda disimpan di server yang aman dengan enkripsi standar industri. Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data Anda dari akses tidak sah, pengubahan, pengungkapan, atau penghapusan.</p>

            <h2>5. Berbagi Data dengan Pihak Ketiga</h2>
            <p>Kami tidak menjual data pribadi Anda. Data hanya dibagikan kepada:</p>
            <ul>
              <li>Mitra layanan yang membantu operasional (dengan perjanjian kerahasiaan).</li>
              <li>Pihak berwenang jika diwajibkan oleh hukum yang berlaku.</li>
              <li>Pihak ketiga dengan persetujuan eksplisit dari Anda.</li>
            </ul>

            <h2>6. Hak Anda</h2>
            <p>Anda berhak untuk:</p>
            <ul>
              <li>Mengakses dan memperbarui data pribadi Anda.</li>
              <li>Meminta penghapusan data pribadi (dengan batasan hukum).</li>
              <li>Menolak penggunaan data untuk pemasaran.</li>
              <li>Menarik persetujuan penggunaan data.</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>Website kami menggunakan cookies untuk meningkatkan pengalaman browsing. Anda dapat mengatur preferensi cookies melalui pengaturan browser Anda.</p>

            <h2>8. Perubahan Kebijakan</h2>
            <p>Kami berhak memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan diumumkan melalui website dan berlaku sejak tanggal publikasi.</p>

            <h2>9. Kontak</h2>
            <p>Untuk pertanyaan terkait privasi data, hubungi kami di:</p>
            <ul>
              <li>Email: privacy@xlhome.co.id</li>
              <li>Telepon: 0800-1-500-838</li>
              <li>WhatsApp: 0817-0999-8817</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
