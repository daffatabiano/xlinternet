'use client';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Wifi, Globe, Server, Clock, Phone, MessageCircle } from 'lucide-react';

type StatusLevel = 'operational' | 'degraded' | 'outage';

const statusConfig: Record<StatusLevel, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
  operational: { color: 'text-brand-green', bg: 'bg-brand-green/10', icon: CheckCircle2, label: 'Operasional' },
  degraded: { color: 'text-amber-500', bg: 'bg-amber-50', icon: AlertTriangle, label: 'Gangguan Sebagian' },
  outage: { color: 'text-red-500', bg: 'bg-red-50', icon: XCircle, label: 'Gangguan' },
};

const services = [
  { name: 'Internet Fiber (FTTH)', status: 'operational' as StatusLevel, uptime: '99.98%' },
  { name: 'XL Home Portal', status: 'operational' as StatusLevel, uptime: '99.95%' },
  { name: 'DNS Server', status: 'operational' as StatusLevel, uptime: '99.99%' },
  { name: 'Streaming & Gaming', status: 'operational' as StatusLevel, uptime: '99.97%' },
  { name: 'Customer Portal', status: 'operational' as StatusLevel, uptime: '99.90%' },
  { name: 'Payment Gateway', status: 'operational' as StatusLevel, uptime: '99.99%' },
];

const regions = [
  { name: 'Jabodetabek', status: 'operational' as StatusLevel },
  { name: 'Jawa Barat', status: 'operational' as StatusLevel },
  { name: 'Jawa Tengah', status: 'operational' as StatusLevel },
  { name: 'Jawa Timur', status: 'operational' as StatusLevel },
  { name: 'Sumatera Utara', status: 'operational' as StatusLevel },
  { name: 'Sumatera Selatan', status: 'operational' as StatusLevel },
  { name: 'Kalimantan', status: 'operational' as StatusLevel },
  { name: 'Sulawesi', status: 'operational' as StatusLevel },
  { name: 'Bali & NTB', status: 'operational' as StatusLevel },
];

const incidents: { date: string; title: string; status: string; desc: string }[] = [];

export default function StatusPage() {
  const allOk = services.every(s => s.status === 'operational') && regions.every(r => r.status === 'operational');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-violet text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Activity className="w-4 h-4" /> Status Jaringan
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">Status Layanan XL Home</h1>
            <p className="text-white/60 max-w-xl mx-auto">Pantau status jaringan dan layanan XL Home secara real-time.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-surface-dim">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Overall Status */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-6 text-center ${allOk ? 'bg-brand-green/5 border-brand-green/20' : 'bg-amber-50 border-amber-200'}`}
          >
            {allOk ? <CheckCircle2 className="w-10 h-10 text-brand-green mx-auto mb-3" /> : <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />}
            <h2 className="font-display font-bold text-xl text-neutral-900 mb-1">
              {allOk ? 'Semua Sistem Operasional' : 'Sebagian Sistem Mengalami Gangguan'}
            </h2>
            <p className="text-sm text-neutral-500">Terakhir diperbarui: {new Date().toLocaleString('id-ID')}</p>
          </motion.div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Layanan</h3>
            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden divide-y divide-neutral-100">
              {services.map((s, i) => {
                const cfg = statusConfig[s.status];
                return (
                  <motion.div key={s.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                        <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <span className="font-medium text-neutral-900 text-sm">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-neutral-400 hidden sm:block">Uptime {s.uptime}</span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Status Regional</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {regions.map((r, i) => {
                const cfg = statusConfig[r.status];
                return (
                  <motion.div key={r.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${r.status === 'operational' ? 'bg-brand-green' : r.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-neutral-900">{r.name}</span>
                    <span className={`text-xs ml-auto ${cfg.color}`}>{cfg.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Incidents */}
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Riwayat Insiden</h3>
            {incidents.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-brand-green mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">Tidak ada insiden dalam 30 hari terakhir.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map((inc, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900 text-sm">{inc.title}</h4>
                      <span className="text-xs text-neutral-400">{inc.date}</span>
                    </div>
                    <p className="text-sm text-neutral-500">{inc.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CS CTA */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Mengalami Masalah?</h3>
            <p className="text-neutral-500 text-sm mb-4">Hubungi customer service kami untuk bantuan teknis.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="tel:08001500838" className="inline-flex items-center gap-2 bg-brand-blue text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-blue-dark transition-colors text-sm">
                <Phone className="w-4 h-4" /> 0800-1-500-838
              </a>
              <a href="https://wa.me/6281709998817?text=Halo,%20saya%20mengalami%20gangguan%20internet" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-green/90 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp CS
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
