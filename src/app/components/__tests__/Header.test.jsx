import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

vi.mock('../Logo', () => ({
  default: () => <div>Logo Component</div>
}));

vi.mock('../LanguageSelector', () => ({
  default: () => <div>Language Selector</div>
}));

describe('Header Component', () => {
  it('renders header element with correct styling', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });

  it('renders Logo component', () => {
    render(<Header />);

    expect(screen.getByText('Logo Component')).toBeInTheDocument();
  });

  it('renders LanguageSelector component', () => {
    render(<Header />);

    expect(screen.getByText('Language Selector')).toBeInTheDocument();
  });

  it('has correct semantic structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header.tagName).toBe('HEADER');
  });

  it('applies responsive styling classes', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('flex', 'w-full', 'items-center', 'justify-between');
  });
}); 