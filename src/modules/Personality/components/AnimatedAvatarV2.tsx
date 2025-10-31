import { motion } from "framer-motion";

interface AnimatedAvatarV2Props {
  emoji: string;
  size?: "sm" | "md" | "lg";
}

export const AnimatedAvatarV2 = ({
  emoji,
  size = "md",
}: AnimatedAvatarV2Props) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-xl",
    md: "w-16 h-16 text-3xl",
    lg: "w-24 h-24 text-5xl",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-turquoise/20 flex items-center justify-center border border-turquoise/40`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        {emoji}
      </motion.span>
    </motion.div>
  );
};
