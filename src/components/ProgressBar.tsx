import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export const ProgressBar = ({ progress, label }: ProgressBarProps) => {
  return (
    <div className="w-full">
      {label && <p className="text-sm text-turquoise/70 mb-2">{label}</p>}
      <div className="h-2 bg-teal-light/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-turquoise rounded-full shadow-[0_0_10px_rgba(9,218,198,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};
