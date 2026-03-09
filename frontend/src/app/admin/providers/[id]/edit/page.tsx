'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload, Plus, X, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { providerService } from '@/lib/api/services';

/* ── Zod schema ──────────────────────────────────────────────────────────── */
const schema = z.object({
  name:        z.string().min(2, 'Nama minimal 2 karakter'),
  slug:        z.string().min(2, 'Slug minimal 2 karakter').regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  tagline:     z.string().min(5, 'Tagline minimal 5 karakter'),
  type:        z.enum(['fiber', 'wireless', 'cable', 'hybrid']),
  minPrice:    z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  maxSpeed:    z.coerce.number().min(1, 'Kecepatan minimal 1 Mbps'),
  website:     z.string().url('URL tidak valid').optional().or(z.literal('')),
  phone:       z.string().optional(),
  isFeatured:  z.boolean().optional(),
  isActive:    z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ── Select options ──────────────────────────────────────────────────────── */
const typeOptions = [
  { value: 'fiber',    label: 'Fiber Optik' },
  { value: 'wireless', label: 'Fixed Wireless' },
  { value: 'cable',    label: 'Kabel' },
  { value: 'hybrid',   label: 'Hybrid' },
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
export default function EditProviderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const qc = useQueryClient();

  const [features, setFeatures]         = useState<string[]>(['']);
  const [pros, setPros]                 = useState<string[]>(['']);
  const [cons, setCons]                 = useState<string[]>(['']);
  const [logo, setLogo]                 = useState<File | null>(null);
  const [logoPreview, setLogoPreview]   = useState('');

  /* ── Fetch provider by ID ──────────────────────────────────────────────── */
  const { data: providerData, isLoading } = useQuery({
    queryKey: ['admin-provider', id],
    queryFn:  () => providerService.getById(id),
    enabled:  !!id,
  });

  /* ── Form ──────────────────────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'fiber', isActive: true, isFeatured: false },
  });

  /* Pre-fill form when data arrives */
  useEffect(() => {
    if (!providerData?.data) return;
    const prov = providerData.data;

    reset({
      name:        prov.name,
      slug:        prov.slug,
      description: prov.description,
      tagline:     prov.tagline,
      type:        prov.type,
      minPrice:    prov.minPrice,
      maxSpeed:    prov.maxSpeed,
      website:     prov.website || '',
      phone:       prov.phone || '',
      isActive:    prov.isActive,
      isFeatured:  prov.isFeatured,
    });

    setFeatures(prov.features?.length ? prov.features : ['']);
    setPros(prov.pros?.length ? prov.pros : ['']);
    setCons(prov.cons?.length ? prov.cons : ['']);

    if (prov.logo) setLogoPreview(prov.logo);
  }, [providerData, reset]);

  /* Auto-generate slug from name */
  const nameValue = watch('name');
  useEffect(() => {
    if (nameValue) setValue('slug', toSlug(nameValue), { shouldValidate: true });
  }, [nameValue, setValue]);

  /* ── Mutation ──────────────────────────────────────────────────────────── */
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => providerService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-providers'] });
      qc.invalidateQueries({ queryKey: ['admin-provider', id] });
      qc.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Provider berhasil diperbarui!');
      router.push('/admin/providers');
    },
    onError: () => toast.error('Gagal memperbarui provider'),
  });

  const onSubmit = (values: FormValues) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)));
    fd.append('features', JSON.stringify(features.filter(Boolean)));
    fd.append('pros',     JSON.stringify(pros.filter(Boolean)));
    fd.append('cons',     JSON.stringify(cons.filter(Boolean)));
    if (logo) fd.append('logo', logo);
    mutate(fd);
  };

  /* ── File handler ──────────────────────────────────────────────────────── */
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  /* ── List helpers ──────────────────────────────────────────────────────── */
  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => [...prev, '']);

  const updateListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number, val: string) =>
    setter((prev) => prev.map((item, i) => (i === idx ? val : item)));

  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    setter((prev) => prev.filter((_, i) => i !== idx));

  /* ── Loading skeleton ──────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-3xl animate-pulse space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neutral-200" />
            <div className="space-y-2">
              <div className="h-5 w-48 bg-neutral-200 rounded" />
              <div className="h-4 w-64 bg-neutral-100 rounded" />
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <div className="h-5 w-36 bg-neutral-200 rounded" />
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100" />
                <div className="h-10 w-32 bg-neutral-100 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-neutral-100 rounded-xl" />
                <div className="h-10 bg-neutral-100 rounded-xl" />
              </div>
              <div className="h-20 bg-neutral-100 rounded-xl" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <AdminLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/providers">
            <button className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Edit Provider</h2>
            <p className="text-sm text-neutral-500">Perbarui informasi provider internet</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ── Basic Info ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display font-bold text-base text-neutral-900">Informasi Dasar</h3>

            {/* Logo upload */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Logo Provider</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50 overflow-hidden">
                  {logoPreview
                    ? <img src={logoPreview} alt="preview" className="w-full h-full object-contain p-2" />
                    : <Upload className="w-6 h-6 text-neutral-400" />
                  }
                </div>
                <div>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                      <Upload className="w-4 h-4" /> Pilih Gambar
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                  <p className="text-xs text-neutral-400 mt-1">PNG, JPG, SVG. Maks 2MB.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Nama Provider" placeholder="XL Home Fiber" error={errors.name?.message} {...register('name')} />
              <Input label="Slug (URL)" placeholder="xlhome-fiber" error={errors.slug?.message} {...register('slug')} />
            </div>

            <Textarea label="Deskripsi" placeholder="Deskripsi lengkap provider..." rows={3} error={errors.description?.message} {...register('description')} />
            <Input label="Tagline" placeholder="Internet Cepat, Hidup Lebih Baik" error={errors.tagline?.message} {...register('tagline')} />

            <div className="grid grid-cols-3 gap-4">
              <Select label="Tipe Koneksi" options={typeOptions} error={errors.type?.message} {...register('type')} />
              <Input label="Harga Mulai (IDR)" type="number" placeholder="199000" error={errors.minPrice?.message} {...register('minPrice')} />
              <Input label="Kecepatan Maks (Mbps)" type="number" placeholder="1000" error={errors.maxSpeed?.message} {...register('maxSpeed')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Website" type="url" placeholder="https://xl.co.id" error={errors.website?.message} {...register('website')} />
              <Input label="Nomor Telepon" placeholder="817" error={errors.phone?.message} {...register('phone')} />
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded accent-brand-blue" />
                <span className="text-sm font-medium text-neutral-700">Aktifkan Provider</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded accent-brand-blue" />
                <span className="text-sm font-medium text-neutral-700">Tampilkan sebagai Unggulan</span>
              </label>
            </div>
          </div>

          {/* ── Features / Pros / Cons ────────────────────────────────────── */}
          {[
            { label: 'Fitur Utama',   list: features, setter: setFeatures },
            { label: 'Kelebihan',     list: pros,     setter: setPros },
            { label: 'Kekurangan',    list: cons,     setter: setCons },
          ].map(({ label, list, setter }) => (
            <div key={label} className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="font-display font-bold text-base text-neutral-900 mb-4">{label}</h3>
              <div className="space-y-2.5">
                {list.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateListItem(setter, idx, e.target.value)}
                      placeholder={`${label} ${idx + 1}...`}
                    />
                    {list.length > 1 && (
                      <button type="button" onClick={() => removeListItem(setter, idx)} className="p-2.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={() => addListItem(setter)}>
                  <Plus className="w-3.5 h-3.5" /> Tambah {label}
                </Button>
              </div>
            </div>
          ))}

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button type="submit" loading={isPending} size="lg">
              <Save className="w-4 h-4" /> Simpan Perubahan
            </Button>
            <Link href="/admin/providers">
              <Button type="button" variant="secondary" size="lg">Batal</Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
