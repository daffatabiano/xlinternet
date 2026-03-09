'use client';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LeadCaptureForm } from '@/components/shared/LeadCaptureForm';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...p }: any) => <div {...p}>{children}</div>, form: ({ children, ...p }: any) => <form {...p}>{children}</form> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

// Mock leadService
jest.mock('@/lib/api/services', () => ({
  leadService: {
    create: jest.fn().mockResolvedValue({
      data: { lead: { id: '1' }, whatsappUrl: 'https://wa.me/6281709998817' },
      success: true,
    }),
  },
  packageService: { getAll: jest.fn().mockResolvedValue({ data: [] }) },
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('LeadCaptureForm', () => {
  it('renders all required form fields', () => {
    render(<Wrapper><LeadCaptureForm /></Wrapper>);
    expect(screen.getByPlaceholderText(/nama/i) || screen.getByLabelText(/nama/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<Wrapper><LeadCaptureForm /></Wrapper>);

    const submitBtn = screen.getByRole('button', { name: /daftar|kirim|whatsapp/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const errors = document.querySelectorAll('.text-red-500');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('renders with source prop', () => {
    render(<Wrapper><LeadCaptureForm source="POPUP" /></Wrapper>);
    expect(document.querySelector('form')).toBeInTheDocument();
  });
});
