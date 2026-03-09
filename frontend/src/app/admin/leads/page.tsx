'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, RefreshCw, Trash2, Phone, MessageCircle,
  Users, UserPlus, UserCheck, TrendingUp, ChevronLeft, ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { leadService } from '@/lib/api/services';
import { formatDate } from '@/lib/utils';
import { useLeads, useLeadStats, useDebounce } from '@/lib/hooks';

/* ── Types ───────────────────────────────────────────────────────────────── */
type LeadSource = 'WEBSITE' | 'COVERAGE_CHECK' | 'PACKAGE_DETAIL' | 'COMPARE_PAGE' | 'BLOG' | 'POPUP' | 'WHATSAPP_BUTTON' | 'CONTACT_FORM' | 'STICKY_CTA';
type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  interest: string;
  packageId?: string;
  package?: any;
  providerId?: string;
  provider?: any;
  source: LeadSource;
  status: LeadStatus;
  message?: string;
  whatsappSent: boolean;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadStats {
  total: number;
  newToday: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  conversionRate: number;
  bySource: { source: string; count: number }[];
  dailyLeads: { date: string; count: number }[];
}

/* ── Constants ───────────────────────────────────────────────────────────── */
const DEMO_LEADS: Lead[] = [
  { id: '1', name: 'Budi Santoso', phone: '6281234567890', email: 'budi@gmail.com', city: 'Jakarta', interest: 'XL Home 100Mbps', source: 'WEBSITE' as const, status: 'NEW' as const, whatsappSent: false, createdAt: '2025-01-15T10:30:00Z', updatedAt: '2025-01-15T10:30:00Z' },
  { id: '2', name: 'Siti Rahayu', phone: '6281345678901', city: 'Bandung', interest: 'XL Home 50Mbps', source: 'COVERAGE_CHECK' as const, status: 'CONTACTED' as const, whatsappSent: true, createdAt: '2025-01-14T09:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: '3', name: 'Ahmad Hidayat', phone: '6281456789012', city: 'Surabaya', interest: 'XL Gamer 150Mbps', source: 'PACKAGE_DETAIL' as const, status: 'CONVERTED' as const, whatsappSent: true, createdAt: '2025-01-13T14:20:00Z', updatedAt: '2025-01-15T16:00:00Z' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: '', label: 'Semua Sumber' },
  { value: 'WEBSITE', label: 'Website' },
  { value: 'COVERAGE_CHECK', label: 'Coverage Check' },
  { value: 'PACKAGE_DETAIL', label: 'Package Detail' },
  { value: 'COMPARE_PAGE', label: 'Compare Page' },
  { value: 'BLOG', label: 'Blog' },
  { value: 'POPUP', label: 'Popup' },
  { value: 'WHATSAPP_BUTTON', label: 'WhatsApp Button' },
  { value: 'CONTACT_FORM', label: 'Contact Form' },
  { value: 'STICKY_CTA', label: 'Sticky CTA' },
];

const STATUS_UPDATE_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
];

const statusBadgeVariant: Record<LeadStatus, 'blue' | 'amber' | 'violet' | 'green' | 'red'> = {
  NEW: 'blue',
  CONTACTED: 'amber',
  QUALIFIED: 'violet',
  CONVERTED: 'green',
  LOST: 'red',
};

