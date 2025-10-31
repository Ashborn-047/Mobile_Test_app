import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../src/components/Button';
import { ProgressBar } from '../../../../src/components/ProgressBar';
import { Card } from '../../../../src/components/Card';
import { personalityQuestions } from '../utils';

interface PersonalityQuizProps {
  onComplete: (answers: Record<string, number>) => void;
  onBack: () => void;
}

export const PersonalityQuiz = ({
  onComplete,
  onBack,
}: PersonalityQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [personalityQuestions[currentIndex].id]: value };
    setAnswers(newAnswers);

    if (currentIndex < personalityQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  const progress = ((currentIndex + 1) / personalityQuestions.length) * 100;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Button onClick={onBack} variant="secondary" className="mb-6">
        ← Back
      </Button>

      <ProgressBar progress={progress} label={`Question ${currentIndex + 1} of ${personalityQuestions.length}`} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mt-8 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-turquoise">
              {personalityQuestions[currentIndex].text}
            </h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  variant="secondary"
                  className="w-full text-left justify-center"
                >
                  {value === 1 && 'Strongly Disagree'}
                  {value === 2 && 'Disagree'}
                  {value === 3 && 'Neutral'}
                  {value === 4 && 'Agree'}
                  {value === 5 && 'Strongly Agree'}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};