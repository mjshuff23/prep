import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OperationPanel } from './OperationPanel';
import { OperationSpec } from '../../ds/core/types';

describe('OperationPanel', () => {
  const mockOperations: OperationSpec[] = [
    { operation: 'push', description: 'Push value' },
    { operation: 'pop', description: 'Pop value' },
  ];

  it('renders operation buttons', () => {
    render(<OperationPanel operations={mockOperations} onRunOperation={vi.fn()} />);
    expect(screen.getByText('push')).toBeInTheDocument();
    expect(screen.getByText('pop')).toBeInTheDocument();
  });

  it('shows input for push operation', () => {
    render(<OperationPanel operations={mockOperations} onRunOperation={vi.fn()} />);
    
    // Initially no input
    expect(screen.queryByPlaceholderText('Enter value...')).not.toBeInTheDocument();
    
    // Click push
    fireEvent.click(screen.getByText('push'));
    
    // Input should appear
    expect(screen.getByPlaceholderText('Enter value...')).toBeInTheDocument();
  });

  it('does not show input for pop operation', () => {
    render(<OperationPanel operations={mockOperations} onRunOperation={vi.fn()} />);
    
    fireEvent.click(screen.getByText('pop'));
    expect(screen.queryByPlaceholderText('Enter value...')).not.toBeInTheDocument();
  });

  it('calls onRunOperation with payload for push', () => {
    const handleRun = vi.fn();
    render(<OperationPanel operations={mockOperations} onRunOperation={handleRun} />);
    
    fireEvent.click(screen.getByText('push'));
    fireEvent.change(screen.getByPlaceholderText('Enter value...'), { target: { value: '42' } });
    fireEvent.click(screen.getByText('Run Operation'));
    
    expect(handleRun).toHaveBeenCalledWith('push', 42);
  });

  it('calls onRunOperation without payload for pop', () => {
    const handleRun = vi.fn();
    render(<OperationPanel operations={mockOperations} onRunOperation={handleRun} />);
    
    fireEvent.click(screen.getByText('pop'));
    fireEvent.click(screen.getByText('Run Operation'));
    
    expect(handleRun).toHaveBeenCalledWith('pop', undefined);
  });

  it('disables run button if input is empty for push', () => {
    const handleRun = vi.fn();
    render(<OperationPanel operations={mockOperations} onRunOperation={handleRun} />);
    
    fireEvent.click(screen.getByText('push'));
    const runBtn = screen.getByText('Run Operation');
    
    // Empty input -> disabled
    expect(runBtn).toBeDisabled();
    
    // Add input -> enabled
    fireEvent.change(screen.getByPlaceholderText('Enter value...'), { target: { value: '42' } });
    expect(runBtn).not.toBeDisabled();
  });
});
