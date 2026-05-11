import { describe, it, expect } from 'vitest';
import { extensionsData } from './extensions-data';

describe('Extensions Data', () => {
  it('should have data for all supported locales', () => {
    expect(extensionsData.pt).toBeDefined();
    expect(extensionsData.en).toBeDefined();
    expect(extensionsData.fr).toBeDefined();
  });

  it('should have extensions array for each locale', () => {
    expect(Array.isArray(extensionsData.pt.extensions)).toBe(true);
    expect(Array.isArray(extensionsData.en.extensions)).toBe(true);
    expect(Array.isArray(extensionsData.fr.extensions)).toBe(true);
  });

  it('should have consistent extension count across locales', () => {
    expect(extensionsData.pt.extensions.length).toBe(extensionsData.en.extensions.length);
    expect(extensionsData.pt.extensions.length).toBe(extensionsData.fr.extensions.length);
  });

  it('should have required fields for each extension', () => {
    const extensions = extensionsData.pt.extensions;
    
    extensions.forEach((ext) => {
      expect(ext.id).toBeDefined();
      expect(ext.slug).toBeDefined();
      expect(ext.name).toBeDefined();
      expect(ext.description).toBeDefined();
      expect(ext.icon).toBeDefined();
      expect(ext.frameworks).toBeDefined();
      expect(Array.isArray(ext.frameworks)).toBe(true);
      expect(ext.modal).toBeDefined();
      expect(ext.modal.images).toBeDefined();
      expect(ext.modal.technologies).toBeDefined();
    });
  });

  it('should have extension-specific fields', () => {
    const extensions = extensionsData.pt.extensions;
    
    extensions.forEach((ext) => {
      expect(ext.downloads).toBeDefined();
      expect(ext.releaseDate).toBeDefined();
      expect(ext.modal.details).toBeDefined();
    });
  });
});
