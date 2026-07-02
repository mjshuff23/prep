import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeTabs } from './CodeTabs';

// Mock Monaco Editor since it doesn't run well in JSDOM
vi.mock('@monaco-editor/react', () => ({
  Editor: ({ value }: { value: string }) => <div data-testid="monaco-editor">{value}</div>
}));

describe('CodeTabs', () => {
  it('renders fallback for unknown structure', () => {
    // @ts-expect-error - intentionally testing invalid structure
    render(<CodeTabs structure="unknown_struct" />);
    expect(screen.getByText(/No code examples available/i)).toBeInTheDocument();
  });

  it('renders stack examples and defaults to javascript', () => {
    render(<CodeTabs structure="stack" />);
    
    // Tabs should be present
    expect(screen.getByRole('tab', { name: /JavaScript/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /TypeScript/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Python/i })).toBeInTheDocument();

    // Default JS content should be visible (e.g. check for JS specific comment)
    expect(screen.getAllByTestId('monaco-editor')[0]).toHaveTextContent('class Stack');
    expect(screen.getByText('stack.js')).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    render(<CodeTabs structure="stack" />);
    
    // Click python tab
    const pyTab = screen.getByRole('tab', { name: /Python/i });
    fireEvent.click(pyTab);

    // Python specific content should now be visible
    expect(screen.getByText('stack.py')).toBeInTheDocument();
    // Python code should be in the editor
    expect(screen.getAllByTestId('monaco-editor')[0]).toHaveTextContent('def __init__');
  });

  it('renders caveats and complexity table', () => {
    render(<CodeTabs structure="queue" />);
    
    // Queue should have complexity table
    expect(screen.getByText('Complexity')).toBeInTheDocument();
    expect(screen.getByText('enqueue')).toBeInTheDocument();
    
    // Queue should have caveats
    expect(screen.getByText('Caveats & Edge Cases')).toBeInTheDocument();
  });
});
