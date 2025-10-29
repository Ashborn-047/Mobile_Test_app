import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';

const questions = [
  { id: '1', text: 'I enjoy exploring new ideas and concepts', category: 'Openness' },
  { id: '2', text: 'I keep my workspace organized', category: 'Conscientiousness' },
  { id: '3', text: 'I feel energized around large groups of people', category: 'Extraversion' },
  { id: '4', text: 'I trust others easily', category: 'Agreeableness' },
  { id: '5', text: 'I worry about things often', category: 'Neuroticism' },
  { id: '6', text: 'I appreciate art and aesthetic experiences', category: 'Openness' },
  { id: '7', text: 'I follow through on commitments', category: 'Conscientiousness' },
  { id: '8', text: 'I prefer one-on-one conversations', category: 'Extraversion' },
  { id: '9', text: "I prioritize others' needs over my own", category: 'Agreeableness' },
  { id: '10', text: 'I handle stress well', category: 'Neuroticism' },
];

export const PersonalityQuiz = ({
  onComplete,
  onBack,
}: {
  onComplete: (answers: Record<string, number>) => void;
  onBack: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentIndex].id]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Button onClick={onBack} variant="secondary" className="mb-6">
        ← Back
      </Button>

      <ProgressBar progress={progress} label={`Question ${currentIndex + 1} of ${questions.length}`} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-turquoise">
              {questions[currentIndex].text}
            </h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  variant="secondary"
                  className="w-full text-left justify-start"
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