/* ══════════════════════════════════════════════════════════════════════════ */
export default function AdminLeadsPage() {
  const qc = useQueryClient();

  /* ── Filters ───────────────────────────────────────────────────────────── */
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [source, setSource]     = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [page, setPage]         = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 400);

  /* ── Data fetching ─────────────────────────────────────────────────────── */
  const { data: leadsData, isLoading: leadsLoading, refetch } = useLeads({
    page,
    limit,
    ...(status && { status }),
    ...(source && { source }),
  });

  const { data: statsData, isLoading: statsLoading } = useLeadStats();

  const leads: Lead[] = leadsData?.data ?? DEMO_LEADS;
  const meta = leadsData?.meta ?? { total: leads.length, page: 1, limit, totalPages: 1 };
  const stats: LeadStats | null = statsData?.data ?? null;

  /* ── Client-side search + date filter ──────────────────────────────────── */
  const filteredLeads = leads.filter((lead) => {
    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        (lead.email?.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Date range filter
    if (dateFrom && new Date(lead.createdAt) < new Date(dateFrom)) return false;
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (new Date(lead.createdAt) > toDate) return false;
    }

    return true;
  });

  /* ── Mutations ─────────────────────────────────────────────────────────── */
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      leadService.updateStatus(id, { status, notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Status lead diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui status'),
  });

  const { mutate: deleteLead } = useMutation({
    mutationFn: leadService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead dihapus');
    },
    onError: () => toast.error('Gagal menghapus lead'),
  });

  /* ── Handlers ──────────────────────────────────────────────────────────── */
  const handleDelete = (lead: Lead) => {
    if (window.confirm(`Hapus lead "${lead.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      deleteLead(lead.id);
    }
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateStatus({ id: leadId, status: newStatus });
  };

  const buildWhatsappUrl = (lead: Lead) => {
    const text = encodeURIComponent(
      `Halo ${lead.name}, saya dari tim sales XL Net. Kami melihat Anda tertarik dengan ${lead.interest}. Apakah ada yang bisa kami bantu?`
    );
    return `https://wa.me/${lead.phone}?text=${text}`;
  };

  const totalPages = meta.totalPages ?? Math.ceil(meta.total / limit);

  /* ── Stat cards data ───────────────────────────────────────────────────── */
  const statCards = [
    {
      label: 'Total Leads',
      value: stats?.total ?? leads.length,
      icon: Users,
      color: 'bg-blue-50 text-brand-blue',
    },
    {
      label: 'Leads Hari Ini',
      value: stats?.newToday ?? 0,
      icon: UserPlus,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Converted',
      value: stats?.converted ?? 0,
      icon: UserCheck,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Conversion Rate',
      value: `${stats?.conversionRate?.toFixed(1) ?? '0.0'}%`,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  /* ══════════════════════════════════════════════════════════════════════── */
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Kelola Leads</h2>
            <p className="text-sm text-neutral-500">Pantau dan kelola semua leads masuk</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              refetch();
              qc.invalidateQueries({ queryKey: ['lead-stats'] });
              toast.success('Data direfresh');
            }}
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* ── Stats Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                {statsLoading ? (
                  <div className="h-7 w-16 bg-neutral-200 rounded-lg animate-pulse" />
                ) : (
                  <p className="font-display font-black text-2xl text-neutral-900">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString('id-ID') : stat.value}
                  </p>
                )}
                <p className="text-xs text-neutral-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              placeholder="Cari nama, telepon, kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            />
            <Select
              options={SOURCE_OPTIONS}
              value={source}
              onChange={(e) => { setSource(e.target.value); setPage(1); }}
            />
            <Input
              type="date"
              placeholder="Dari tanggal"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Sampai tanggal"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-dim border-b border-neutral-200">
                <tr>
                  {['Nama', 'Telepon', 'Kota', 'Sumber', 'Status', 'Dibuat', 'Aksi'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leadsLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7} className="px-5 py-4">
                          <div className="h-6 rounded-lg bg-neutral-100 animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : filteredLeads.map((lead, i) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-5 py-4 min-w-[180px]">
                          <p className="font-semibold text-sm text-neutral-900">{lead.name}</p>
                          {lead.email && (
                            <p className="text-xs text-neutral-400 mt-0.5">{lead.email}</p>
                          )}
                          <p className="text-xs text-neutral-400 mt-0.5">{lead.interest}</p>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-600 font-mono">{lead.phone}</span>
                        </td>

                        {/* City */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-600">{lead.city}</span>
                        </td>

                        {/* Source */}
                        <td className="px-5 py-4">
                          <Badge variant="gray" size="sm">
                            {lead.source.toLowerCase().replace(/_/g, ' ')}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <Badge variant={statusBadgeVariant[lead.status]} size="sm" dot>
                            {lead.status}
                          </Badge>
                        </td>

                        {/* Created */}
                        <td className="px-5 py-4">
                          <span className="text-xs text-neutral-500 whitespace-nowrap">
                            {formatDate(lead.createdAt, 'short')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {/* WhatsApp link */}
                            <a
                              href={buildWhatsappUrl(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                              title="Hubungi via WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* Status update dropdown */}
                            <div className="relative group">
                              <button
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-blue hover:bg-blue-50 transition-colors"
                                title="Ubah Status"
                              >
                                <Phone className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-neutral-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                {STATUS_UPDATE_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() => handleStatusChange(lead.id, opt.value)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                                      lead.status === opt.value
                                        ? 'font-bold text-brand-blue bg-blue-50'
                                        : 'text-neutral-700'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(lead)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filteredLeads.length === 0 && !leadsLoading && (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm font-medium">Belum ada leads</p>
              <p className="text-neutral-300 text-xs mt-1">Leads akan muncul saat ada pengunjung yang mengisi formulir</p>
            </div>
          )}
        </div>

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-200 px-5 py-3">
            <p className="text-xs text-neutral-500">
              Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} dari{' '}
              {meta.total.toLocaleString('id-ID')} leads
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-neutral-300 text-xs">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                        p === page
                          ? 'bg-brand-blue text-white'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
