import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    header: ({ children, ...props }) => React.createElement('header', props, children),
    img: ({ children, ...props }) => React.createElement('img', props, children),
    section: ({ children, ...props }) => React.createElement('section', props, children),
    footer: ({ children, ...props }) => React.createElement('footer', props, children),
    a: ({ children, ...props }) => React.createElement('a', props, children),
  },
  AnimatePresence: ({ children }) => children,
}));

const mockChangeLanguage = vi.fn();
vi.mock('@/app/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    currentLanguage: 'pt',
    changeLanguage: mockChangeLanguage,
  }),
}));