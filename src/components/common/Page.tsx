import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

export const Page = ({ children }: PageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="max-w-6xl mx-auto"
    >
      {children}
    </motion.div>
  );
};
