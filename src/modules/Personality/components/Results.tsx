import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../../src/components/Card';
import { Button } from '../../../../src/components/Button';
import { LoadingShimmer } from '../../../../src/components/LoadingShimmer';
import { RadarChartComponent } from '../../../../src/components/RadarChart';
import { PersonalityProfileV2 } from '../types';
import { storage } from '../../../../src/utils/storage';
import { generatePersonalitySummary } from '../utils';
import { ResultsCard } from './ResultsCard';

interface PersonalityResultsProps {
  onRetakeQuiz: () => void;
  answers: Record<string, number>;
}

export const Results = ({ onRetakeQuiz, answers }: PersonalityResultsProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PersonalityProfileV2 | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveAndSetProfile = async () => {
      setLoading(true);
      const { summary, traits, emoji } = generatePersonalitySummary(answers);
      const newProfile: PersonalityProfileV2 = {
        id: Date.now().toString(),
        summary,
        traits,
        radarData: traits, // Using traits directly for radar data for simplicity, can be more complex
        createdAt: new Date().toISOString(),
        emoji,
      };

      const existingProfiles = storage.get<PersonalityProfileV2[]>('personalityHistory') || [];
      const updatedProfiles = [...existingProfiles, newProfile];
      storage.set('personalityHistory', updatedProfiles);
      storage.set('currentPersonalityProfile', newProfile);
      storage.set('hasCompletedPersonalityQuiz', true);
      setProfile(newProfile);
      setLoading(false);

      // Simple success interstitial then go home
      setTimeout(() => {
        alert('✨ Profile Complete! Your journey begins.');
      }, 400);
    };
    saveAndSetProfile();
  }, [answers]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <LoadingShimmer />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center text-red-500">Error loading profile.</div>;
  }

  const lastQuizDate = new Date(profile.createdAt);
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const showRetakeReminder = lastQuizDate < ninetyDaysAgo;

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
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark">Your Personality Profile</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Discover your unique traits and strengths</p>
        </div>
      </motion.div>

      <ResultsCard profile={profile} />

      <Card className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-turquoise">Personality Radar</h2>
        <RadarChartComponent data={profile.radarData} />
      </Card>

      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={onRetakeQuiz}>Retake Quiz</Button>
        <Button onClick={() => navigate('/personality/history')} variant="secondary">View History</Button>
      </div>

      {showRetakeReminder && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-turquoise/10 border border-turquoise/30 rounded-xl text-center text-turquoise text-sm"
        >
          It's been over 90 days! Consider retaking the quiz for updated insights.
        </motion.div>
      )}
    </div>
  );
};
