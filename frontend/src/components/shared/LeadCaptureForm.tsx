'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateLead } from '@/lib/hooks';
import toast from 'react-hot-toast';
import type { LeadSource } from '@/lib/types';

const schema = z.object({
  name:     z.string().min(2, 'Nama minimal 2 karakter'),
  phone:    z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Format nomor HP tidak valid'),
  city:     z.string().min(2, 'Kota minimal 2 karakter'),
  email:    z.string().email('Email tidak valid').optional().or(z.literal('')),
  interest: z.string().min(1, 'Pilih paket yang diminati'),
  message:  z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface LeadCaptureFormProps {
  source?: LeadSource;
  packageId?: string;
  providerId?: string;
  defaultInterest?: string;
  compact?: boolean;
  className?: string;
}

export function LeadCaptureForm({ source = 'WEBSITE', packageId, providerId, defaultInterest = '', compact, className }: LeadCaptureFormProps) {
  const { mutate: createLead, isPending } = useCreateLead();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { interest: defaultInterest },
  });

  const onSubmit = (data: FormData) => {
    createLead(
      {
        ...data,
        email: data.email || undefined,
        packageId,
        providerId,
        source,
      },
      {
        onSuccess: (res) => {
          toast.success('Anda akan diarahkan ke WhatsApp...');
          reset();
          const url = res?.data?.whatsappUrl;
          if (url) {
            setTimeout(() => window.open(url, '_blank'), 800);
          }
        },
        onError: () => toast.error('Gagal mengirim data. Silakan coba lagi.'),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className={compact ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        <div>
          <Input placeholder="Nama Lengkap *" {...register('name')} error={errors.name?.message} />
        </div>
        <div>
          <Input placeholder="Nomor HP (08xxx) *" {...register('phone')} error={errors.phone?.message} />
        </div>
        <div>
          <Input placeholder="Kota *" {...register('city')} error={errors.city?.message} />
        </div>
        <div>
          <Input placeholder="Email (opsional)" type="email" {...register('email')} error={errors.email?.message} />
        </div>
        <div className={compact ? '' : 'sm:col-span-2'}>
          <select
            {...register('interest')}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
          >
            <option value="">Pilih Paket yang Diminati *</option>
            <option value="xl-home-50">XL Home 50 Mbps</option>
            <option value="xl-home-100">XL Home 100 Mbps</option>
            <option value="xl-home-150">XL Home 150 Mbps</option>
            <option value="xl-gamer-150">XL Gamer 150 Mbps</option>
            <option value="xl-gamer-300">XL Gamer 300 Mbps</option>
            <option value="xl-premium-500">XL Premium 500 Mbps</option>
            <option value="xl-premium-1g">XL Premium 1 Gbps</option>
            <option value="xl-business">XL Business</option>
            <option value="lainnya">Lainnya / Belum Tahu</option>
          </select>
          {errors.interest && <p className="text-xs text-red-500 mt-1">{errors.interest.message}</p>}
        </div>
        {!compact && (
          <div className="sm:col-span-2">
            <textarea
              {...register('message')}
              placeholder="Pesan tambahan (opsional)"
              rows={3}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all resize-none"
            />
          </div>
        )}
      </div>

      <div className={compact ? 'mt-3' : 'mt-5'}>
        <Button type="submit" fullWidth loading={isPending} className="gap-2">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
          Hubungi Sales via WhatsApp
        </Button>
        <p className="text-[11px] text-neutral-400 text-center mt-2">
          Data Anda aman. Kami hanya akan menghubungi via WhatsApp.
        </p>
      </div>
    </form>
  );
}
