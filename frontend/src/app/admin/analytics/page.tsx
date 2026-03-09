'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Eye, MousePointer,
  Clock, Globe, Smartphone, Monitor, Tablet, ArrowUpRight, Calendar,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { AdminLayout } from '@/components/admin/AdminLayout';

// ─── Demo data ────────────────────────────────────────────────────────────────
const DAILY_VISITORS = [
  { date: 'Sen', visitors: 1240, pageviews: 3120, leads: 18 },
  { date: 'Sel', visitors: 1380, pageviews: 3540, leads: 24 },
  { date: 'Rab', visitors: 1520, pageviews: 4210, leads: 31 },
  { date: 'Kam', visitors: 1190, pageviews: 2980, leads: 15 },
  { date: 'Jum', visitors: 1680, pageviews: 4620, leads: 39 },
  { date: 'Sab', visitors: 2140, pageviews: 5840, leads: 52 },
  { date: 'Min', visitors: 1890, pageviews: 4990, leads: 44 },
];

const MONTHLY_VISITORS = [
  { date: 'Okt', visitors: 28400, pageviews: 71000, leads: 312 },
  { date: 'Nov', visitors: 31200, pageviews: 78500, leads: 398 },
  { date: 'Des', visitors: 35800, pageviews: 89200, leads: 441 },
  { date: 'Jan', visitors: 41200, pageviews: 103000, leads: 524 },
  { date: 'Feb', visitors: 38600, pageviews: 96400, leads: 487 },
  { date: 'Mar', visitors: 44800, pageviews: 112000, leads: 568 },
];

const TOP_PAGES = [
  { page: '/', title: 'Homepage', views: 18420, bounce: 32.4, time: '2:48' },
  { page: '/site/paket-internet', title: 'Paket Internet', views: 12380, bounce: 28.1, time: '3:42' },
  { page: '/site/coverage-check', title: 'Cek Coverage', views: 9640, bounce: 41.2, time: '1:58' },
  { page: '/site/provider', title: 'Daftar Provider', views: 8120, bounce: 35.7, time: '3:15' },
  { page: '/site/compare', title: 'Bandingkan', views: 6840, bounce: 22.8, time: '5:12' },
  { page: '/site/blog', title: 'Blog', views: 5920, bounce: 48.3, time: '1:34' },
  { page: '/site/review', title: 'Ulasan', views: 4380, bounce: 38.9, time: '2:21' },
];

const TRAFFIC_SOURCES = [
  { name: 'Organic Search', value: 42, color: '#0057B8' },
  { name: 'Direct', value: 28, color: '#6D28D9' },
  { name: 'Referral', value: 15, color: '#10B981' },
  { name: 'Social Media', value: 10, color: '#F59E0B' },
  { name: 'WhatsApp', value: 5, color: '#25D366' },
];

const DEVICES = [
  { name: 'Mobile', value: 61, icon: Smartphone, color: 'text-brand-blue bg-brand-blue/10' },
  { name: 'Desktop', value: 33, icon: Monitor, color: 'text-brand-violet bg-brand-violet/10' },
  { name: 'Tablet', value: 6, icon: Tablet, color: 'text-amber-500 bg-amber-50' },
];

const TOP_CITIES = [
  { city: 'Jakarta', sessions: 18420, pct: 41 },
  { city: 'Surabaya', sessions: 8920, pct: 20 },
  { city: 'Bandung', sessions: 6840, pct: 15 },
  { city: 'Medan', sessions: 4120, pct: 9 },
  { city: 'Semarang', sessions: 3380, pct: 7 },
  { city: 'Lainnya', sessions: 3640, pct: 8 },
];

type Period = '7d' | '30d' | '6m';

const periodLabel: Record<Period, string> = { '7d': '7 Hari', '30d': '30 Hari', '6m': '6 Bulan' };

const STAT_CARDS = [
  { label: 'Total Pengunjung', value: '44,820', change: '+12.4%', up: true, icon: Users, bg: 'bg-brand-blue/10', text: 'text-brand-blue' },
  { label: 'Total Halaman Dilihat', value: '112,480', change: '+18.7%', up: true, icon: Eye, bg: 'bg-brand-violet/10', text: 'text-brand-violet' },
  { label: 'Avg. Session Duration', value: '3:24', change: '+0:18', up: true, icon: Clock, bg: 'bg-green-50', text: 'text-green-600' },
  { label: 'Bounce Rate', value: '34.2%', change: '-2.1%', up: true, icon: MousePointer, bg: 'bg-amber-50', text: 'text-amber-600' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-card p-3 text-xs">
      <p className="font-bold text-neutral-800 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-neutral-500">{p.name}:</span>
          <span className="font-semibold text-neutral-800">{p.value.toLocaleString('id-ID')}</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>('7d');
  const chartData = period === '6m' ? MONTHLY_VISITORS : DAILY_VISITORS;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Analitik Website</h2>
            <p className="text-sm text-neutral-500">Pantau performa dan trafik platform XL Net</p>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', '6m'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  period === p ? 'bg-brand-blue text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-brand-blue'
                }`}
              >
                {periodLabel[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-neutral-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.text}`} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                  {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.change}
                </span>
              </div>
              <p className="font-display font-black text-2xl text-neutral-900 mb-0.5">{card.value}</p>
              <p className="text-xs font-medium text-neutral-500">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main chart */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-base text-neutral-900">Trafik & Lead</h3>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-brand-blue rounded" /> Pengunjung</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-brand-violet rounded" /> Halaman Dilihat</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-brand-green rounded" /> Leads</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="visitors" name="Pengunjung" stroke="#0057B8" strokeWidth={2.5} dot={{ r: 4, fill: '#0057B8' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="pageviews" name="Halaman Dilihat" stroke="#6D28D9" strokeWidth={2.5} dot={{ r: 4, fill: '#6D28D9' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="leads" name="Leads" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Traffic sources */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-4">Sumber Trafik</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                    {TRAFFIC_SOURCES.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {TRAFFIC_SOURCES.map((src) => (
                  <div key={src.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: src.color }} />
                      <span className="text-xs text-neutral-600 truncate">{src.name}</span>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">{src.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-4">Perangkat</h3>
            <div className="space-y-4">
              {DEVICES.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${d.color.split(' ')[1]} flex-shrink-0`}>
                    <d.icon className={`w-4 h-4 ${d.color.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-700">{d.name}</span>
                      <span className="text-sm font-bold text-neutral-900">{d.value}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-blue rounded-full transition-all duration-700" style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top cities */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-4">Kota Teratas</h3>
            <div className="space-y-3">
              {TOP_CITIES.map((c, i) => (
                <div key={c.city} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-700">{c.city}</span>
                      <span className="text-xs text-neutral-500">{c.sessions.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-violet rounded-full" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 w-8 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top pages table */}
        <div className="bg-white rounded-2xl border border-neutral-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h3 className="font-display font-bold text-base text-neutral-900">Halaman Teratas</h3>
            <Globe className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Halaman</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Tayangan</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Bounce Rate</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {TOP_PAGES.map((page, i) => (
                  <motion.tr
                    key={page.page}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-sm text-neutral-900">{page.title}</p>
                      <p className="text-xs text-neutral-400">{page.page}</p>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="font-semibold text-sm text-neutral-900">{page.views.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`text-sm font-medium ${page.bounce > 40 ? 'text-red-500' : 'text-green-500'}`}>{page.bounce}%</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-medium text-neutral-700">{page.time}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
