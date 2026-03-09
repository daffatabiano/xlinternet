'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trash2, Search, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AdminLayout }   from '@/components/admin/AdminLayout';
import { Input }         from '@/components/ui/Input';
import { Badge }         from '@/components/ui/Badge';
import { StarRating }    from '@/components/ui/StarRating';
import { reviewService } from '@/lib/api/services';
import { formatDate }    from '@/lib/utils';

const avatarColors = ['from-brand-blue to-brand-violet','from-emerald-500 to-teal-600','from-amber-500 to-orange-600','from-pink-500 to-rose-600'];

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'all' | 'pending' | 'approved'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', filter],
    queryFn:  () => reviewService.getAll({
      page:     1,
      limit:    50,
      approved: filter === 'all' ? undefined : filter === 'approved',
    }),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-reviews'] });

  const { mutate: approve } = useMutation({
    mutationFn: reviewService.approve,
    onSuccess:  () => { invalidate(); toast.success('Ulasan disetujui'); },
    onError:    () => toast.error('Gagal menyetujui ulasan'),
  });

  const { mutate: reject } = useMutation({
    mutationFn: reviewService.reject,
    onSuccess:  () => { invalidate(); toast.success('Ulasan ditolak'); },
    onError:    () => toast.error('Gagal menolak ulasan'),
  });

  const { mutate: deleteReview } = useMutation({
    mutationFn: reviewService.delete,
    onSuccess:  () => { invalidate(); toast.success('Ulasan dihapus'); },
    onError:    () => toast.error('Gagal menghapus ulasan'),
  });

  const reviews = data?.data ?? [];
  const filtered = reviews.filter((r) =>
    !search || r.userName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase())
  );
  const pending  = reviews.filter((r) => !r.isApproved).length;
  const approved = reviews.filter((r) => r.isApproved).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-display font-bold text-xl text-neutral-900">Manajemen Ulasan</h2>
          <p className="text-sm text-neutral-500">Moderasi ulasan pengguna sebelum ditampilkan</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Ulasan', value: reviews.length, icon: Star,        color: 'bg-blue-50   text-blue-600'  },
            { label: 'Menunggu',     value: pending,        icon: Clock,       color: 'bg-amber-50  text-amber-600' },
            { label: 'Disetujui',    value: approved,       icon: CheckCircle, color: 'bg-green-50  text-green-600' },
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

        {/* Filter + Search */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1">
            {[
              { label: 'Semua',     value: 'all'      as const },
              { label: 'Menunggu', value: 'pending'   as const },
              { label: 'Disetujui',value: 'approved'  as const },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === opt.value
                    ? 'bg-brand-blue text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {opt.label}
                {opt.value === 'pending' && pending > 0 && (
                  <span className="ml-1.5 bg-amber-400 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{pending}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Input
              placeholder="Cari ulasan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Reviews grid */}
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)
            : filtered.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-white rounded-2xl border p-5 ${
                    !review.isApproved ? 'border-amber-200 bg-amber-50/30' : 'border-neutral-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-sm">{review.userName[0]}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <span className="font-semibold text-sm text-neutral-900">{review.userName}</span>
                          <span className="text-neutral-400 mx-1.5">·</span>
                          <span className="text-xs text-neutral-500">{review.userCity}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {review.isApproved
                            ? <Badge variant="green" size="sm" dot>Disetujui</Badge>
                            : <Badge variant="amber" size="sm">Menunggu</Badge>
                          }
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-neutral-400">
                          {review.provider?.name && `· ${review.provider.name}`}
                        </span>
                        <span className="text-xs text-neutral-400">· {formatDate(review.createdAt, 'relative')}</span>
                      </div>

                      <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>

                      {/* Sub-ratings */}
                      <div className="flex gap-4 mt-3">
                        {[
                          { label: 'Kecepatan', val: review.speedRating },
                          { label: 'Harga',     val: review.priceRating },
                          { label: 'Support',   val: review.supportRating },
                        ].map((r) => (
                          <div key={r.label} className="flex items-center gap-1">
                            <span className="text-[10px] text-neutral-400">{r.label}:</span>
                            <StarRating rating={r.val} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {!review.isApproved && (
                        <button
                          onClick={() => approve(review.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Setujui
                        </button>
                      )}
                      {review.isApproved && (
                        <button
                          onClick={() => reject(review.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-semibold hover:bg-neutral-200 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Sembunyikan
                        </button>
                      )}
                      <button
                        onClick={() => { if (confirm('Hapus ulasan ini?')) deleteReview(review.id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
          }

          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
              <p className="text-neutral-400 text-sm">Tidak ada ulasan ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
