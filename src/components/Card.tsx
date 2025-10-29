import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card = ({ children, className = '', glow = true }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-dark-teal/80 backdrop-blur-sm
        rounded-2xl p-6
        border border-turquoise/20
        ${glow ? 'shadow-[0_0_20px_rgba(9,218,198,0.1)]' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

