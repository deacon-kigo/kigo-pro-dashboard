import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button', { name: /primary button/i });
    // Should have the bg-primary class which maps to the CSS variable
    expect(button).toHaveClass('bg-primary');
  });

  it('renders with CVS theme when specified', () => {
    render(<Button theme="cvs" variant="primary">CVS Theme Button</Button>);
    const button = screen.getByRole('button', { name: /cvs theme button/i });
    // Should have the gradient classes for CVS theme
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('renders with an icon when provided', () => {
    render(
      <Button icon={<span data-testid="test-icon">Icon</span>}>
        Button with Icon
      </Button>
    );
    const button = screen.getByRole('button', { name: /button with icon/i });
    const icon = screen.getByTestId('test-icon');
    expect(button).toContainElement(icon);
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/test">Link Button</Button>);
    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toHaveAttribute('href', '/test');
  });
}); 