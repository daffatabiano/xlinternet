'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useNavbarScroll as useScroll } from '@/lib/hooks';
import Image from 'next/image';

const navLinks = [
  { href: '/site/provider',        label: 'Provider' },
  { href: '/site/paket-internet',  label: 'Paket Internet' },
  { href: '/site/coverage-check',  label: 'Cek Coverage' },
  { href: '/site/compare',         label: 'Bandingkan' },
  { href: '/site/blog',            label: 'Blog' },
];

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScroll(20);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/logo.svg" alt="XLNet Logo" width={32} height={32} className="w-8 h-8" />
              {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center shadow-brand/30">
                <Wifi className="w-4 h-4 text-white" />
              </div> */}
              <span className="font-display font-black text-xl text-neutral-900 group-hover:text-brand-blue transition-colors">
                XL<span className="text-brand-blue">Net</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-brand-blue bg-blue-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/site/coverage-check">
                <Button variant="secondary" size="sm">Cek Area Saya</Button>
              </Link>
              <Link href="/site/paket-internet">
                <Button variant="primary" size="sm">Lihat Paket XL</Button>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden pt-16"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative bg-white border-b border-neutral-200 shadow-xl px-4 py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      pathname === link.href
                        ? 'text-brand-blue bg-blue-50'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-neutral-100">
                  <Link href="/site/coverage-check" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" fullWidth>Cek Area Saya</Button>
                  </Link>
                  <Link href="/site/paket-internet" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" fullWidth>Lihat Paket XL</Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
