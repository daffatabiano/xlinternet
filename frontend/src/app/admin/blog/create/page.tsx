'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload, Plus, X, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { blogService } from '@/lib/api/services';

/* ── Zod schema ──────────────────────────────────────────────────────────── */
const schema = z.object({
  title:          z.string().min(5, 'Judul minimal 5 karakter'),
  slug:           z.string().min(5, 'Slug minimal 5 karakter').regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung'),
  excerpt:        z.string().min(20, 'Ringkasan minimal 20 karakter'),
  content:        z.string().min(50, 'Konten minimal 50 karakter'),
  category:       z.string().min(1, 'Kategori wajib dipilih'),
  seoTitle:       z.string().optional().or(z.literal('')),
  seoDescription: z.string().optional().or(z.literal('')),
  seoKeywords:    z.string().optional().or(z.literal('')),
  isPublished:    z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ── Select options ──────────────────────────────────────────────────────── */
const categoryOptions = [
  { value: 'tutorial',     label: 'Tutorial' },
  { value: 'review',       label: 'Review' },
  { value: 'tips-trik',    label: 'Tips & Trik' },
  { value: 'berita',       label: 'Berita' },
  { value: 'perbandingan', label: 'Perbandingan' },
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
export default function CreateBlogPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [tags, setTags]                       = useState<string[]>(['']);
  const [featuredImage, setFeaturedImage]      = useState<File | null>(null);
  const [imagePreview, setImagePreview]        = useState('');

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
      category:    'tutorial',
      isPublished: false,
    },
  });

  /* Auto-generate slug from title */
  const titleValue = watch('title');
  useEffect(() => {
    if (titleValue) setValue('slug', toSlug(titleValue), { shouldValidate: true });
  }, [titleValue, setValue]);

  /* ── Mutation ──────────────────────────────────────────────────────────── */
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => blogService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      qc.invalidateQueries({ queryKey: ['blog'] });
      toast.success('Artikel berhasil dibuat!');
      router.push('/admin/blog');
    },
    onError: () => toast.error('Gagal membuat artikel'),
  });

  const onSubmit = (values: FormValues) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    fd.append('tags', JSON.stringify(tags.filter(Boolean)));

    // Parse seoKeywords from comma-separated to JSON array
    if (values.seoKeywords) {
      const kw = values.seoKeywords.split(',').map((s) => s.trim()).filter(Boolean);
      fd.append('seoKeywordsArray', JSON.stringify(kw));
    }

    if (featuredImage) fd.append('featuredImage', featuredImage);
    mutate(fd);
  };

  /* ── File handler ──────────────────────────────────────────────────────── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /* ── List helpers ──────────────────────────────────────────────────────── */
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
          <Link href="/admin/blog">
            <button className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">Buat Artikel Baru</h2>
            <p className="text-sm text-neutral-500">Tulis dan publikasikan konten blog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ── Basic Info ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display font-bold text-base text-neutral-900">Informasi Dasar</h3>

            <Input label="Judul Artikel" placeholder="Panduan Memilih Paket Internet Terbaik" error={errors.title?.message} {...register('title')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Slug (URL)" placeholder="panduan-memilih-paket-internet" error={errors.slug?.message} {...register('slug')} />
              <Select label="Kategori" options={categoryOptions} error={errors.category?.message} {...register('category')} />
            </div>
          </div>

          {/* ── Content ───────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display font-bold text-base text-neutral-900">Konten</h3>

            <Textarea label="Ringkasan (Excerpt)" placeholder="Ringkasan singkat artikel yang akan ditampilkan di halaman blog..." rows={3} error={errors.excerpt?.message} {...register('excerpt')} />
            <Textarea label="Konten Artikel" placeholder="Tulis konten artikel secara lengkap di sini..." rows={12} error={errors.content?.message} {...register('content')} />
          </div>

          {/* ── SEO ───────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display font-bold text-base text-neutral-900">SEO</h3>

            <Input label="SEO Title" placeholder="Judul untuk mesin pencari (opsional)" error={errors.seoTitle?.message} {...register('seoTitle')} />
            <Textarea label="SEO Description" placeholder="Deskripsi meta untuk mesin pencari (opsional)..." rows={2} error={errors.seoDescription?.message} {...register('seoDescription')} />
            <Input label="SEO Keywords" placeholder="internet, paket internet, fiber optik (pisahkan dengan koma)" error={errors.seoKeywords?.message} {...register('seoKeywords')} />
          </div>

          {/* ── Featured Image ────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display font-bold text-base text-neutral-900">Gambar Utama</h3>

            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-2xl border-2 border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50 overflow-hidden">
                {imagePreview
                  ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  : <Upload className="w-6 h-6 text-neutral-400" />
                }
              </div>
              <div>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <Upload className="w-4 h-4" /> Pilih Gambar
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WebP. Rekomendasi 1200×630px.</p>
              </div>
            </div>
          </div>

          {/* ── Tags ──────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-4">Tags</h3>
            <div className="space-y-2.5">
              {tags.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListItem(setTags, idx, e.target.value)}
                    placeholder={`Tag ${idx + 1}...`}
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(setTags, idx)}
                      className="p-2.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={() => addListItem(setTags)}>
                <Plus className="w-3.5 h-3.5" /> Tambah Tag
              </Button>
            </div>
          </div>

          {/* ── Publish toggle ────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" {...register('isPublished')} className="w-4 h-4 rounded accent-brand-blue" />
              <span className="text-sm font-medium text-neutral-700">Langsung Publikasikan</span>
            </label>
            <p className="text-xs text-neutral-400 mt-1">Jika tidak dicentang, artikel akan disimpan sebagai draft.</p>
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button type="submit" loading={isPending} size="lg">
              <Save className="w-4 h-4" /> Simpan Artikel
            </Button>
            <Link href="/admin/blog">
              <Button type="button" variant="secondary" size="lg">Batal</Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
