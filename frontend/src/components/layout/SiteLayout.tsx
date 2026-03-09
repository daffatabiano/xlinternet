import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { StickyLeadBar } from '@/components/shared/StickyLeadBar';
import { LeadModal } from '@/components/shared/LeadModal';

interface SiteLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function SiteLayout({ children, fullWidth }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyLeadBar />
      <LeadModal />
    </div>
  );
}
