'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm }   from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Wifi, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input }  from '@/components/ui/Input';
import { authService } from '@/lib/api/services';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@xlnet.id', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(values);
      const { data } = res as any;
      localStorage.setItem('xlnet_access_token',  data.accessToken);
      localStorage.setItem('xlnet_refresh_token', data.refreshToken);
      toast.success(`Selamat datang, ${data.user?.name}!`);
      router.push('/admin');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-blue/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-brand-violet/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 dot-grid opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-dark rounded-3xl p-8 border border-white/10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center mb-4 shadow-brand">
              <Wifi className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-black text-2xl text-white">XL Net Admin</h1>
            <p className="text-sm text-white/40 mt-1">Masuk ke panel admin</p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@xlnet.id"
              dark
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              dark
              icon={<Lock className="w-4 h-4" />}
              iconRight={
                <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" fullWidth loading={loading} size="lg" className="mt-6">
              Masuk ke Admin Panel
            </Button>
          </form>

          <p className="text-center text-xs text-white/25 mt-6">
            XL Net Admin Panel · Hanya untuk pengguna yang berwenang
          </p>
        </div>
      </motion.div>
    </div>
  );
}
