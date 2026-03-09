'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  packageName?: string;
  providerName?: string;
}

export function WhatsAppButton({ packageName, providerName }: WhatsAppButtonProps) {
  const [tooltip, setTooltip] = useState(false);
  const salesNumber = process.env.NEXT_PUBLIC_WA_SALES || '6281709998817';

  const handleClick = () => {
    const parts = ['Halo, saya tertarik dengan layanan internet XL.'];
    if (packageName) parts.push(`Paket yang saya minati: ${packageName}.`);
    if (providerName) parts.push(`Provider: ${providerName}.`);
    parts.push('Boleh saya mendapatkan informasi lebih lanjut?');
    const message = encodeURIComponent(parts.join(' '));
    window.open(`https://wa.me/${salesNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-4 max-w-[240px]"
          >
            <button onClick={() => setTooltip(false)} className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600">
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm font-semibold text-neutral-900 mb-1">Chat dengan Sales XL</p>
            <p className="text-xs text-neutral-500">Konsultasi gratis, respon cepat!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 flex items-center justify-center relative"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </motion.button>
    </div>
  );
}
