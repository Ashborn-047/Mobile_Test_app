import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { storage } from '../../utils/storage';
import { WelcomeModal } from '../../components/WelcomeModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [dailySync, setDailySync] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const profile = storage.get('personalityProfile');
    const hasCompleted = storage.get<boolean>('hasCompletedPersonalityQuiz') === true;
    const expenses = storage.get<any[]>('expenses') || [];
    const mood = storage.get('currentMood');

    const todayExpenses = expenses.filter(
      (e: any) => new Date(e.date).toDateString() === new Date().toDateString()
    );

    const totalSpend = todayExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);

    setDailySync({
      hasProfile: !!profile,
      mood: mood || 'Neutral',
      spend: totalSpend,
      progress: profile ? 75 : 0,
    });

    // First-time experience logic
    if (!hasCompleted && !profile) {
      setShowWelcome(true);
    } else if (!hasCompleted) {
      const bannerDismissed = sessionStorage.getItem('ls_banner_dismissed') === '1';
      setShowBanner(!bannerDismissed);
    }
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-8 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark drop-shadow-sm">Lifesync</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Your Personal Development Companion</p>
        </div>
      </motion.div>

      {showBanner && (
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3 bg-turquoise/10 border border-turquoise/30 rounded-xl px-4 py-3">
            <div className="text-turquoise/90 text-sm">
              <button onClick={() => navigate('/personality')} className="underline underline-offset-4 hover:text-turquoise">👋 Complete your personality profile to unlock personalized insights</button>
            </div>
            <button
              aria-label="Dismiss"
              className="text-turquoise/60 hover:text-turquoise"
              onClick={() => { sessionStorage.setItem('ls_banner_dismissed', '1'); setShowBanner(false); }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h2 className="text-2xl font-semibold mb-4 text-turquoise">Daily Sync</h2>
            <div className="space-y-4">
              <div>
                <p className="text-turquoise/70 text-sm">Mood</p>
                <p className="text-turquoise text-xl font-medium">{dailySync?.mood || 'Neutral'}</p>
              </div>
              <div>
                <p className="text-turquoise/70 text-sm">Today's Spend</p>
                <p className="text-turquoise text-xl font-medium">${dailySync?.spend?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-turquoise/70 text-sm">Profile Progress</p>
                <p className="text-turquoise text-xl font-medium">{dailySync?.progress || 0}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="text-2xl font-semibold mb-4 text-turquoise">Quick Actions</h2>
            <div className="space-y-3">
              <Button onClick={() => navigate('/personality')} className="w-full">
                Take Personality Quiz
              </Button>
              <Button onClick={() => navigate('/career')} variant="secondary" className="w-full">
                Explore Careers
              </Button>
              <Button onClick={() => navigate('/mindmesh')} variant="secondary" className="w-full">
                Mind Mesh
              </Button>
              <Button onClick={() => navigate('/budget')} variant="secondary" className="w-full">
                Budget Buddy
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
    <WelcomeModal
      open={showWelcome}
      onStartQuiz={() => { setShowWelcome(false); navigate('/personality'); }}
      onSkip={() => { setShowWelcome(false); setShowBanner(true); }}
    />
  );
};

