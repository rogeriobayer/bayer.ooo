import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LanguageSelector from '../LanguageSelector';

// Mock useLanguage hook and context
const mockChangeLanguage = vi.fn();
const mockCurrentLanguage = 'pt';

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({ 
    currentLanguage: mockCurrentLanguage,
    changeLanguage: mockChangeLanguage
  })
}));

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders language selector buttons', () => {
    render(<LanguageSelector />);
    
    expect(screen.getByRole('button', { name: /🇧🇷 PT/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /🇺🇸 EN/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /🇫🇷 FR/i })).toBeInTheDocument();
  });

  it('highlights current language', () => {
    render(<LanguageSelector />);
    
    const ptButton = screen.getByRole('button', { name: /🇧🇷 PT/i });
    // The active language should have different styling
    expect(ptButton).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('calls changeLanguage when language button is clicked', () => {
    render(<LanguageSelector />);
    
    const enButton = screen.getByRole('button', { name: /🇺🇸 EN/i });
    fireEvent.click(enButton);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('calls changeLanguage for French when fr button is clicked', () => {
    render(<LanguageSelector />);
    
    const frButton = screen.getByRole('button', { name: /🇫🇷 FR/i });
    fireEvent.click(frButton);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });

  it('has correct container styling', () => {
    render(<LanguageSelector />);
    
    const container = screen.getByRole('button', { name: /🇧🇷 PT/i }).parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('displays flags and language codes', () => {
    render(<LanguageSelector />);
    
    expect(screen.getByText('🇧🇷')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('🇫🇷')).toBeInTheDocument();
    expect(screen.getByText('PT')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('FR')).toBeInTheDocument();
  });
}); 