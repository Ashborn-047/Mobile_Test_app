import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../../src/components/Button";
import { ProgressBar } from "../../../../src/components/ProgressBar";
import { Card } from "../../../../src/components/Card";
import { personalityQuestions } from "../personalityQuestions"; // Updated import path
import { QuizAnswer } from "../calculatePersonalityResult"; // Import QuizAnswer interface

interface PersonalityQuizProps {
  onComplete: (answers: QuizAnswer[]) => void; // Updated type
  onBack: () => void;
}

export const PersonalityQuiz = ({
  onComplete,
  onBack,
}: PersonalityQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]); // Updated state type

  const handleAnswer = (value: number) => {
    const currentQuestion = personalityQuestions[currentIndex];
    const newAnswer: QuizAnswer = {
      id: currentQuestion.id,
      category: currentQuestion.category,
      score: value,
    };

    const existingAnswerIndex = answers.findIndex( (ans) => ans.id === newAnswer.id );

    let updatedAnswers: QuizAnswer[];
    if (existingAnswerIndex !== -1) {
      updatedAnswers = answers.map((ans, index) =>
        index === existingAnswerIndex ? newAnswer : ans
      );
    } else {
      updatedAnswers = [...answers, newAnswer];
    }
    setAnswers(updatedAnswers);

    if (currentIndex < personalityQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      setTimeout(() => onComplete(updatedAnswers), 300);
    }
  };

  const progress = ((currentIndex + 1) / personalityQuestions.length) * 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Button onClick={onBack} variant="secondary" className="mb-6">
        ← Back
      </Button>

      <ProgressBar
        progress={progress}
        label={`Question ${currentIndex + 1} of ${personalityQuestions.length}`}
      />

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
                  variant={
                    answers.find(
                      (ans) => ans.id === personalityQuestions[currentIndex].id,
                    )?.score === value
                      ? "primary"
                      : "secondary"
                  }
                  whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left justify-center"
                >
                  {value === 1 && "Strongly Disagree"}
                  {value === 2 && "Disagree"}
                  {value === 3 && "Neutral"}
                  {value === 4 && "Agree"}
                  {value === 5 && "Strongly Agree"}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
