'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function StickyLeadBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Don't show on admin pages
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAdmin]);

  if (isAdmin || dismissed) return null;

  const salesNumber = process.env.NEXT_PUBLIC_WA_SALES || '6281709998817';
  const waUrl = `https://wa.me/${salesNumber}?text=${encodeURIComponent('Halo, saya tertarik pasang internet XL. Boleh info lebih lanjut?')}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[45] bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 md:hidden"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-neutral-400 hover:text-neutral-600"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="flex-1 text-xs font-semibold text-neutral-800 leading-tight">
              Pasang XL Internet Sekarang — Gratis Konsultasi
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-3.5 py-2 rounded-xl"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a
              href="/site/paket-internet"
              className="shrink-0 inline-flex items-center gap-1 bg-brand-blue text-white text-xs font-bold px-3.5 py-2 rounded-xl"
            >
              Daftar <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
