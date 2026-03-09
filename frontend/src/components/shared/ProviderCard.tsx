'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wifi, Star, MapPin, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { formatIDR, formatSpeed } from '@/lib/utils';
import type { Provider } from '@/lib/types';

interface ProviderCardProps {
  provider: Provider;
  index?: number;
  compact?: boolean;
}

const providerGradients: Record<string, string> = {
  indihome:   'from-red-500 to-red-700',
  biznet:     'from-blue-600 to-blue-800',
  myrepublic: 'from-emerald-500 to-teal-700',
  firstmedia: 'from-violet-600 to-purple-800',
  xlhome:     'from-sky-500 to-sky-700',
};

export function ProviderCard({ provider, index = 0, compact }: ProviderCardProps) {
  const gradient = providerGradients[provider.slug] ?? 'from-gray-600 to-gray-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link
        href={`/provider/${provider.slug}`}
        className="block bg-white rounded-2xl border border-neutral-200 overflow-hidden
                   hover:border-brand-blue/30 hover:-translate-y-1 hover:shadow-card-lg
                   transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-brand-blue"
      >
        {/* Top bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <span className="text-white font-display font-black text-sm">
                  {provider.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-neutral-900 text-base leading-tight">
                  {provider.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 capitalize">
                  {provider.type.replace('_', ' ')}
                </p>
              </div>
            </div>
            {provider.isFeatured && (
              <Badge variant="amber" size="sm">⭐ Unggulan</Badge>
            )}
          </div>

          {!compact && (
            <p className="text-sm text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              {provider.description}
            </p>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-surface-dim rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Wifi className="w-3.5 h-3.5 text-brand-blue" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Kecepatan</span>
              </div>
              <p className="font-display font-bold text-neutral-900 text-lg">
                {formatSpeed(provider.maxSpeed)}
              </p>
            </div>
            <div className="bg-surface-dim rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Mulai dari</span>
              </div>
              <p className="font-display font-bold text-neutral-900 text-lg">
                {formatIDR(provider.minPrice, true)}
              </p>
              <p className="text-[10px] text-neutral-400">/bulan</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating rating={provider.rating} size="sm" />
              <span className="text-sm font-semibold text-neutral-700">{provider.rating.toFixed(1)}</span>
              <span className="text-xs text-neutral-400">({provider.reviewCount.toLocaleString('id-ID')} ulasan)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <MapPin className="w-3 h-3" />
              <span>{provider.coverageAreas?.length ?? 0} area</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Lihat semua paket</span>
            <ChevronRight className="w-4 h-4 text-brand-blue group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
