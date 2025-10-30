import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface WelcomeModalProps {
  open: boolean;
  onStartQuiz: () => void;
  onSkip: () => void;
}

export const WelcomeModal = ({ open, onStartQuiz, onSkip }: WelcomeModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-teal-dark/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-xl"
          >
            <div className="bg-gradient-to-b from-teal-light to-dark-teal rounded-2xl border border-turquoise/30 p-8 shadow-[0_0_40px_rgba(9,218,198,0.12)] text-center">
              <h2 className="font-bold text-[28px] leading-tight text-turquoise">Welcome to Lifesync!</h2>
              <p className="mt-3 text-[16px] text-turquoise/80">Let's start your journey by understanding who you are.</p>
              <p className="mt-1 text-sm text-turquoise/60">This 2-minute quiz will help us personalize your entire experience.</p>

              <div className="mt-8 flex flex-col gap-3">
                <Button onClick={onStartQuiz} className="w-full">Take Personality Quiz</Button>
                <button
                  onClick={onSkip}
                  className="text-turquoise/70 hover:text-turquoise text-sm underline-offset-4 hover:underline"
                >
                  I'll do this later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

