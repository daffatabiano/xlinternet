import type { Metadata } from 'next';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import { QueryProvider } from '@/context/QueryProvider';
import { LeadModalProvider } from '@/context/LeadModalContext';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://xlnet.id'),
  title: {
    default: 'XL Net — Provider Internet XL Terbaik untuk Rumah & Bisnis',
    template: '%s | XL Net',
  },
  description:
    'Temukan paket internet XL terbaik untuk rumah dan bisnis Anda. Cek coverage, bandingkan paket, dan pasang internet cepat XL Fiber di area Anda.',
  keywords: [
    'XL internet', 'XL fiber', 'paket internet XL', 'internet rumah XL',
    'XL Home', 'wifi XL', 'internet cepat XL', 'pasang internet XL',
  ],
  authors: [{ name: 'XL Net Team' }],
  openGraph: {
    type:        'website',
    locale:      'id_ID',
    url:         'https://xlnet.id',
    siteName:    'XL Net',
    title:       'XL Net — Provider Internet XL Terbaik',
    description: 'Paket internet XL terlengkap. Fiber cepat, harga terjangkau, coverage luas.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'XL Net' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'XL Net — Provider Internet XL Terbaik',
    description: 'Paket internet XL terlengkap untuk rumah dan bisnis.',
    images:      ['/og-image.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sora.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0057B8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'XL Net',
              url: 'https://xlnet.id',
              logo: 'https://xlnet.id/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '817',
                contactType: 'customer service',
                areaServed: 'ID',
                availableLanguage: 'Indonesian',
              },
              sameAs: [
                'https://twitter.com/xlnetid',
                'https://instagram.com/xlnetid',
              ],
            }),
          }}
        />
      </head>
      <body className="font-body antialiased">
        <QueryProvider>
          <LeadModalProvider>
            {children}
          </LeadModalProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'var(--font-body)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
