'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  User, Lock, Globe, MessageCircle, Search, Bell,
  Save, Eye, EyeOff, Shield, CheckCircle,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// ─── Schemas ──────────────────────────────────────────────────────────────────
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Wajib diisi'),
  newPassword: z.string().min(8, 'Minimal 8 karakter'),
  confirmPassword: z.string().min(1, 'Wajib diisi'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Password baru tidak cocok',
  path: ['confirmPassword'],
});

const generalSchema = z.object({
  siteName: z.string().min(1, 'Wajib diisi'),
  tagline: z.string(),
  contactEmail: z.string().email('Email tidak valid'),
  contactPhone: z.string().min(8, 'Nomor tidak valid'),
});

const seoSchema = z.object({
  metaTitleTemplate: z.string(),
  defaultDescription: z.string().max(160, 'Maks 160 karakter'),
  ogImage: z.string().url('URL tidak valid').or(z.literal('')),
});

const waSchema = z.object({
  salesNumber: z.string().min(8, 'Nomor tidak valid'),
  defaultMessage: z.string(),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type GeneralForm = z.infer<typeof generalSchema>;
type SeoForm = z.infer<typeof seoSchema>;
type WaForm = z.infer<typeof waSchema>;

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general', label: 'Umum', icon: Globe },
  { id: 'profile', label: 'Profil Admin', icon: User },
  { id: 'password', label: 'Keamanan', icon: Lock },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'seo', label: 'SEO', icon: Search },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const fakeSuccess = (section: string) => {
    toast.success(`Pengaturan ${section} disimpan`);
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  // ─── General form ──────────────────────────────────────────────────────────
  const generalForm = useForm<GeneralForm>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      siteName: 'XL Net',
      tagline: 'Temukan Internet Terbaik untuk Rumah & Bisnis Anda',
      contactEmail: 'support@xlnet.id',
      contactPhone: '1500123',
    },
  });

  // ─── SEO form ──────────────────────────────────────────────────────────────
  const seoForm = useForm<SeoForm>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitleTemplate: '%s | XL Net – Bandingkan Paket Internet',
      defaultDescription: 'XL Net membantu Anda menemukan paket internet terbaik dari berbagai provider di Indonesia.',
      ogImage: '',
    },
  });

  // ─── WA form ───────────────────────────────────────────────────────────────
  const waForm = useForm<WaForm>({
    resolver: zodResolver(waSchema),
    defaultValues: {
      salesNumber: '6281209999999',
      defaultMessage: 'Halo, saya ingin tahu lebih lanjut tentang paket internet XL!',
    },
  });

  // ─── Password form ─────────────────────────────────────────────────────────
  const pwForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onPasswordSubmit = (data: PasswordForm) => {
    toast.success('Password berhasil diubah');
    pwForm.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-display font-bold text-xl text-neutral-900">Pengaturan</h2>
          <p className="text-sm text-neutral-500">Kelola konfigurasi platform XL Net</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <aside className="hidden md:flex flex-col gap-1 w-52 flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Mobile tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-1 w-full -mx-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id ? 'bg-brand-blue text-white' : 'bg-white border border-neutral-200 text-neutral-600'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content panels */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 bg-white rounded-2xl border border-neutral-200 p-6 space-y-6"
          >
            {/* ── GENERAL ─────────────────────────────────────────────── */}
            {activeTab === 'general' && (
              <form onSubmit={generalForm.handleSubmit(() => fakeSuccess('umum'))}>
                <SectionTitle icon={Globe} title="Pengaturan Umum" description="Informasi dasar website XL Net" />
                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  <div>
                    <label className="settings-label">Nama Website</label>
                    <Input {...generalForm.register('siteName')} />
                    {generalForm.formState.errors.siteName && <FieldError msg={generalForm.formState.errors.siteName.message!} />}
                  </div>
                  <div>
                    <label className="settings-label">Telepon Kontak</label>
                    <Input {...generalForm.register('contactPhone')} />
                    {generalForm.formState.errors.contactPhone && <FieldError msg={generalForm.formState.errors.contactPhone.message!} />}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="settings-label">Tagline</label>
                    <Input {...generalForm.register('tagline')} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="settings-label">Email Kontak</label>
                    <Input {...generalForm.register('contactEmail')} type="email" />
                    {generalForm.formState.errors.contactEmail && <FieldError msg={generalForm.formState.errors.contactEmail.message!} />}
                  </div>
                </div>
                <SaveButton saved={saved === 'umum'} />
              </form>
            )}

            {/* ── PROFILE ─────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
              <div>
                <SectionTitle icon={User} title="Profil Admin" description="Informasi akun administrator yang sedang aktif" />
                <div className="mt-5 flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center text-white font-display font-black text-2xl flex-shrink-0">
                    A
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-neutral-900">Admin XL Net</p>
                    <p className="text-sm text-neutral-500">admin@xlnet.id</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Shield className="w-3.5 h-3.5 text-brand-blue" />
                      <span className="text-xs font-semibold text-brand-blue">Super Admin</span>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="settings-label">Nama Lengkap</label>
                    <Input defaultValue="Admin XL Net" readOnly className="bg-neutral-50 cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="settings-label">Email</label>
                    <Input defaultValue="admin@xlnet.id" readOnly className="bg-neutral-50 cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="settings-label">Role</label>
                    <Input defaultValue="Super Admin" readOnly className="bg-neutral-50 cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="settings-label">Terakhir Login</label>
                    <Input defaultValue="Hari ini, 09:14 WIB" readOnly className="bg-neutral-50 cursor-not-allowed opacity-70" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-neutral-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Perubahan profil hanya bisa dilakukan oleh Super Admin melalui konsol server.
                </p>
              </div>
            )}

            {/* ── PASSWORD ────────────────────────────────────────────── */}
            {activeTab === 'password' && (
              <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)}>
                <SectionTitle icon={Lock} title="Ubah Password" description="Perbarui password akun admin Anda" />
                <div className="space-y-4 mt-5">
                  <div>
                    <label className="settings-label">Password Saat Ini</label>
                    <div className="relative">
                      <Input {...pwForm.register('currentPassword')} type={showCurrent ? 'text' : 'password'} />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwForm.formState.errors.currentPassword && <FieldError msg={pwForm.formState.errors.currentPassword.message!} />}
                  </div>
                  <div>
                    <label className="settings-label">Password Baru</label>
                    <div className="relative">
                      <Input {...pwForm.register('newPassword')} type={showNew ? 'text' : 'password'} />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwForm.formState.errors.newPassword && <FieldError msg={pwForm.formState.errors.newPassword.message!} />}
                  </div>
                  <div>
                    <label className="settings-label">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <Input {...pwForm.register('confirmPassword')} type={showConfirm ? 'text' : 'password'} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwForm.formState.errors.confirmPassword && <FieldError msg={pwForm.formState.errors.confirmPassword.message!} />}
                  </div>
                </div>
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-700">Tips Keamanan</p>
                    <p className="text-xs text-amber-600 mt-0.5">Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol. Minimal 8 karakter.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button type="submit" loading={pwForm.formState.isSubmitting}>
                    <Lock className="w-4 h-4" /> Ubah Password
                  </Button>
                </div>
              </form>
            )}

            {/* ── WHATSAPP ─────────────────────────────────────────────── */}
            {activeTab === 'whatsapp' && (
              <form onSubmit={waForm.handleSubmit(() => fakeSuccess('WhatsApp'))}>
                <SectionTitle icon={MessageCircle} title="Konfigurasi WhatsApp" description="Atur nomor dan pesan default untuk lead WhatsApp" />
                <div className="space-y-4 mt-5">
                  <div>
                    <label className="settings-label">Nomor WhatsApp Sales</label>
                    <Input {...waForm.register('salesNumber')} placeholder="628xxxxxxxxx" />
                    <p className="text-xs text-neutral-400 mt-1">Format internasional tanpa tanda +. Contoh: 6281200000000</p>
                    {waForm.formState.errors.salesNumber && <FieldError msg={waForm.formState.errors.salesNumber.message!} />}
                  </div>
                  <div>
                    <label className="settings-label">Pesan Default</label>
                    <textarea
                      {...waForm.register('defaultMessage')}
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors resize-none bg-white"
                      placeholder="Pesan yang akan dikirim ke WhatsApp sales..."
                    />
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Preview Link
                    </p>
                    <p className="text-xs text-green-600 mt-1 break-all">
                      https://wa.me/{waForm.watch('salesNumber')}?text={encodeURIComponent(waForm.watch('defaultMessage'))}
                    </p>
                  </div>
                </div>
                <SaveButton saved={saved === 'WhatsApp'} />
              </form>
            )}

            {/* ── SEO ────────────────────────────────────────────────────── */}
            {activeTab === 'seo' && (
              <form onSubmit={seoForm.handleSubmit(() => fakeSuccess('SEO'))}>
                <SectionTitle icon={Search} title="Pengaturan SEO" description="Konfigurasi default SEO untuk semua halaman" />
                <div className="space-y-4 mt-5">
                  <div>
                    <label className="settings-label">Template Judul (Meta Title)</label>
                    <Input {...seoForm.register('metaTitleTemplate')} />
                    <p className="text-xs text-neutral-400 mt-1">Gunakan %s sebagai placeholder untuk judul halaman. Contoh: %s | XL Net</p>
                  </div>
                  <div>
                    <label className="settings-label">Deskripsi Default</label>
                    <textarea
                      {...seoForm.register('defaultDescription')}
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors resize-none bg-white"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-neutral-400">Digunakan saat halaman tidak memiliki meta description</p>
                      <span className={`text-xs font-semibold ${(seoForm.watch('defaultDescription')?.length ?? 0) > 160 ? 'text-red-500' : 'text-neutral-400'}`}>
                        {seoForm.watch('defaultDescription')?.length ?? 0}/160
                      </span>
                    </div>
                    {seoForm.formState.errors.defaultDescription && <FieldError msg={seoForm.formState.errors.defaultDescription.message!} />}
                  </div>
                  <div>
                    <label className="settings-label">URL Gambar OG Default (Open Graph)</label>
                    <Input {...seoForm.register('ogImage')} placeholder="https://xlnet.id/images/og-default.jpg" />
                    {seoForm.formState.errors.ogImage && <FieldError msg={seoForm.formState.errors.ogImage.message!} />}
                  </div>
                </div>
                <SaveButton saved={saved === 'SEO'} />
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 pb-5 border-b border-neutral-100">
      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-brand-blue" />
      </div>
      <div>
        <h3 className="font-display font-bold text-base text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

function SaveButton({ saved }: { saved: boolean }) {
  return (
    <div className="mt-6">
      <Button type="submit">
        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
      </Button>
    </div>
  );
}
