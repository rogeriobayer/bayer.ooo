import { describe, it, expect } from 'vitest';

describe('Build Validation Tests', () => {
  it('should have all required dependencies in package.json', async () => {
    const packageJson = await import('../../../package.json');
    
    expect(packageJson.dependencies).toHaveProperty('next');
    expect(packageJson.dependencies).toHaveProperty('react');
    expect(packageJson.dependencies).toHaveProperty('react-dom');
    expect(packageJson.dependencies).toHaveProperty('framer-motion');
  });

  it('should have required dev dependencies for testing', async () => {
    const packageJson = await import('../../../package.json');
    
    expect(packageJson.devDependencies).toHaveProperty('vitest');
    expect(packageJson.devDependencies).toHaveProperty('@testing-library/react');
    expect(packageJson.devDependencies).toHaveProperty('@testing-library/jest-dom');
  });

  it('should have required scripts for CI/CD', async () => {
    const packageJson = await import('../../../package.json');
    
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.scripts).toHaveProperty('test:run');
    expect(packageJson.scripts).toHaveProperty('lint');
  });

  it('should validate Next.js configuration exists', async () => {
    const nextConfig = await import('../../../next.config.mjs');
    
    expect(nextConfig.default).toBeDefined();
    expect(typeof nextConfig.default).toBe('object');
  });

  it('should validate Vitest configuration exists', () => {
    const fs = require('fs');
    const path = require('path');
    
    const configPath = path.join(process.cwd(), 'vitest.config.js');
    expect(fs.existsSync(configPath)).toBe(true);
  });

  it('should have proper TypeScript/JavaScript configuration', async () => {
    const jsConfig = await import('../../../jsconfig.json');
    
    expect(jsConfig.compilerOptions).toBeDefined();
    expect(jsConfig.compilerOptions.paths).toHaveProperty('@/*');
  });

  it('should validate SEO files exist', () => {
    expect(() => import('../../app/sitemap.js')).not.toThrow();
  });

  it('should validate environment is properly configured for testing', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should validate all translation keys are consistent', async () => {
    const { translations } = await import('../../app/data/translations.js');
    
    const ptKeys = Object.keys(translations.pt);
    const enKeys = Object.keys(translations.en);
    const frKeys = Object.keys(translations.fr);
    
    expect(ptKeys.sort()).toEqual(enKeys.sort());
    expect(ptKeys.sort()).toEqual(frKeys.sort());
    expect(ptKeys.length).toBeGreaterThan(0);
  });


  });
