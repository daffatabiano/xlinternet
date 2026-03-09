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
