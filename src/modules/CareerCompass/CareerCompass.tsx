import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingShimmer } from '../../components/LoadingShimmer';
import { api, Career } from '../../utils/api';
import { storage } from '../../utils/storage';
import { PersonalityProfileV2 } from '../Personality/types';
import { gradients } from '../../theme'; // Import gradients for card backgrounds
import { CareerPathCard } from './components/CareerPathCard'; // Import the new CareerPathCard
import { HybridCareerCard, mockHybridCareers } from './components/HybridCareerCard'; // Import HybridCareerCard and mock data
import { CareerReadingList } from './components/CareerReadingList'; // Import CareerReadingList
import { CareerPeopleLikeYou } from './components/CareerPeopleLikeYou'; // Import CareerPeopleLikeYou

export const CareerCompass = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PersonalityProfileV2 | null>(null);

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      const storedProfile = storage.get<PersonalityProfileV2>('currentPersonalityProfile');
      setProfile(storedProfile);

      if (storedProfile) {
        try {
          const recommendedCareers = await api.getCareerRecommendations(storedProfile.id, storedProfile);
          setCareers(recommendedCareers);
        } catch (error) {
          console.error('Error fetching career recommendations:', error);
        }
      }
      setLoading(false);
    };
    fetchCareers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <LoadingShimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto bg-cream-light text-dark-teal">
      <Button onClick={() => navigate('/')} variant="secondary" className="mb-4">
        ← Back to Dashboard
      </Button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-7 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark">🧭 Your Career Compass</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Based on Creative Visionary profile</p>
        </div>
      </motion.div>

      {!profile ? (
        <Card className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-turquoise">Build your profile first!</h2>
          <p className="text-turquoise/70 mb-8 text-lg">
            Complete your personality quiz to unlock personalized career recommendations.
          </p>
          <Button onClick={() => navigate('/personality')} className="text-lg px-8 py-4">
            Take Personality Quiz
          </Button>
        </Card>
      ) : careers.length === 0 ? (
        <Card className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-turquoise">No career recommendations yet.</h2>
          <p className="text-turquoise/70 mb-8 text-lg">
            We're still analyzing your profile. Check back soon!
          </p>
          <Button onClick={() => navigate('/personality')} variant="secondary" className="text-lg px-8 py-4">
            Update Personality Profile
          </Button>
        </Card>
      ) : (
        <div className="space-y-12">
          {/* 1. YOUR CAREER DNA (Interactive circle diagram - placeholder) */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Your Career DNA</h2>
            <Card className="h-48 flex items-center justify-center bg-gray-100 text-gray-700">
              Interactive Circle Diagram Placeholder
            </Card>
          </section>

          {/* 2. THREE CAREER PATHS (Expandable cards) */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">Explore Career Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => (
                <CareerPathCard key={career.id} career={career} />
              ))}
            </div>
          </section>

          {/* 3. BEYOND TRADITIONAL PATHS (Hybrid Careers) */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Beyond Traditional Paths</h2>
            <div className="flex overflow-x-auto pb-4 space-x-4">
              {mockHybridCareers.map((hybridCareer) => (
                <HybridCareerCard key={hybridCareer.id} career={hybridCareer} />
              ))}
            </div>
          </section>

          {/* 4. COMPARE YOUR PATHS (Interactive table - placeholder) */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Compare Your Paths</h2>
            <Card className="h-48 flex items-center justify-center bg-gray-100 text-gray-700">
              Interactive Comparison Table Placeholder
            </Card>
          </section>

          {/* 5. YOUR READING LIST (Placeholders) */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Your Reading List</h2>
            <CareerReadingList />
          </section>

          {/* 6. PEOPLE LIKE YOU (Career personas - placeholders) */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">People Like You</h2>
            <CareerPeopleLikeYou />
          </section>

        </div>
      )}
    </div>
  );
};

