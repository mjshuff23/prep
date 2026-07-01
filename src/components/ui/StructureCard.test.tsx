import { render, screen } from '@testing-library/react';
import { StructureCard } from './StructureCard';
import { describe, it, expect, vi } from 'vitest';
import { StructureContent } from '@/lib/content/registry';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

const mockStructure: StructureContent = {
  slug: 'test-structure',
  title: 'Test Structure',
  category: 'linear',
  summary: 'A simple test data structure.',
  mentalModel: 'Think of a test.',
  invariants: ['Testing is invariant.'],
  operations: [],
  complexity: {
    time: {
      average: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
      worst: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
    },
    space: 'O(n)',
  },
  commonMistakes: [],
  realWorldUses: [],
};

describe('StructureCard Component', () => {
  it('renders the structure title and summary', () => {
    render(<StructureCard structure={mockStructure} />);
    expect(screen.getByText('Test Structure')).toBeInTheDocument();
    expect(screen.getByText('A simple test data structure.')).toBeInTheDocument();
  });

  it('renders complexity badges', () => {
    render(<StructureCard structure={mockStructure} />);
    expect(screen.getByText('Time: O(n)')).toBeInTheDocument();
    expect(screen.getByText('Space: O(n)')).toBeInTheDocument();
  });
});
