'use client';
import { motion } from 'framer-motion';
import {
  Wifi, Package, FileText, Star, TrendingUp, Users,
  Eye, AlertCircle, CheckCircle, ArrowUpRight, Plus, BarChart3, MessageSquare, Settings, UserPlus, PhoneCall, Target, Percent,
} from 'lucide-react';
import Link from 'next/link';
import { AdminLayout }      from '@/components/admin/AdminLayout';
import { Button }           from '@/components/ui/Button';
import { Card }             from '@/components/ui/Card';
import { useDashboardStats, useLeadStats } from '@/lib/hooks';
import { formatDate }        from '@/lib/utils';

const statCards = [
  { label: 'Total Provider', key: 'totalProviders', icon: Wifi,     color: 'from-blue-500 to-blue-700',   bg: 'bg-blue-50',   text: 'text-blue-600' },
  { label: 'Total Paket',    key: 'totalPackages',  icon: Package,  color: 'from-violet-500 to-violet-700',bg: 'bg-violet-50', text: 'text-violet-600' },
  { label: 'Blog Post',      key: 'totalBlogPosts', icon: FileText, color: 'from-amber-500 to-amber-700',  bg: 'bg-amber-50',  text: 'text-amber-600' },
  { label: 'Total Ulasan',   key: 'totalReviews',   icon: Star,     color: 'from-green-500 to-green-700',  bg: 'bg-green-50',  text: 'text-green-600' },
];

const leadStatCards = [
  { label: 'Total Leads',   key: 'total',          icon: UserPlus,  bg: 'bg-brand-blue/10',   text: 'text-brand-blue' },
  { label: 'Baru Hari Ini', key: 'newToday',       icon: PhoneCall,  bg: 'bg-green-50',       text: 'text-green-600' },
  { label: 'Converted',     key: 'converted',      icon: Target,     bg: 'bg-violet-50',      text: 'text-violet-600' },
  { label: 'Conv. Rate',    key: 'conversionRate', icon: Percent,    bg: 'bg-amber-50',       text: 'text-amber-600', suffix: '%' },
];

const quickActions = [
  { label: 'Tambah Provider', href: '/admin/providers/create', icon: Wifi,    color: 'bg-brand-blue' },
  { label: 'Tambah Paket',    href: '/admin/packages/create',  icon: Package, color: 'bg-brand-violet' },
  { label: 'Tulis Artikel',   href: '/admin/blog/create',      icon: FileText,color: 'bg-amber-500' },
  { label: 'Kelola Leads',    href: '/admin/leads',            icon: UserPlus,color: 'bg-green-500' },
];

const DEMO_STATS = {
  totalProviders: 4, totalPackages: 24, totalBlogPosts: 18, totalReviews: 1247,
  totalPageViews: 84320, newReviewsThisMonth: 156, pendingReviews: 12,
  topProviders: [],
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboardStats();
  const { data: leadStats } = useLeadStats();
  const stats = (data as unknown as typeof DEMO_STATS) ?? DEMO_STATS;
  const leads = (leadStats as unknown as { total: number; newToday: number; converted: number; conversionRate: number }) ?? { total: 0, newToday: 0, converted: 0, conversionRate: 0 };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-neutral-900">Selamat datang! 👋</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Kelola konten dan data platform XL Net</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/providers/create">
              <Button size="sm"><Plus className="w-4 h-4" /> Tambah Provider</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => {
            const value = stats[card.key as keyof typeof stats] as number;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-neutral-200 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.text}`} />
                  </div>
                  <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +8%
                  </span>
                </div>
                <p className="font-display font-black text-3xl text-neutral-900 mb-0.5">
                  {isLoading ? '—' : value?.toLocaleString('id-ID')}
                </p>
                <p className="text-xs font-medium text-neutral-500">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Lead Stats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-base text-neutral-900">Lead Management</h3>
            <Link href="/admin/leads" className="text-xs text-brand-blue font-semibold hover:underline">Lihat Semua →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {leadStatCards.map((card, i) => {
              const value = leads[card.key as keyof typeof leads] as number;
              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-white rounded-2xl border border-neutral-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                      <card.icon className={`w-4 h-4 ${card.text}`} />
                    </div>
                    <div>
                      <p className="font-display font-black text-xl text-neutral-900">
                        {value?.toLocaleString('id-ID') ?? '0'}{'suffix' in card ? card.suffix : ''}
                      </p>
                      <p className="text-[11px] font-medium text-neutral-500">{card.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Middle row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-surface-dim border border-neutral-100 hover:border-brand-blue/30 hover:bg-blue-50/50 transition-all duration-150 cursor-pointer text-center group">
                    <div className={`w-9 h-9 rounded-xl ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-700 group-hover:text-brand-blue transition-colors leading-tight">
                      {action.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-4">Notifikasi</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">{stats.pendingReviews} ulasan menunggu persetujuan</p>
                  <Link href="/admin/reviews?status=pending" className="text-[11px] text-amber-600 hover:underline">Review sekarang →</Link>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-800">{stats.newReviewsThisMonth} ulasan baru bulan ini</p>
                  <p className="text-[11px] text-green-600">Naik 12% dari bulan lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <Eye className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">{stats.totalPageViews?.toLocaleString('id-ID')} total page views</p>
                  <p className="text-[11px] text-blue-600">Traffic bulan ini</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-neutral-900">Aktivitas Terbaru</h3>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="space-y-3">
              {[
                { action: 'Review baru', detail: 'Andi P. — XL Home 150Mbps', time: '5 menit lalu', color: 'bg-green-500' },
                { action: 'Blog diterbitkan', detail: 'Cara Daftar XL Home 2025', time: '1 jam lalu', color: 'bg-blue-500' },
                { action: 'Paket diperbarui', detail: 'XL Gamer 300Mbps harga', time: '3 jam lalu', color: 'bg-violet-500' },
                { action: 'Provider baru', detail: 'XL Business ditambahkan', time: '1 hari lalu', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${item.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800">{item.action}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
