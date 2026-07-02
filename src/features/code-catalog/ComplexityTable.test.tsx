import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplexityTable } from './ComplexityTable';

describe('ComplexityTable', () => {
  it('renders nothing when complexity is empty', () => {
    const { container } = render(<ComplexityTable complexity={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders operations correctly', () => {
    const mockComplexity = {
      push: { time: 'O(1)', space: 'O(1)', notes: 'Amortized' },
      pop: { time: 'O(1)', space: 'O(1)' }
    };

    render(<ComplexityTable complexity={mockComplexity} />);
    
    // Check headers
    expect(screen.getByText('Operation')).toBeInTheDocument();
    expect(screen.getByText('Time Complexity')).toBeInTheDocument();
    
    // Check rows
    expect(screen.getByText('push')).toBeInTheDocument();
    expect(screen.getByText('Amortized')).toBeInTheDocument();
    
    expect(screen.getByText('pop')).toBeInTheDocument();
    
    // Check default notes fallback (-)
    const emptyNotes = screen.getAllByText('-');
    expect(emptyNotes.length).toBeGreaterThan(0);
  });
});
