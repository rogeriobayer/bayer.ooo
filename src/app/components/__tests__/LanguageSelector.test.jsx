import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LanguageSelector from '../LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

describe('LanguageSelector Component', () => {
  it('renders language selector buttons', () => {
    render(<LanguageSelector />);

    expect(screen.getByRole('button', { name: /change language to pt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change language to en/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change language to fr/i })).toBeInTheDocument();
  });

  it('highlights current language', () => {
    // PT is default in our mock
    render(<LanguageSelector />);

    const ptButton = screen.getByRole('button', { name: /change language to pt/i });
    expect(ptButton).toHaveClass('bg-blue-100');
  });

  it('calls changeLanguage when language button is clicked', () => {
    const { changeLanguage } = useLanguage();
    render(<LanguageSelector />);

    const enButton = screen.getByRole('button', { name: /change language to en/i });
    fireEvent.click(enButton);

    expect(changeLanguage).toHaveBeenCalledWith('en');
  });

  it('calls changeLanguage for French when fr button is clicked', () => {
    const { changeLanguage } = useLanguage();
    render(<LanguageSelector />);

    const frButton = screen.getByRole('button', { name: /change language to fr/i });
    fireEvent.click(frButton);

    expect(changeLanguage).toHaveBeenCalledWith('fr');
  });

  it('has correct container styling', () => {
    render(<LanguageSelector />);

    const container = screen.getByRole('button', { name: /change language to pt/i }).parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'gap-1');
  });

  it('displays flags only', () => {
    render(<LanguageSelector />);

    expect(screen.getByText('🇧🇷')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('🇫🇷')).toBeInTheDocument();
    expect(screen.queryByText('PT')).not.toBeInTheDocument();
    expect(screen.queryByText('EN')).not.toBeInTheDocument();
    expect(screen.queryByText('FR')).not.toBeInTheDocument();
  });
}); 