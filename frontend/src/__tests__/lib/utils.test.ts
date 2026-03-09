import { cn, formatIDR, formatDate, slugify, truncate } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles conditional classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('merges tailwind classes correctly', () => {
    const result = cn('px-4', 'px-6');
    expect(result).toContain('px-6');
    expect(result).not.toContain('px-4');
  });
});

describe('formatIDR', () => {
  it('formats number to IDR currency', () => {
    const result = formatIDR(299000);
    expect(result).toContain('299');
  });

  it('handles zero', () => {
    expect(formatIDR(0)).toBeTruthy();
  });
});

describe('formatDate', () => {
  it('formats date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('slugify', () => {
  it('converts string to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    const result = slugify('Hello! World?');
    expect(result).not.toContain('!');
    expect(result).not.toContain('?');
  });
});

describe('truncate', () => {
  it('truncates long text', () => {
    const result = truncate('This is a very long text that should be truncated', 20);
    expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
  });

  it('does not truncate short text', () => {
    expect(truncate('Short', 20)).toBe('Short');
  });
});
