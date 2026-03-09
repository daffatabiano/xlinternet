'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi } from 'lucide-react';
import { useLeadModal } from '@/context/LeadModalContext';
import { LeadCaptureForm } from './LeadCaptureForm';

export function LeadModal() {
  const [localOpen, setLocalOpen] = useState(false);
  const { isOpen: contextOpen, close: closeContext } = useLeadModal();
  
  // Modal is open if either local OR context triggers it
  const isOpen = localOpen || contextOpen;

  useEffect(() => {
    // Check cookie / localStorage
    const dismissed = localStorage.getItem('xlnet_lead_modal_dismissed');
    if (dismissed) {
      const ts = Number(dismissed);
      if (Date.now() - ts < 24 * 60 * 60 * 1000) return; // 24h cooldown
    }

    // Trigger after 30 seconds OR scroll 60%
    const timer = setTimeout(() => setLocalOpen(true), 30_000);

    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled > 0.6) {
        setLocalOpen(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const dismiss = () => {
    setLocalOpen(false);
    closeContext();
    localStorage.setItem('xlnet_lead_modal_dismissed', String(Date.now()));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header gradient */}
            <div className="bg-gradient-to-br from-brand-blue to-brand-violet px-6 pt-6 pb-8 text-center">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-1">Mau Internet XL?</h3>
              <p className="text-sm text-white/70">Konsultasi Gratis dengan Tim Sales!</p>
            </div>

            {/* Form */}
            <div className="px-6 py-6 -mt-3 bg-white rounded-t-2xl relative">
              <LeadCaptureForm source="POPUP" compact />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
