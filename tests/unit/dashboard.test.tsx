import { render, screen, } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlaygroundCard } from '@/features/dashboard/PlaygroundCard';
import { DashboardOverviewClient } from '@/features/dashboard/DashboardOverviewClient';

// Mock next/link to render an anchor tag
vi.mock('next/link', () => ({
  default: ({ children, href, className, onClick }: { children: React.ReactNode, href: string, className?: string, onClick?: () => void }) => {
    return <a href={href} className={className} onClick={onClick}>{children}</a>;
  },
}));

// Mock server actions so next-auth / next/server don't break Vitest
vi.mock('@/server/actions', () => ({
  deletePlayground: vi.fn(),
  updatePlayground: vi.fn(),
  deleteDataset: vi.fn(),
}));

const mockPlayground = {
  id: 'pg-1',
  name: 'Test Playground',
  description: 'A test playground',
  structure: 'stack',
  stateJson: {},
  traceJson: [{}],
  isArchived: false,
  createdAt: new Date('2026-07-01T00:00:00Z'),
  updatedAt: new Date('2026-07-02T00:00:00Z')
};

const mockDataset = {
  id: 'ds-1',
  name: 'Test Dataset',
  description: 'A test dataset',
  valuesJson: [1, 2, 3],
  updatedAt: new Date('2026-07-02T00:00:00Z')
};

describe('Dashboard Components', () => {
  it('PlaygroundCard renders details correctly', () => {
    render(<PlaygroundCard playground={mockPlayground} onDelete={() => {}} onEdit={() => {}} />);
    
    expect(screen.getByText('Test Playground')).toBeInTheDocument();
    expect(screen.getByText('stack')).toBeInTheDocument();
    expect(screen.getByText('A test playground')).toBeInTheDocument();
    expect(screen.getByText('1 saved operation')).toBeInTheDocument();
  });

  it('DashboardOverviewClient renders empty states when no data', () => {
    render(<DashboardOverviewClient initialPlaygrounds={[]} initialDatasets={[]} />);
    
    expect(screen.getByText('No recent playgrounds')).toBeInTheDocument();
    expect(screen.getByText('No datasets saved')).toBeInTheDocument();
    // Quick Start links should always be visible
    expect(screen.getByText('New Playground')).toBeInTheDocument();
    expect(screen.getByText('Manage Datasets')).toBeInTheDocument();
  });

  it('DashboardOverviewClient renders items when provided', () => {
    render(<DashboardOverviewClient initialPlaygrounds={[mockPlayground]} initialDatasets={[mockDataset]} />);
    
    // Playgrounds
    expect(screen.getByText('Test Playground')).toBeInTheDocument();
    // Datasets
    expect(screen.getByText('Test Dataset')).toBeInTheDocument();
    // "View All" links should appear because items > 0
    expect(screen.getAllByText('View All')).toHaveLength(2);
  });
});
