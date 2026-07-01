import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function SampleComponent() {
  return <div>Hello Test</div>;
}

describe('SampleComponent', () => {
  it('renders hello test', () => {
    render(<SampleComponent />);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });
});
