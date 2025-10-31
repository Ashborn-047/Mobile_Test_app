export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  transition: { duration: 0.5 },
};

export const slideIn = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const slideOut = {
  hidden: { x: 0 },
  visible: { x: '100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const scaleUp = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
  transition: { duration: 0.3 },
};

export const scaleDown = {
  hidden: { scale: 1 },
  visible: { scale: 0 },
  transition: { duration: 0.3 },
};