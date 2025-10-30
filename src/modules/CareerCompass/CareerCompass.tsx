import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingShimmer } from '../../components/LoadingShimmer';
import { ProgressBar } from '../../components/ProgressBar';
import { api, Career } from '../../utils/api';
import { storage } from '../../utils/storage';

export const CareerCompass = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const profile = storage.get<{ id: string }>('personalityProfile');
    if (profile) {
      loadCareers(profile.id);
    }
  }, []);

  const loadCareers = async (profileId: string) => {
    setLoading(true);
    try {
      const results = await api.getCareerRecommendations(profileId);
      setCareers(results);
    } catch (error) {
      console.error('Error loading careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const profile = storage.get<{ id: string }>('personalityProfile');

  if (!profile) {
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
            <h1 className="font-bold text-[28px] leading-tight text-teal-dark">Career Compass</h1>
            <p className="mt-2 text-[16px] text-teal-dark/80">Build your personality profile first to discover career matches</p>
          </div>
        </motion.div>
        <Card className="text-center">
          <Button onClick={() => navigate('/personality')}>
            Take Personality Quiz
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <Button onClick={() => navigate('/')} variant="secondary" className="mb-6">
          ← Back to Dashboard
        </Button>
        <LoadingShimmer />
      </div>
    );
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
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark">Career Compass</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Career paths tailored to your personality</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {careers.map((career) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-turquoise mb-2">{career.title}</h2>
                  <p className="text-turquoise/70 mb-3">{career.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {career.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-turquoise/20 text-turquoise rounded-full text-xs border border-turquoise/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-turquoise">{career.matchScore}%</p>
                  <p className="text-sm text-turquoise/70">Match</p>
                </div>
              </div>
              <ProgressBar progress={career.progress} label="Learning Progress" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

