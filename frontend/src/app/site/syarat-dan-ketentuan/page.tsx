'use client';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-violet text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <FileText className="w-4 h-4" /> Legal
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">Syarat dan Ketentuan</h1>
            <p className="text-white/60">Terakhir diperbarui: 1 Januari 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-surface-dim">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-10 prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-p:text-neutral-600 prose-li:text-neutral-600 prose-p:leading-relaxed">
            <h2>1. Definisi</h2>
            <p>&ldquo;Layanan&rdquo; merujuk pada seluruh produk internet rumah dan bisnis yang ditawarkan oleh XL Net, termasuk namun tidak terbatas pada paket internet fiber optik XL Home.</p>
            <p>&ldquo;Pelanggan&rdquo; adalah individu atau badan usaha yang berlangganan Layanan XL Net.</p>
            <p>&ldquo;Platform&rdquo; merujuk pada website xlnet.co.id dan seluruh aplikasi terkait.</p>

            <h2>2. Ketentuan Umum</h2>
            <ul>
              <li>Dengan menggunakan Platform dan/atau Layanan, Anda setuju terikat dengan Syarat dan Ketentuan ini.</li>
              <li>XL Net berhak mengubah Syarat dan Ketentuan sewaktu-waktu tanpa pemberitahuan sebelumnya.</li>
              <li>Anda wajib berusia minimal 17 tahun atau memiliki persetujuan orang tua/wali untuk menggunakan Layanan.</li>
            </ul>

            <h2>3. Pendaftaran dan Aktivasi</h2>
            <ul>
              <li>Pendaftaran memerlukan data pribadi yang valid dan akurat (KTP, alamat, nomor telepon).</li>
              <li>XL Net berhak menolak atau membatalkan pendaftaran yang tidak memenuhi syarat.</li>
              <li>Aktivasi layanan dilakukan setelah proses verifikasi dan instalasi oleh teknisi resmi.</li>
              <li>Jadwal instalasi tergantung ketersediaan dan kondisi teknis di lokasi Pelanggan.</li>
            </ul>

            <h2>4. Pembayaran</h2>
            <ul>
              <li>Tagihan diterbitkan setiap bulan dan harus dibayar sebelum tanggal jatuh tempo (tanggal 20).</li>
              <li>Keterlambatan pembayaran dapat mengakibatkan penangguhan atau penghentian layanan.</li>
              <li>Biaya tambahan dapat berlaku untuk layanan tertentu (instalasi, relokasi, dll).</li>
              <li>Pembayaran yang telah dilakukan tidak dapat dikembalikan kecuali ditentukan lain.</li>
            </ul>

            <h2>5. Penggunaan Layanan</h2>
            <ul>
              <li>Layanan ditujukan untuk penggunaan personal atau bisnis yang legal.</li>
              <li>Pelanggan dilarang menggunakan Layanan untuk aktivitas ilegal, spam, atau yang merugikan pihak lain.</li>
              <li>XL Net berhak membatasi atau menghentikan Layanan jika terjadi pelanggaran.</li>
              <li>Kecepatan internet dapat bervariasi tergantung kondisi jaringan dan jumlah pengguna.</li>
            </ul>

            <h2>6. Kontrak dan Pembatalan</h2>
            <ul>
              <li>Kontrak berlangganan minimal 12 (dua belas) bulan sejak tanggal aktivasi.</li>
              <li>Pembatalan sebelum masa kontrak berakhir dikenakan biaya penalti sesuai sisa masa kontrak.</li>
              <li>Permintaan pembatalan harus diajukan minimal 30 hari sebelumnya.</li>
              <li>Setelah masa kontrak, langganan berlanjut secara bulanan dan dapat dibatalkan kapan saja.</li>
            </ul>

            <h2>7. SLA (Service Level Agreement)</h2>
            <ul>
              <li>XL Net menjamin uptime layanan sebesar 99.9% per bulan.</li>
              <li>Gangguan yang disebabkan oleh force majeure, maintenance terjadwal, atau kerusakan perangkat Pelanggan tidak termasuk dalam perhitungan SLA.</li>
              <li>Kompensasi SLA diberikan dalam bentuk potongan tagihan bulan berikutnya.</li>
            </ul>

            <h2>8. Batasan Tanggung Jawab</h2>
            <p>XL Net tidak bertanggung jawab atas:</p>
            <ul>
              <li>Kerugian tidak langsung yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan.</li>
              <li>Konten pihak ketiga yang diakses melalui Layanan.</li>
              <li>Gangguan yang disebabkan oleh faktor di luar kendali XL Net.</li>
            </ul>

            <h2>9. Hak Kekayaan Intelektual</h2>
            <p>Seluruh konten, desain, logo, dan materi di Platform adalah milik PT XL Axiata Tbk dan dilindungi oleh hukum hak cipta Indonesia. Reproduksi tanpa izin tertulis dilarang.</p>

            <h2>10. Penyelesaian Sengketa</h2>
            <p>Sengketa diselesaikan secara musyawarah terlebih dahulu. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI) di Jakarta.</p>

            <h2>11. Hukum yang Berlaku</h2>
            <p>Syarat dan Ketentuan ini tunduk pada hukum Republik Indonesia.</p>

            <h2>12. Kontak</h2>
            <p>Untuk pertanyaan mengenai Syarat dan Ketentuan, hubungi:</p>
            <ul>
              <li>Email: legal@xlhome.co.id</li>
              <li>Telepon: 0800-1-500-838</li>
              <li>WhatsApp: 0817-0999-8817</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
