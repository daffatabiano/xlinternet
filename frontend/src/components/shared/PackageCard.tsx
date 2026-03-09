'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Clock, Wrench, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatIDR, formatSpeed, contractLabel } from '@/lib/utils';
import type { Package } from '@/lib/types';

interface PackageCardProps {
  pkg: Package;
  index?: number;
  onSelect?: (pkg: Package) => void;
}

const categoryConfig = {
  basic:    { label: 'Basic',    variant: 'gray'   as const },
  standard: { label: 'Standard', variant: 'blue'   as const },
  premium:  { label: 'Premium',  variant: 'violet' as const },
  gaming:   { label: 'Gaming',   variant: 'green'  as const },
  business: { label: 'Business', variant: 'amber'  as const },
};

const providerGradients: Record<string, string> = {
  indihome:   'from-red-500 to-red-700',
  biznet:     'from-blue-600 to-blue-800',
  myrepublic: 'from-emerald-500 to-teal-700',
  firstmedia: 'from-violet-600 to-purple-800',
  xlhome:     'from-sky-500 to-sky-700',
};

export function PackageCard({ pkg, index = 0, onSelect }: PackageCardProps) {
  const cat = categoryConfig[pkg.category] ?? categoryConfig.standard;
  const gradient = providerGradients[pkg.provider?.slug ?? ''] ?? 'from-gray-600 to-gray-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        'relative bg-white rounded-2xl border overflow-hidden',
        'hover:-translate-y-1 hover:shadow-card-lg transition-all duration-300',
        pkg.isFeatured
          ? 'border-brand-blue ring-2 ring-brand-blue/10'
          : 'border-neutral-200'
      )}
    >
      {pkg.isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="amber">🔥 Terpopuler</Badge>
        </div>
      )}
      {pkg.isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue to-brand-violet" />
      )}

      <div className="p-6">
        {/* Provider + Package name */}
        <div className="flex items-start gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-black text-[11px]">
              {pkg.provider?.name?.slice(0, 2).toUpperCase() ?? 'XL'}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
              {pkg.provider?.name ?? 'XL Home'}
            </p>
            <h3 className="font-display font-bold text-neutral-900 text-base leading-tight">{pkg.name}</h3>
          </div>
        </div>

        {/* Speed headline */}
        <div className="mb-1">
          <span className="font-display font-black text-5xl text-neutral-900">
            {pkg.speed < 1000 ? pkg.speed : pkg.speed / 1000}
          </span>
          <span className="text-lg font-semibold text-neutral-400 ml-1">
            {pkg.speed < 1000 ? 'Mbps' : 'Gbps'}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <Badge variant={cat.variant} size="sm">{cat.label}</Badge>
          <span className="text-xs text-neutral-400">
            {pkg.quota === 'unlimited' ? 'Unlimited • Tanpa FUP' : `Kuota ${pkg.quota} GB`}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-100 mb-5" />

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-medium">Latency</p>
              <p className="text-sm font-bold text-neutral-800">&lt;{pkg.latency} ms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-medium">Kontrak</p>
              <p className="text-sm font-bold text-neutral-800">{contractLabel(pkg.contractMonths)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-medium">Instalasi</p>
              <p className="text-sm font-bold text-neutral-800">
                {pkg.installationFee === 0 ? 'Gratis' : formatIDR(pkg.installationFee, true)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Wifi className="w-3.5 h-3.5 text-violet-500" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-medium">Tipe</p>
              <p className="text-sm font-bold text-neutral-800">Fiber Optik</p>
            </div>
          </div>
        </div>

        {/* Features */}
        {pkg.features?.length > 0 && (
          <ul className="space-y-1.5 mb-5">
            {pkg.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-2xl font-display font-black text-brand-blue">
              {formatIDR(pkg.price)}
            </p>
            <p className="text-xs text-neutral-400">/bulan</p>
          </div>
        </div>

        <Button
          variant={pkg.isFeatured ? 'primary' : 'secondary'}
          fullWidth
          onClick={() => onSelect?.(pkg)}
        >
          {pkg.isFeatured ? 'Pasang Sekarang' : 'Lihat Detail'}
        </Button>
      </div>
    </motion.div>
  );
}
