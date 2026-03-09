import type { Metadata } from 'next';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HeroSection }     from '@/components/sections/HeroSection';
import { CoverageSection } from '@/components/sections/CoverageSection';
import { ProvidersSection }  from '@/components/sections/ProvidersSection';
import { PackagesSection }   from '@/components/sections/PackagesSection';
import { CompareSection }    from '@/components/sections/CompareSection';
import { ReviewsSection }    from '@/components/sections/ReviewsSection';
import { BlogSection }       from '@/components/sections/BlogSection';
import { CTASection }        from '@/components/sections/CTASection';
import { LeadSection }       from '@/components/sections/LeadSection';

export const metadata: Metadata = {
  title: 'XL Net — Internet XL Fiber Terbaik untuk Rumah & Bisnis',
  description:
    'Temukan paket internet XL terbaik. Fiber optik cepat hingga 1 Gbps, harga mulai Rp199.000/bulan. Coverage 300+ kota seluruh Indonesia. Daftar sekarang!',
  alternates: { canonical: 'https://xlnet.id' },
  keywords: ['XL Net', 'Internet XL Fiber', 'Paket Internet XL', 'XL Fiber', 'Internet Cepat', 'Coverage Luas', 'Pelanggan Aktif', 'Uptime SLA', 'Latency Rendah', 'Paket Internet Rumah', 'Paket Internet Bisnis', 'Wifi Murah', 'Internet Stabil', 'XL Net Review', 'Blog Internet', 'Promo Internet', 'Provider Internet Indonesia', 'Paket Internet Terbaik', 'Internet untuk Gaming', 'Internet untuk Streaming', 'Provider Internet Terpercaya', 'Internet Unlimited', 'Paket Internet Murah', 'Internet Fiber Optik', 'XL Net Coverage', 'XL Net Uptime', 'XL Net Pelanggan', 'XL Net Latency', 'XL Net Harga', 'XL Net Paket', 'XL Net Review', 'XL Net Blog', 'XL Net Promo'],
};

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <ProvidersSection />
      <PackagesSection />
      <CoverageSection />
      <CompareSection />
      <ReviewsSection />
      <BlogSection />
      <LeadSection />
      <CTASection />
    </SiteLayout>
  );
}
