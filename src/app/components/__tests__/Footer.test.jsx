import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer';
import { socialLinks } from '../../data/footer.server';
import { translations } from '../../data/translations';

describe('Footer Component', () => {
    it('renders footer with copyright and quote', () => {
        render(<Footer />);

        expect(screen.getByText(translations.pt['footer.quote'])).toBeInTheDocument();

        const currentYear = new Date().getFullYear();
        const copyrightText = translations.pt['footer.copyright'].replace('{year}', currentYear);
        expect(screen.getByText(copyrightText)).toBeInTheDocument();

        expect(screen.getByText(translations.pt['footer.madeWith'])).toBeInTheDocument();
    });

    it('renders all social links from real data', () => {
        render(<Footer />);

        socialLinks.forEach(link => {
            const socialLink = screen.getByLabelText(link.label);
            expect(socialLink).toHaveAttribute('href', link.href);

            if (link.href.startsWith('mailto:')) {
                expect(socialLink).not.toHaveAttribute('target', '_blank');
            } else {
                expect(socialLink).toHaveAttribute('target', '_blank');
            }
        });
    });

    it('renders social icons as img tags with correct src', () => {
        render(<Footer />);

        socialLinks.forEach(link => {
            const icon = screen.getByAltText(link.label);
            expect(icon).toHaveAttribute('src', `/${link.icon}.svg`);
        });
    });

    it('contains decorative circles', () => {
        render(<Footer />);

        const allImages = document.querySelectorAll('img');
        const circles = Array.from(allImages).filter(img =>
            img.getAttribute('src').includes('circle')
        );
        expect(circles.length).toBeGreaterThan(0);
    });
});
