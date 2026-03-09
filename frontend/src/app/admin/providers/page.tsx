'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout }   from '@/components/admin/AdminLayout';
import { Button }        from '@/components/ui/Button';
import { Input }         from '@/components/ui/Input';
import { Badge }         from '@/components/ui/Badge';
import { StarRating }    from '@/components/ui/StarRating';
import { providerService } from '@/lib/api/services';
import { formatIDR } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks';
import type { Provider } from '@/lib/types';

// Demo data for display
const DEMO: Provider[] = [
  { id: '1', name: 'XL Home Fiber', slug: 'xlhome', logo: '', description: 'Paket internet fiber XL untuk rumah', tagline: '', type: 'fiber', rating: 4.4, reviewCount: 18420, minPrice: 199000, maxSpeed: 1000, features: [], pros: [], cons: [], website: '', phone: '817', isActive: true, isFeatured: true, coverageAreas: [], createdAt: '2024-01-15', updatedAt: '2024-11-01' },
  { id: '2', name: 'XL Home Gamer', slug: 'xlhome-gamer', logo: '', description: 'Paket gaming ultra-low latency', tagline: '', type: 'fiber', rating: 4.6, reviewCount: 8200, minPrice: 299000, maxSpeed: 500, features: [], pros: [], cons: [], website: '', phone: '817', isActive: true, isFeatured: true, coverageAreas: [], createdAt: '2024-03-01', updatedAt: '2024-10-20' },
  { id: '3', name: 'XL Home Premium', slug: 'xlhome-premium', logo: '', description: 'Paket premium kecepatan tertinggi', tagline: '', type: 'fiber', rating: 4.5, reviewCount: 5100, minPrice: 399000, maxSpeed: 2500, features: [], pros: [], cons: [], website: '', phone: '817', isActive: true, isFeatured: false, coverageAreas: [], createdAt: '2024-05-10', updatedAt: '2024-11-05' },
  { id: '4', name: 'XL Business', slug: 'xlbusiness', logo: '', description: 'Solusi internet bisnis dan enterprise', tagline: '', type: 'fiber', rating: 4.7, reviewCount: 3200, minPrice: 599000, maxSpeed: 10000, features: [], pros: [], cons: [], website: '', phone: '817', isActive: false, isFeatured: false, coverageAreas: [], createdAt: '2024-06-01', updatedAt: '2024-11-10' },
];

export default function AdminProvidersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-providers', debouncedSearch],
    queryFn: () => providerService.getAll({ page: 1, limit: 20 }),
  });

  const { mutate: toggleActive } = useMutation({
    mutationFn: providerService.toggleActive,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-providers'] }); toast.success('Status diperbarui'); },
    onError: () => toast.error('Gagal memperbarui status'),
  });

  const { mutate: deleteProvider } = useMutation({
    mutationFn: providerService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-providers'] }); toast.success('Provider dihapus'); },
    onError: () => toast.error('Gagal menghapus provider'),
  });

  const providers = data?.data ?? DEMO;
  const filtered = providers.filter((p) =>
    !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleDelete = (provider: Provider) => {
    if (confirm(`Hapus provider "${provider.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteProvider(provider.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Manajemen Provider</h2>
            <p className="text-sm text-neutral-500">Kelola data provider internet XL</p>
          </div>
          <Link href="/admin/providers/create">
            <Button><Plus className="w-4 h-4" /> Tambah Provider</Button>
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Cari provider..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-dim border-b border-neutral-200">
                <tr>
                  {['Provider', 'Tipe', 'Harga Mulai', 'Speed Maks', 'Rating', 'Status', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="skeleton h-8 rounded-lg" /></td></tr>
                    ))
                  : filtered.map((provider, i) => (
                      <motion.tr
                        key={provider.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        {/* Provider name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-[10px] font-black">{provider.name.slice(0,2).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-neutral-900">{provider.name}</p>
                              <p className="text-[11px] text-neutral-400">{provider.slug}</p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4">
                          <Badge variant="blue" size="sm" className="capitalize">{provider.type}</Badge>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-neutral-800">{formatIDR(provider.minPrice, true)}/bln</span>
                        </td>

                        {/* Speed */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-neutral-800">
                            {provider.maxSpeed >= 1000 ? `${provider.maxSpeed / 1000} Gbps` : `${provider.maxSpeed} Mbps`}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <StarRating rating={provider.rating} size="sm" />
                            <span className="text-xs font-semibold text-neutral-700">{provider.rating.toFixed(1)}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleActive(provider.id)}
                            className="flex items-center gap-1.5"
                          >
                            {provider.isActive
                              ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-xs font-semibold text-green-600">Aktif</span></>
                              : <><ToggleLeft className="w-5 h-5 text-neutral-300" /><span className="text-xs font-semibold text-neutral-400">Nonaktif</span></>
                            }
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Link href={`/provider/${provider.slug}`} target="_blank">
                              <button className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-blue hover:bg-blue-50 transition-colors" title="Lihat">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            <Link href={`/admin/providers/${provider.id}/edit`}>
                              <button className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(provider)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-sm">Tidak ada provider ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
