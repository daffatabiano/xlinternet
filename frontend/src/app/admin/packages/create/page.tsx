'use client';
import { useState, useEffect } from 'react';
import { useRouter }  from 'next/navigation';
import { useForm }    from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }          from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminLayout }  from '@/components/admin/AdminLayout';
import { Button }       from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { packageService, providerService } from '@/lib/api/services';

/* ── Demo fallback providers ─────────────────────────────────────────────── */
const DEMO_PROVIDERS = [
  { value: 'demo-1', label: 'XL Home Fiber' },
  { value: 'demo-2', label: 'Indihome' },
  { value: 'demo-3', label: 'Biznet Home' },
];

/* ── Zod schema ──────────────────────────────────────────────────────────── */
const schema = z.object({
  name:            z.string().min(2, 'Nama minimal 2 karakter'),
  slug:            z.string().min(2, 'Slug minimal 2 karakter').regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung'),
  providerId:      z.string().min(1, 'Provider wajib dipilih'),
  category:        z.enum(['basic', 'standard', 'premium', 'gaming', 'business']),
  speed:           z.coerce.number().min(1, 'Kecepatan minimal 1 Mbps'),
  price:           z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  installationFee: z.coerce.number().min(0, 'Biaya tidak boleh negatif'),
  contractMonths:  z.coerce.number().min(0, '0 = tanpa kontrak'),
  quota:           z.string().min(1, 'Kuota wajib diisi'), // "unlimited" or numeric string
  latency:         z.coerce.number().min(0, 'Latensi tidak boleh negatif'),
  isActive:        z.boolean().optional(),
  isPopular:       z.boolean().optional(),
  isFeatured:      z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ── Select options ──────────────────────────────────────────────────────── */
const categoryOptions = [
  { value: 'basic',    label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium',  label: 'Premium' },
  { value: 'gaming',   label: 'Gaming' },
  { value: 'business', label: 'Business' },
];

const quotaOptions = [
  { value: 'unlimited', label: 'Unlimited' },
  { value: 'custom',    label: 'Custom (GB)' },
];

/* ── Slug helper ─────────────────────────────────────────────────────────── */
function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function CreatePackagePage() {
  const router = useRouter();
  const qc     = useQueryClient();

  const [features, setFeatures]     = useState<string[]>(['']);
  const [quotaType, setQuotaType]   = useState<'unlimited' | 'custom'>('unlimited');
  const [customQuota, setCustomQuota] = useState('');

  /* ── Fetch providers for dropdown ──────────────────────────────────────── */
  const { data: providersData } = useQuery({
    queryKey: ['admin-providers-list'],
    queryFn:  () => providerService.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const providerOptions =
    providersData?.data && providersData.data.length > 0
      ? providersData.data.map((p) => ({ value: p.id, label: p.name }))
      : DEMO_PROVIDERS;

  /* ── Form ──────────────────────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category:        'standard',
      quota:           'unlimited',
      contractMonths:  0,
      installationFee: 0,
      latency:         0,
      isActive:        true,
      isPopular:       false,
      isFeatured:      false,
    },
  });

  /* Auto-generate slug from name */
  const nameValue = watch('name');
  useEffect(() => {
    if (nameValue) setValue('slug', toSlug(nameValue), { shouldValidate: true });
  }, [nameValue, setValue]);

  /* Keep hidden quota field in sync */
  useEffect(() => {
    if (quotaType === 'unlimited') {
      setValue('quota', 'unlimited', { shouldValidate: true });
    } else {
      setValue('quota', customQuota || '0', { shouldValidate: true });
    }
  }, [quotaType, customQuota, setValue]);

  /* ── Mutation ──────────────────────────────────────────────────────────── */
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Partial<Record<string, unknown>>) => packageService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-packages'] });
      qc.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paket berhasil ditambahkan!');
      router.push('/admin/packages');
    },
    onError: () => toast.error('Gagal menambahkan paket'),
  });

  const onSubmit = (values: FormValues) => {
    const payload: Record<string, unknown> = {
      ...values,
      quota:    values.quota === 'unlimited' ? 'unlimited' : Number(values.quota),
      features: features.filter(Boolean),
    };
    mutate(payload);
  };

  /* ── List helpers (same pattern as provider create) ────────────────────── */
  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => [...prev, '']);

  const updateListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number, val: string) =>
    setter((prev) => prev.map((item, i) => (i === idx ? val : item)));

  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    setter((prev) => prev.filter((_, i) => i !== idx));

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <AdminLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/packages">
            <button className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Tambah Paket Baru</h2>
            <p className="text-sm text-neutral-500">Isi informasi lengkap paket internet baru</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ── Basic Info ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display font-bold text-base text-neutral-900">Informasi Dasar</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Nama Paket" placeholder="Paket Gaming 100 Mbps" error={errors.name?.message} {...register('name')} />
              <Input label="Slug (URL)" placeholder="paket-gaming-100mbps" error={errors.slug?.message} {...register('slug')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select label="Provider" options={providerOptions} error={errors.providerId?.message} {...register('providerId')} />
              <Select label="Kategori" options={categoryOptions} error={errors.category?.message} {...register('category')} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input label="Kecepatan (Mbps)" type="number" placeholder="100" error={errors.speed?.message} {...register('speed')} />
              <Input label="Harga /bulan (IDR)" type="number" placeholder="299000" error={errors.price?.message} {...register('price')} />
              <Input label="Biaya Instalasi (IDR)" type="number" placeholder="0" error={errors.installationFee?.message} {...register('installationFee')} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input label="Kontrak (bulan)" type="number" placeholder="0" error={errors.contractMonths?.message} {...register('contractMonths')} />

              {/* Quota – select between unlimited / custom */}
              <div>
                <Select
                  label="Kuota"
                  options={quotaOptions}
                  value={quotaType}
                  onChange={(e) => setQuotaType(e.target.value as 'unlimited' | 'custom')}
                />
              </div>
              {quotaType === 'custom' ? (
                <Input
                  label="Kuota (GB)"
                  type="number"
                  placeholder="500"
                  value={customQuota}
                  onChange={(e) => setCustomQuota(e.target.value)}
                />
              ) : (
                <Input label="Latensi (ms)" type="number" placeholder="5" error={errors.latency?.message} {...register('latency')} />
              )}
            </div>

            {/* Show latency field when quota is custom (it was displaced above) */}
            {quotaType === 'custom' && (
              <div className="grid grid-cols-3 gap-4">
                <Input label="Latensi (ms)" type="number" placeholder="5" error={errors.latency?.message} {...register('latency')} />
              </div>
            )}

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded accent-brand-blue" />
                <span className="text-sm font-medium text-neutral-700">Aktifkan Paket</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register('isPopular')} className="w-4 h-4 rounded accent-brand-blue" />
                <span className="text-sm font-medium text-neutral-700">Populer</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded accent-brand-blue" />
                <span className="text-sm font-medium text-neutral-700">Unggulan</span>
              </label>
            </div>
          </div>

          {/* ── Features ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-4">Fitur Paket</h3>
            <div className="space-y-2.5">
              {features.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListItem(setFeatures, idx, e.target.value)}
                    placeholder={`Fitur ${idx + 1}...`}
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(setFeatures, idx)}
                      className="p-2.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={() => addListItem(setFeatures)}>
                <Plus className="w-3.5 h-3.5" /> Tambah Fitur
              </Button>
            </div>
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button type="submit" loading={isPending} size="lg">
              <Save className="w-4 h-4" /> Simpan Paket
            </Button>
            <Link href="/admin/packages">
              <Button type="button" variant="secondary" size="lg">Batal</Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
