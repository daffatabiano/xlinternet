'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { packageService } from '@/lib/api/services';
import { useDebounce } from '@/lib/hooks';
import { Package } from '@/lib/types';
import {
  Plus, Edit2, Trash2, Search, Package as PackageIcon,
  Wifi, TrendingUp, CheckCircle, Loader2, Zap,
} from 'lucide-react';

// Fallback data when API is unavailable
const FALLBACK: Package[] = [
  { id: '1', name: 'XL Home 50Mbps',      provider: { id: '1', name: 'XL Home Fiber',    slug: 'xl-home-fiber',    logo: '' } as any, price: 249000, speed: 50,   category: 'HOME',     description: '', isActive: true, features: [], slug: 'xl-home-50mbps'    } as any,
  { id: '2', name: 'XL Home 100Mbps',     provider: { id: '1', name: 'XL Home Fiber',    slug: 'xl-home-fiber',    logo: '' } as any, price: 299000, speed: 100,  category: 'HOME',     description: '', isActive: true, features: [], slug: 'xl-home-100mbps'   } as any,
  { id: '3', name: 'XL Gamer 150Mbps',    provider: { id: '2', name: 'XL Home Gamer',    slug: 'xl-home-gamer',    logo: '' } as any, price: 399000, speed: 150,  category: 'GAMING',   description: '', isActive: true, features: [], slug: 'xl-gamer-150mbps'   } as any,
  { id: '4', name: 'XL Premium 1Gbps',    provider: { id: '3', name: 'XL Home Premium',  slug: 'xl-home-premium',  logo: '' } as any, price: 799000, speed: 1000, category: 'PREMIUM',  description: '', isActive: true, features: [], slug: 'xl-premium-1gbps'   } as any,
  { id: '5', name: 'XL Business 100Mbps', provider: { id: '4', name: 'XL Business',      slug: 'xl-business',      logo: '' } as any, price: 599000, speed: 100,  category: 'BUSINESS', description: '', isActive: true, features: [], slug: 'xl-business-100mbps' } as any,
];

const CATEGORY_COLORS: Record<string, string> = {
  HOME: 'bg-blue-100 text-blue-700',
  GAMING: 'bg-violet-100 text-violet-700',
  PREMIUM: 'bg-amber-100 text-amber-700',
  BUSINESS: 'bg-green-100 text-green-700',
};

export default function PackagesManagementPage() {
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      try {
        const res = await packageService.getAll({ limit: 100 });
        return (res.data ?? []) as Package[];
      } catch {
        return FALLBACK;
      }
    },
    placeholderData: FALLBACK,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => packageService.delete(id),
    onSuccess: () => {
      toast.success('Paket berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
    },
    onError: () => toast.error('Gagal menghapus paket'),
  });

  const packages = (data ?? FALLBACK).filter((p) => {
    const matchSearch = !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchProvider = !providerFilter || p.provider?.name === providerFilter;
    return matchSearch && matchProvider;
  });

  const providerNames = [...new Set(FALLBACK.map((p) => p.provider?.name).filter(Boolean))];
  const totalActive  = packages.filter((p) => p.isActive).length;

  const handleDelete = (pkg: Package) => {
    if (!confirm(`Hapus paket "${pkg.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    deleteMutation.mutate(pkg.id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Kelola Paket</h2>
            <p className="text-sm text-neutral-500">Tambah, edit, atau hapus paket internet</p>
          </div>
          <Link href="/admin/packages/create">
            <Button><Plus className="w-4 h-4" /> Tambah Paket</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Paket',   value: packages.length,  icon: PackageIcon,  bg: 'bg-brand-blue/10',  text: 'text-brand-blue'   },
            { label: 'Aktif',         value: totalActive,       icon: CheckCircle,  bg: 'bg-green-50',       text: 'text-green-600'    },
            { label: 'Tidak Aktif',   value: packages.length - totalActive, icon: Zap, bg: 'bg-amber-50', text: 'text-amber-600'   },
            { label: 'Provider',      value: providerNames.length, icon: Wifi,      bg: 'bg-violet-50',     text: 'text-brand-violet' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.text}`} />
              </div>
              <div>
                <p className="font-display font-black text-xl text-neutral-900">{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex gap-3 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari paket..."
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm outline-none focus:border-brand-blue bg-white text-neutral-700"
          >
            <option value="">Semua Provider</option>
            {providerNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-neutral-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Memuat paket...</span>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-24">
              <PackageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">Tidak ada paket ditemukan</p>
              <p className="text-sm text-neutral-400 mt-1">Coba ubah filter atau tambah paket baru</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Nama Paket</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Provider</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Kecepatan</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Harga</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Kategori</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {packages.map((pkg, i) => (
                    <motion.tr
                      key={pkg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.03 * i }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-neutral-900">{pkg.name}</p>
                        {pkg.slug && <p className="text-xs text-neutral-400">{pkg.slug}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">{pkg.provider?.name ?? '–'}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          {pkg.speed >= 1000 ? `${pkg.speed / 1000} Gbps` : `${pkg.speed} Mbps`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                        Rp{pkg.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[pkg.category] ?? 'bg-neutral-100 text-neutral-600'}`}>
                          {pkg.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                          {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/packages/${pkg.id}/edit`}>
                            <button className="p-2 hover:bg-blue-50 rounded-xl transition-colors" title="Edit paket">
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(pkg)}
                            disabled={deleteMutation.isPending}
                            className="p-2 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40"
                            title="Hapus paket"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
