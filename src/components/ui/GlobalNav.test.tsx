import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalNav } from './GlobalNav';
import { describe, it, expect, vi } from 'vitest';

// Mock next/link to render an anchor tag
vi.mock('next/link', () => ({
  default: ({ children, href, className, onClick }: { children: React.ReactNode, href: string, className?: string, onClick?: () => void }) => {
    return <a href={href} className={className} onClick={onClick}>{children}</a>;
  },
}));

describe('GlobalNav Component', () => {
  it('renders the brand logo/name', () => {
    render(<GlobalNav />);
    expect(screen.getByText('DataStructs')).toBeInTheDocument();
  });

  it('renders the main navigation links', () => {
    render(<GlobalNav />);
    // We expect 2 "Structures" and "Playground" links because of desktop and mobile navs
    expect(screen.getAllByRole('link', { name: /Structures/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Playground/i }).length).toBeGreaterThan(0);
  });

  it('renders auth links when not authenticated', () => {
    render(<GlobalNav />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThan(0);
  });

  it('renders dashboard and sign out when authenticated', () => {
    render(<GlobalNav user={{ name: 'Test User' }} />);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.getAllByText('Sign Out').length).toBeGreaterThan(0);
  });

  describe('Mobile Menu', () => {
    it('toggles mobile menu on button click and verifies accessibility attributes', () => {
      render(<GlobalNav />);
      const toggleButton = screen.getByRole('button', { name: /Toggle Menu/i });
      
      // Initial state: closed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Open menu
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-nav-menu');
      
      // The mobile nav menu container should be visible
      const mobileNav = document.getElementById('mobile-nav-menu');
      expect(mobileNav).toBeInTheDocument();
      
      // Close menu
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(document.getElementById('mobile-nav-menu')).not.toBeInTheDocument();
    });

    it('closes mobile menu when a link is clicked', () => {
      render(<GlobalNav />);
      const toggleButton = screen.getByRole('button', { name: /Toggle Menu/i });
      
      // Open menu
      fireEvent.click(toggleButton);
      expect(document.getElementById('mobile-nav-menu')).toBeInTheDocument();
      
      // Click a link inside the mobile menu
      const mobileNav = document.getElementById('mobile-nav-menu');
      // Find the "Structures" link inside the mobile nav
      const structuresLink = mobileNav?.querySelector('a[href="/structures"]');
      if (structuresLink) {
        fireEvent.click(structuresLink);
      }
      
      // The menu should be closed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(document.getElementById('mobile-nav-menu')).not.toBeInTheDocument();
    });
  });
});
