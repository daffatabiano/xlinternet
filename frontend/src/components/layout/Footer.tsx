import Link from 'next/link';
import { Wifi, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';

const footerLinks = {
  'Paket XL': [
    { label: 'XL Home Fiber',    href: '/site/paket-internet?category=standard' },
    { label: 'XL Home Gamer',    href: '/site/paket-internet?category=gaming' },
    { label: 'XL Home Premium',  href: '/site/paket-internet?category=premium' },
    { label: 'XL Business',      href: '/site/paket-internet?category=business' },
    { label: 'Promo Terbaru',    href: '/site/paket-internet?sort=promo' },
  ],
  'Layanan': [
    { label: 'Cek Coverage',       href: '/site/coverage-check' },
    { label: 'Bandingkan Provider', href: '/site/compare' },
    { label: 'Ulasan Pelanggan',   href: '/site/review' },
    { label: 'Cara Daftar',        href: '/site/blog' },
    { label: 'Status Jaringan',    href: '/site/status' },
  ],
  'Edukasi': [
    { label: 'Blog & Artikel',    href: '/site/blog' },
    { label: 'Internet Terbaik',  href: '/site/blog' },
    { label: 'Pilih Paket',       href: '/site/blog' },
    { label: 'Fiber vs Wireless', href: '/site/blog' },
    { label: 'FAQ',               href: '/site/faq' },
  ],
  'Perusahaan': [
    { label: 'Tentang XL Net',  href: '/site/about' },
    { label: 'Kontak Kami',     href: '/site/contact' },
    { label: 'Karir',           href: '/site/careers' },
    { label: 'Status Jaringan', href: '/site/status' },
    { label: 'FAQ',             href: '/site/faq' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-black text-2xl">
                XL<span className="text-brand-cyan">Net</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              Platform resmi informasi dan pendaftaran paket internet XL untuk rumah dan bisnis. Cepat, terjangkau, dan terpercaya.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                { Icon: Twitter,   href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Youtube,   href: '#', label: 'YouTube' },
                { Icon: Facebook,  href: '#', label: 'Facebook' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-150"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-semibold text-sm text-white mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/45 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/5 rounded-2xl px-6 py-4 mb-10 border border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center">
              <span className="text-lg">📞</span>
            </div>
            <div>
              <p className="text-xs text-white/40 font-medium">Hubungi Sales XL</p>
              <p className="font-display font-bold text-white text-lg">817</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-xs text-white/40 font-medium">WhatsApp</p>
              <p className="font-bold text-white text-sm">+62 817 9999 817</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <span className="text-lg">⏰</span>
            </div>
            <div>
              <p className="text-xs text-white/40 font-medium">Jam Operasional</p>
              <p className="font-bold text-white text-sm">08.00 – 22.00 WIB</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} XL Net — Platform Resmi XL Axiata Indonesia. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-5">
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Sitemap'].map((item) => (
              <Link
                key={item}
                href={`/site/${item.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'dan')}`}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
