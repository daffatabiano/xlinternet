'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Share2, ThumbsUp, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReviews, useCreateReview } from '@/lib/hooks';
import type { Review } from '@/lib/types';

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Interactive Star Input ───────────────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
          <svg className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const FILTERS = ['Semua', 'Terverifikasi', '5 Bintang', '4 Bintang', '3 Bintang'] as const;
const PAGE_LIMIT = 10;

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    userCity: '',
    comment: '',
    rating: 0,
    speedRating: 0,
    priceRating: 0,
    supportRating: 0,
    providerId: '',
  });

  const { data, isLoading } = useReviews({ page, limit: PAGE_LIMIT });
  const createReview = useCreateReview();

  const reviews: Review[] = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 };

  // ── Client-side filter (on current page) ──────────────────────────────────
  const filteredReviews = useMemo(() => {
    if (activeFilter === 'Semua') return reviews;
    if (activeFilter === 'Terverifikasi') return reviews.filter((r) => r.isVerified);
    if (activeFilter === '5 Bintang') return reviews.filter((r) => r.rating === 5);
    if (activeFilter === '4 Bintang') return reviews.filter((r) => r.rating === 4);
    if (activeFilter === '3 Bintang') return reviews.filter((r) => r.rating === 3);
    return reviews;
  }, [reviews, activeFilter]);

  // ── Computed Stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { avgRating: 0, totalReviews: meta.total, satisfiedPct: 0, verifiedCount: 0 };
    }
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const satisfiedPct = Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100);
    const verifiedCount = reviews.filter((r) => r.isVerified).length;
    return { avgRating: Math.round(avgRating * 10) / 10, totalReviews: meta.total, satisfiedPct, verifiedCount };
  }, [reviews, meta.total]);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) return;
    createReview.mutate(formData as any, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ userName: '', userCity: '', comment: '', rating: 0, speedRating: 0, priceRating: 0, supportRating: 0, providerId: '' });
      },
    });
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6">
              Review dari Customer Kami
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Ribuan pelanggan XL Net puas dengan kecepatan fiber, instalasi cepat, dan layanan customer support terbaik.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-blue">{stats.avgRating}</div>
                <div className="text-sm text-neutral-600">Rating Rata-rata</div>
                <StarRating rating={Math.round(stats.avgRating)} />
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-blue">
                  {stats.totalReviews >= 1000 ? `${(stats.totalReviews / 1000).toFixed(1)}K` : stats.totalReviews}
                </div>
                <div className="text-sm text-neutral-600">Review Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-blue">{stats.satisfiedPct}%</div>
                <div className="text-sm text-neutral-600">Customer Puas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-blue">{stats.verifiedCount}</div>
                <div className="text-sm text-neutral-600">Review Terverifikasi</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter */}
      <section className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto flex-wrap">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
                    activeFilter === filter
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white border-neutral-200 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-blue mb-4" />
              <p className="text-neutral-500">Memuat review...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500">Belum ada review.</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="p-6 md:p-8 hover:shadow-card-lg transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-neutral-900">{review.userName}</h3>
                          {review.isVerified && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">✓ Terverifikasi</span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500">
                          {review.userCity}
                          {review.package ? ` • ${review.package.name}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-neutral-700 leading-relaxed mb-4">{review.comment}</p>

                    {/* Sub-ratings */}
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-500 mb-4">
                      <span>Kecepatan: {review.speedRating}/5</span>
                      <span>Harga: {review.priceRating}/5</span>
                      <span>Support: {review.supportRating}/5</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 text-sm text-neutral-500 pt-4 border-t border-neutral-100">
                      <button className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Membantu ({review.helpfulCount})
                      </button>
                      <button className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <span className="ml-auto text-xs text-neutral-400">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-neutral-200 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | 'dots')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('dots');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === 'dots' ? (
                        <span key={`dots-${idx}`} className="px-2 text-neutral-400">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                            page === item
                              ? 'bg-brand-blue text-white'
                              : 'border border-neutral-200 hover:border-brand-blue hover:text-brand-blue'
                          }`}
                        >
                          {item}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="p-2 rounded-lg border border-neutral-200 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Write Review CTA / Form */}
      <section className="py-20 md:py-28 bg-gradient-brand text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {!showForm ? (
            <>
              <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
                Bagikan Pengalaman Anda
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Pelanggan XL Net? Bagikan review dan rating Anda untuk membantu calon pelanggan lain membuat keputusan terbaik.
              </p>
              <Button size="lg" className="bg-white hover:bg-white/90 text-brand-blue" onClick={() => setShowForm(true)}>
                Tulis Review <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white text-neutral-900 rounded-2xl p-6 md:p-8 text-left space-y-5">
              <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">Tulis Review</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nama</label>
                  <input
                    type="text"
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData((f) => ({ ...f, userName: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Kota</label>
                  <input
                    type="text"
                    required
                    value={formData.userCity}
                    onChange={(e) => setFormData((f) => ({ ...f, userCity: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Rating Keseluruhan</label>
                <StarInput value={formData.rating} onChange={(v) => setFormData((f) => ({ ...f, rating: v }))} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Kecepatan</label>
                  <StarInput value={formData.speedRating} onChange={(v) => setFormData((f) => ({ ...f, speedRating: v }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Harga</label>
                  <StarInput value={formData.priceRating} onChange={(v) => setFormData((f) => ({ ...f, priceRating: v }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Support</label>
                  <StarInput value={formData.supportRating} onChange={(v) => setFormData((f) => ({ ...f, supportRating: v }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Komentar</label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData((f) => ({ ...f, comment: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" disabled={createReview.isPending}>
                  {createReview.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Mengirim...
                    </>
                  ) : (
                    'Kirim Review'
                  )}
                </Button>
              </div>

              {createReview.isError && (
                <p className="text-red-500 text-sm">Gagal mengirim review. Silakan coba lagi.</p>
              )}
            </form>
          )}
        </div>
      </section>
    </>
  );
}
