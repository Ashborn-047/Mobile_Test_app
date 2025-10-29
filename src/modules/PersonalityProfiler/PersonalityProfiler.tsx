import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingShimmer } from '../../components/LoadingShimmer';
import { RadarChartComponent } from '../../components/RadarChart';
import { api, PersonalityProfile } from '../../utils/api';
import { storage } from '../../utils/storage';
import { PersonalityQuiz } from './PersonalityQuiz';

export const PersonalityProfiler = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const saved = storage.get<PersonalityProfile>('personalityProfile');
    if (saved) {
      setProfile(saved);
    }
  }, []);

  const handleQuizComplete = async (answers: Record<string, number>) => {
    setLoading(true);
    try {
      const result = await api.submitPersonalityQuiz(answers);
      storage.set('personalityProfile', result);
      setProfile(result);
      setShowQuiz(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showQuiz) {
    return <PersonalityQuiz onComplete={handleQuizComplete} onBack={() => setShowQuiz(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <LoadingShimmer />
      </div>
    );
  }

  if (profile) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Button onClick={() => navigate('/')} variant="secondary" className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-turquoise mb-2">Your Personality Profile</h1>
          <p className="text-turquoise/70">Discover your unique traits and strengths</p>
        </motion.div>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-turquoise">Summary</h2>
          <p className="text-turquoise/90 leading-relaxed">{profile.summary}</p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-turquoise">Traits</h2>
          <div className="flex flex-wrap gap-2">
            {profile.traits.map((trait) => (
              <span
                key={trait}
                className="px-4 py-2 bg-turquoise/20 text-turquoise rounded-full text-sm font-medium border border-turquoise/40"
              >
                {trait}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-turquoise">Personality Radar</h2>
          <RadarChartComponent data={profile.radarData} />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="text-center">
          <h1 className="text-4xl font-bold text-turquoise mb-4">Personality Profiler</h1>
          <p className="text-turquoise/70 mb-8 text-lg">
            Discover your unique personality traits through our AI-powered assessment
          </p>
          <Button onClick={() => setShowQuiz(true)} className="text-lg px-8 py-4">
            Take Personality Quiz
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

