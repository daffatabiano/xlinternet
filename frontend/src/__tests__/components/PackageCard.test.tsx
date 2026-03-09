import { render, screen } from '@testing-library/react';
import { PackageCard } from '@/components/shared/PackageCard';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockPackage = {
  id: '1',
  name: 'XL Home 100Mbps',
  slug: 'xl-home-100',
  providerId: '1',
  provider: {
    id: '1',
    name: 'XL Home Fiber',
    slug: 'xlhome',
    logo: '',
    description: '',
    tagline: '',
    type: 'fiber' as const,
    rating: 4.5,
    reviewCount: 100,
    minPrice: 199000,
    maxSpeed: 1000,
    features: [],
    pros: [],
    cons: [],
    website: '',
    phone: '',
    isActive: true,
    isFeatured: true,
    coverageAreas: [],
    createdAt: '',
    updatedAt: '',
  },
  speed: 100,
  price: 299000,
  installationFee: 0,
  contractMonths: 12,
  quota: 'unlimited' as const,
  latency: 5,
  features: ['WiFi Router Gratis', 'IP Public'],
  isPopular: true,
  isFeatured: true,
  category: 'standard' as const,
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('PackageCard', () => {
  it('renders package name', () => {
    render(<PackageCard pkg={mockPackage} />);
    expect(screen.getByText('XL Home 100Mbps')).toBeInTheDocument();
  });

  it('renders speed info', () => {
    render(<PackageCard pkg={mockPackage} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('renders provider name', () => {
    render(<PackageCard pkg={mockPackage} />);
    expect(screen.getByText('XL Home Fiber')).toBeInTheDocument();
  });

  it('renders features', () => {
    render(<PackageCard pkg={mockPackage} />);
    expect(screen.getByText('WiFi Router Gratis')).toBeInTheDocument();
  });
});
