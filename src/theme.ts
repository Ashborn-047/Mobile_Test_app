// Centralized theme constants for LifeSync v2

export const colors = {
  primary: '#09dac6',
  secondary: '#05352d',
  accentSoft: '#e6fffa',
  tealLight: '#0a4d42',
  tealDark: '#021b17',
};

export const gradients = {
  header: `bg-gradient-to-r from-[${colors.tealLight}] to-[${colors.primary}]/70`,
  section: `bg-gradient-to-b from-[${colors.tealLight}] to-[${colors.secondary}]`,
};

export const fonts = {
  family: `'Inter', 'Poppins', sans-serif`,
  size: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '28px',
  },
};

// Base spacing unit is 4px; we use tailwind scale in classnames.
export const spacing = {
  unit: 4,
};

// Shared class presets to reduce duplication
export const presets = {
  card: 'bg-dark-teal/80 backdrop-blur-sm rounded-2xl p-6 border border-turquoise/20 shadow-[0_0_20px_rgba(9,218,198,0.1)]',
  sectionHeader: `${gradients.header} rounded-2xl border border-turquoise/30 px-6 py-7 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]`,
  container: 'min-h-screen p-6 max-w-6xl mx-auto',
};

export const motionDurations = {
  fast: 0.2,
  base: 0.3,
  slow: 0.6,
};


