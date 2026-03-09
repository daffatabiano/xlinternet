'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wifi, Package, FileText, Star,
  Settings, LogOut, Menu, X, ChevronRight, Bell,
  BarChart3, Shield, UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authService } from '@/lib/api/services';
import toast from 'react-hot-toast';
import Image from 'next/image';

const navItems = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/admin/providers', label: 'Provider',   icon: Wifi },
  { href: '/admin/packages',  label: 'Paket',      icon: Package },
  { href: '/admin/blog',      label: 'Blog',       icon: FileText },
  { href: '/admin/reviews',   label: 'Ulasan',     icon: Star },
  { href: '/admin/leads',     label: 'Leads',      icon: UserPlus },
  { href: '/admin/analytics', label: 'Analitik',   icon: BarChart3 },
  { href: '/admin/settings',  label: 'Pengaturan', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}
    localStorage.removeItem('xlnet_access_token');
    localStorage.removeItem('xlnet_refresh_token');
    toast.success('Berhasil logout');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/8">
          <Image src='/logo.svg' alt="XLNet Logo" width={32} height={32} className="w-8 h-8" />
          {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center">
            <Wifi className="w-4 h-4 text-white" />
          </div> */}
          <div>
            <span className="font-display font-black text-white text-base">XLNet</span>
            <span className="block text-[10px] text-white/30 font-medium -mt-0.5">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-link',
                isActive(item) && 'active'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {isActive(item) && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/8">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand-blue/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-brand-blue-light" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin XL Net</p>
              <p className="text-[10px] text-white/30">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 flex flex-col"
          >
            {/* Logo + close */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <Image src='/logo.svg' alt="XLNet Logo" width={32} height={32} className="w-8 h-8" />
                <div>
                  <span className="font-display font-black text-white text-base">XLNet</span>
                  <span className="block text-[10px] text-white/30 font-medium -mt-0.5">Admin Panel</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn('sidebar-link', isActive(item) && 'active')}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {isActive(item) && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-white/8">
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                <div className="w-8 h-8 rounded-full bg-brand-blue/30 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-brand-blue-light" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Admin XL Net</p>
                  <p className="text-[10px] text-white/30">Super Admin</p>
                </div>
              </div>
              <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-neutral-900 text-base">
              {navItems.find((n) => isActive(n))?.label ?? 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link href="/" target="_blank" className="text-xs font-medium text-brand-blue hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              Lihat Website →
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
