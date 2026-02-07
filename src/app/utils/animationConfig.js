// Floating animation for ornaments (subtle Y-axis movement)
export const floatingVariant = {
  float: {
    y: [0, -6, 0, 6, 0],
    transition: {
      repeat: Infinity,
      duration: 8,
      ease: "easeInOut",
    },
  },
};

export const floatingSlowVariant = {
  float: {
    y: [0, -8, 0, 8, 0],
    transition: {
      repeat: Infinity,
      duration: 12,
      ease: "easeInOut",
    },
  },
};

export const floatingFastVariant = {
  float: {
    y: [0, -4, 0, 4, 0],
    transition: {
      repeat: Infinity,
      duration: 5,
      ease: "easeInOut",
    },
  },
};

// Stagger container for list/card entrances
export const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item for individual elements
export const staggerItemVariant = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Fade in animation for sections
export const fadeInVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Hover microinteraction for cards
export const cardHoverVariant = {
  rest: {
    scale: 1,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.99,
  },
};

// Button hover microinteraction
export const buttonHoverVariant = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  tap: { scale: 0.97 },
};

// Badge hover microinteraction
export const badgeHoverVariant = {
  rest: { scale: 1, opacity: 0.9 },
  hover: {
    scale: 1.05,
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

// Parallax effect for scroll (to be used with useScroll)
export const parallaxVariant = {
  initial: { y: 0 },
};

// Legacy rotation variants (kept for compatibility, will be phased out)
export const logoRotationVariant = {
  rotate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 50,
      ease: "linear",
    },
  },
};

export const smallCircleRotationVariant = {
  rotate: {
    rotate: -360,
    transition: {
      repeat: Infinity,
      duration: 30,
      ease: "linear",
    },
  },
};

export const mediumCircleRotationVariant = {
  rotate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 40,
      ease: "linear",
    },
  },
};

export const slowRotationVariant = {
  rotate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 80,
      ease: "linear",
    },
  },
};

export const counterRotationVariant = {
  rotate: {
    rotate: -360,
    transition: {
      repeat: Infinity,
      duration: 60,
      ease: "linear",
    },
  },
};

// Utility to check for reduced motion preference
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Reduced motion variants (static alternatives)
export const reducedMotionVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};