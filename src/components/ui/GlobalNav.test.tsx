import { render, screen } from '@testing-library/react';
import { GlobalNav } from './GlobalNav';
import { describe, it, expect, vi } from 'vitest';

// Mock next/link to render an anchor tag
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => {
    return <a href={href} className={className}>{children}</a>;
  },
}));

describe('GlobalNav Component', () => {
  it('renders the brand logo/name', () => {
    render(<GlobalNav />);
    expect(screen.getByText('DataStructs')).toBeInTheDocument();
  });

  it('renders the main navigation links', () => {
    render(<GlobalNav />);
    expect(screen.getByText('Structures')).toBeInTheDocument();
    expect(screen.getByText('Playground')).toBeInTheDocument();
  });

  it('renders auth and dashboard links', () => {
    render(<GlobalNav />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
