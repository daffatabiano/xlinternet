'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Globe, EyeOff, BookOpen } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AdminLayout }  from '@/components/admin/AdminLayout';
import { Button }       from '@/components/ui/Button';
import { Input }        from '@/components/ui/Input';
import { Badge }        from '@/components/ui/Badge';
import { blogService }  from '@/lib/api/services';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks';

export default function AdminBlogPage() {
  const qc      = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn:  () => blogService.getAll({ page: 1, limit: 50 }),
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: blogService.delete,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success('Artikel dihapus'); },
    onError:    () => toast.error('Gagal menghapus artikel'),
  });

  const { mutate: publishPost } = useMutation({
    mutationFn: blogService.publish,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success('Artikel diterbitkan'); },
    onError:    () => toast.error('Gagal menerbitkan artikel'),
  });

  const { mutate: unpublishPost } = useMutation({
    mutationFn: blogService.unpublish,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success('Artikel disembunyikan'); },
    onError:    () => toast.error('Gagal menyembunyikan artikel'),
  });

  const posts = data?.data ?? [];
  const filtered = posts.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );
  const published   = posts.filter((p) => p.isPublished).length;
  const unpublished = posts.filter((p) => !p.isPublished).length;

  const catColors: Record<string, 'blue' | 'green' | 'violet' | 'amber' | 'red'> = {
    panduan: 'blue', tutorial: 'green', review: 'violet', tips: 'amber', perbandingan: 'red',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Manajemen Blog</h2>
            <p className="text-sm text-neutral-500">Kelola artikel dan konten edukasi</p>
          </div>
          <Link href="/admin/blog/create">
            <Button><Plus className="w-4 h-4" /> Tulis Artikel</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Artikel', value: posts.length, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
            { label: 'Diterbitkan',   value: published,    icon: Globe,    color: 'bg-green-50 text-green-600' },
            { label: 'Draft',         value: unpublished,  icon: EyeOff,   color: 'bg-amber-50 text-amber-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-black text-2xl text-neutral-900">{stat.value}</p>
                <p className="text-xs text-neutral-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <Input
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-dim border-b border-neutral-200">
                <tr>
                  {['Judul', 'Kategori', 'Penulis', 'Read Time', 'Views', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="skeleton h-6 rounded-lg" /></td></tr>
                    ))
                  : filtered.map((post, i) => (
                      <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-5 py-4 min-w-[260px]">
                          <p className="font-semibold text-sm text-neutral-900 line-clamp-2">{post.title}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">{post.slug}</p>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={catColors[post.category?.slug] ?? 'gray'} size="sm">
                            {post.category?.name ?? '—'}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-600">{post.author?.name ?? '—'}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-600">{post.readTime} min</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-600">{post.viewCount.toLocaleString('id-ID')}</span>
                        </td>
                        <td className="px-5 py-4">
                          {post.isPublished
                            ? <Badge variant="green" size="sm" dot>Terbit</Badge>
                            : <Badge variant="gray"  size="sm">Draft</Badge>
                          }
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-neutral-500 whitespace-nowrap">
                            {post.isPublished && post.publishedAt
                              ? formatDate(post.publishedAt, 'short')
                              : formatDate(post.createdAt, 'short')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            {post.isPublished ? (
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <button className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-blue hover:bg-blue-50 transition-colors" title="Lihat"><Eye className="w-4 h-4" /></button>
                              </Link>
                            ) : null}
                            <Link href={`/admin/blog/${post.id}/edit`}>
                              <button className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                            </Link>
                            <button
                              onClick={() => post.isPublished ? unpublishPost(post.id) : publishPost(post.id)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                              title={post.isPublished ? 'Sembunyikan' : 'Terbitkan'}
                            >
                              {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => { if (confirm(`Hapus artikel "${post.title}"?`)) deletePost(post.id); }}
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
            <div className="text-center py-16"><p className="text-neutral-400 text-sm">Belum ada artikel</p></div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
