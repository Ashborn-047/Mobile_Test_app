import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { storage } from '../../utils/storage';

import { PersonalityProfileV2 } from './types';
import { Results } from './components/Results';
import { PersonalityQuiz } from './components/PersonalityQuiz';

// Main Personality Page Component
export const PersonalityPage = () => {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState<PersonalityProfileV2 | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = storage.get<PersonalityProfileV2>('currentPersonalityProfile');
    if (saved) {
      setCurrentProfile(saved);
    }
  }, []);

  const handleQuizComplete = (answers: Record<string, number>) => {
    setQuizAnswers(answers);
    setShowQuiz(false);
    // The Results component will handle saving to history and setting current profile
  };

  const handleRetakeQuiz = () => {
    setCurrentProfile(null);
    setQuizAnswers({});
    setShowQuiz(true);
  };

  if (showQuiz) {
    return <PersonalityQuiz onComplete={handleQuizComplete} onBack={() => setShowQuiz(false)} />;
  }

  // Display results if a profile exists or quiz just completed
  if (currentProfile || Object.keys(quizAnswers).length > 0) {
    return <Results onRetakeQuiz={handleRetakeQuiz} answers={quizAnswers} />;
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Button onClick={() => navigate('/')} variant="secondary" className="mb-4">
        ← Back to Dashboard
      </Button>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-7 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark">Personality Profiler</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Discover your unique personality traits through our AI-powered assessment</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="text-center">
          <p className="text-turquoise/70 mb-8 text-lg">
            Start your assessment to generate your profile.
          </p>
          <Button onClick={() => setShowQuiz(true)} className="text-lg px-8 py-4">
            Take Personality Quiz
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

// Re-export other module members
export * from './types';
export * from './utils';
export * from './components/PersonalityQuiz';
export * from './components/Results';
export * from './components/History';
export * from './components/Comparison';
export * from './components/AnimatedAvatarV2';
export * from './components/ResultsCard';
export * from './components/QuestionCard';