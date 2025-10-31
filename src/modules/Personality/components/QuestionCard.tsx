import { Button } from '../../../../src/components/Button';
import { Card } from '../../../../src/components/Card';
import { QuizQuestion } from '../types';

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (value: number) => void;
}

export const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  return (
    <Card className="mt-8 text-center">
      <h2 className="text-2xl font-semibold mb-6 text-turquoise">
        {question.text}
      </h2>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            onClick={() => onAnswer(value)}
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
  );
};
