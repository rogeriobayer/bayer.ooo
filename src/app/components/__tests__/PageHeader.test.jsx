import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageHeader from '../PageHeader';
import { translations } from '../../data/translations';

describe('PageHeader Component', () => {
  it('renders title using translation key', () => {
    render(<PageHeader titleKey="blog.title" />);
    
    expect(screen.getByText(translations.pt['blog.title'])).toBeInTheDocument();
  });

  it('renders title and description when descriptionKey is provided', () => {
    render(<PageHeader titleKey="extensions.title" descriptionKey="extensions.description" />);
    
    expect(screen.getByText(translations.pt['extensions.title'])).toBeInTheDocument();
    expect(screen.getByText(translations.pt['extensions.description'])).toBeInTheDocument();
  });

  it('renders h1 element with correct styling', () => {
    render(<PageHeader titleKey="blog.title" />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveClass('text-4xl', 'md:text-5xl', 'font-heading', 'font-bold');
  });

  it('does not render description paragraph when descriptionKey is not provided', () => {
    render(<PageHeader titleKey="blog.title" />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    const nextSibling = h1.parentElement?.querySelector('p');
    expect(nextSibling).not.toBeInTheDocument();
  });

  it('renders description with correct styling when provided', () => {
    render(<PageHeader titleKey="blog.title" descriptionKey="blog.description" />);
    
    const description = screen.getByText(translations.pt['blog.description']);
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('text-lg', 'text-secondary');
  });
});
