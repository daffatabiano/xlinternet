'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateLead } from '@/lib/hooks';

const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, 'Nomor HP tidak valid'),
  city: z.string().min(2, 'Kota minimal 2 karakter'),
  subject: z.string().min(1, 'Pilih topik'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Phone, label: 'Telepon', value: '0800-1-500-838', href: 'tel:08001500838' },
  { icon: MessageCircle, label: 'WhatsApp Sales', value: '0817-0999-8817', href: 'https://wa.me/6281709998817?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk%20XL%20Home' },
  { icon: Mail, label: 'Email', value: 'sales@xlhome.co.id', href: 'mailto:sales@xlhome.co.id' },
  { icon: MapPin, label: 'Kantor', value: 'Grha XL, Jl. DR. Ide Anak Agung Gde Agung, Jakarta', href: '#' },
  { icon: Clock, label: 'Jam Operasional', value: 'Senin - Jumat: 08:00 - 21:00', href: '#' },
];

const subjects = ['Pendaftaran Baru', 'Info Paket', 'Gangguan', 'Upgrade / Downgrade', 'Pembayaran', 'Lainnya'];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const createLead = useCreateLead();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      await createLead.mutateAsync({
        name: data.name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        interest: data.subject,
        message: data.message,
        source: 'CONTACT_FORM',
      });
      setSubmitted(true);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-violet text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Mail className="w-4 h-4" /> Hubungi Kami
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">Ada Pertanyaan?</h1>
            <p className="text-white/60 max-w-xl mx-auto">Tim kami siap membantu Anda 24/7. Kirim pesan atau hubungi langsung via WhatsApp.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-surface-dim">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-display font-bold text-xl text-neutral-900 mb-4">Informasi Kontak</h2>
              {contactInfo.map((c) => (
                <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{c.label}</p>
                    <p className="font-medium text-neutral-900 text-sm">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-brand-green" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">Pesan Terkirim!</h3>
                    <p className="text-neutral-500 mb-6">Tim kami akan menghubungi Anda dalam waktu 1x24 jam.</p>
                    <a href="https://wa.me/6281709998817?text=Halo,%20saya%20baru%20mengirim%20form%20kontak" target="_blank" rel="noopener noreferrer">
                      <Button><MessageCircle className="w-4 h-4 mr-2" /> Chat via WhatsApp</Button>
                    </a>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="font-display font-bold text-xl text-neutral-900 mb-6">Kirim Pesan</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Nama Lengkap</label>
                          <Input placeholder="Nama Anda" {...register('name')} />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                          <Input type="email" placeholder="email@contoh.com" {...register('email')} />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">No. HP / WhatsApp</label>
                          <Input type="tel" placeholder="08xxxxxxxxxx" {...register('phone')} />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Kota</label>
                          <Input placeholder="Kota Anda" {...register('city')} />
                          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Topik</label>
                        <select {...register('subject')} className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none">
                          <option value="">Pilih topik</option>
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Pesan</label>
                        <textarea {...register('message')} rows={4} placeholder="Tulis pesan Anda..." className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none" />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Mengirim...' : <><Send className="w-4 h-4 mr-2" /> Kirim Pesan</>}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
