import '@testing-library/jest-dom'
import React from 'react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    header: ({ children, ...props }) => React.createElement('header', props, children),
    img: ({ children, ...props }) => React.createElement('img', props, children),
    section: ({ children, ...props }) => React.createElement('section', props, children),
  },
  AnimatePresence: ({ children }) => children,
})) 