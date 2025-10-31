import { useEffect, useState } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { storage } from '../../utils/storage';
import { WelcomeModal } from '../../components/WelcomeModal';
import { PersonalityProfileV2 } from '../Personality/types';
import { gradients } from '../../theme'; // Import gradients from theme.ts
import { ProfileCard } from './components/ProfileCard'; // Import the new ProfileCard
import { api } from '../../utils/api'; // Import the API utility

// Placeholder components for the new Bento grid cards
const DailySyncCard = ({ dailySync }: { dailySync: any }) => (
  <Card className={`${gradients.dailySyncCard} col-span-1 md:col-span-6 h-48`}>
    <h3 className="text-xl font-semibold text-white">Daily Sync</h3>
    <p className="text-white/80">Mood: {dailySync?.mood || 'Neutral'}</p>
    <p className="text-white/80">Spend: ${dailySync?.spend?.toFixed(2) || '0.00'}</p>
    <p className="text-white/80">Progress: {dailySync?.progress || 0}%</p>
  </Card>
);

const QuickTipCard = () => (
  <Card className={`${gradients.quickTipCard} col-span-1 md:col-span-3 h-48`}>
    <h3 className="text-xl font-semibold text-dark-teal">💡 Quick Tip</h3>
    <p className="text-dark-teal/80">"Embrace change for growth!"</p>
  </Card>
);

const PersonalityDisplayCard = ({ profile, navigate }: { profile: PersonalityProfileV2 | null, navigate: NavigateFunction }) => (
  <Card className={`${gradients.personalityCard} col-span-1 md:col-span-7 h-64 flex flex-col justify-between`}>
    <div>
      <h3 className="text-xl font-semibold text-white">Your Personality</h3>
      <p className="text-white/80">{profile?.summary.substring(0, 50) || 'Complete quiz for insights'}</p>
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
      {profile?.traits.map(t => (
        <span key={t.trait} className="px-3 py-1 bg-white/20 text-white rounded-full text-xs">{t.trait}</span>
      ))}
    </div>
    <Button onClick={() => navigate('/personality')} variant="secondary" className="mt-4 w-full">View Report</Button>
  </Card>
);

const CareerMatchCard = ({ careers, navigate }: { careers: any[], navigate: NavigateFunction }) => (
  <Card className={`${gradients.careerCard} col-span-1 md:col-span-5 h-64 flex flex-col justify-between`}>
    <div>
      <h3 className="text-xl font-semibold text-white">Career Match</h3>
      {careers.length > 0 ? (
        <p className="text-white/80">Top: {careers[0].title}</p>
      ) : (
        <p className="text-white/80">No recommendations yet</p>
      )}
    </div>
    <Button onClick={() => navigate('/career')} variant="secondary" className="mt-4 w-full">Continue →</Button>
  </Card>
);

const QuickActionButtons = ({ navigate, onShowStats }: { navigate: NavigateFunction; onShowStats: () => void }) => (
  <>
    <Button className={`${gradients.quickActionsCard} col-span-2`} onClick={() => navigate('/personality')}>Take Quiz</Button>
    <Button className={`${gradients.quickActionsCard} col-span-3`} onClick={() => navigate('/career')}>Explore Careers</Button>
    <Button className={`${gradients.quickActionsCard} col-span-2`} onClick={() => navigate('/mindmesh')}>Mind Mesh</Button>
    <Button className={`${gradients.quickActionsCard} col-span-3`} onClick={() => navigate('/budget')}>Budget Buddy</Button>
    <Button className={`${gradients.quickActionsCard} col-span-2`} onClick={onShowStats}>Stats Card</Button>
  </>
);


export const Dashboard = () => {
  const navigate = useNavigate();
  const [dailySync, setDailySync] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<PersonalityProfileV2 | null>(null);
  const [recommendedCareers, setRecommendedCareers] = useState<any[]>([]);
  const [showStatsModal, setShowStatsModal] = useState(false);

  useEffect(() => {
    const hasCompleted = storage.get<boolean>('hasCompletedPersonalityQuiz') === true;
    const storedProfile = storage.get<PersonalityProfileV2>('currentPersonalityProfile');
    setCurrentProfile(storedProfile);

    const expenses = storage.get<any[]>('expenses') || [];
    const mood = storage.get('currentMood');

    const todayExpenses = expenses.filter(
      (e: any) => new Date(e.date).toDateString() === new Date().toDateString()
    );

    const totalSpend = todayExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);

    setDailySync({
      hasProfile: !!storedProfile,
      mood: mood || 'Neutral',
      spend: totalSpend,
      progress: storedProfile ? 75 : 0, // Mock progress
    });

    // Fetch career recommendations if profile exists
    const fetchCareers = async () => {
      if (storedProfile) {
        try {
          const careers = await api.getCareerRecommendations(storedProfile.id, storedProfile);
          setRecommendedCareers(careers);
        } catch (error) {
          console.error("Error fetching careers for dashboard:", error);
        }
      }
    };
    fetchCareers();

    // First-time experience logic
    if (!hasCompleted) {
      setShowWelcome(true);
    } else if (hasCompleted && !storedProfile) { // Should not happen if quiz completion sets profile
        const bannerDismissed = sessionStorage.getItem('ls_banner_dismissed') === '1';
        setShowBanner(!bannerDismissed);
    }
  }, []);

  // Dashboard stats demo data (in the real app fetch from storage or API)
  const expenses = (window.localStorage && window.localStorage.getItem('expenses')) ? JSON.parse(window.localStorage.getItem('expenses') || '[]') : [];
  const totalSpend = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
  const categoryTotals = expenses.reduce((acc: any, exp: any) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const categories = Object.keys(categoryTotals);
  const maxCategory = categories.reduce((max, cat) =>
    categoryTotals[cat] > (categoryTotals[max] || 0) ? cat : max,
    categories[0] || ''
  );

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 col-span-full"
      >
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-8 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark drop-shadow-sm">Lifesync</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Your Personal Development Companion</p>
        </div>
      </motion.div>

      {/* Persistent Banner for Skipped Quiz */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 col-span-full"
        >
          <div className="flex items-start justify-between gap-3 bg-turquoise/10 border border-turquoise/30 rounded-xl px-4 py-3">
            <div className="text-turquoise/90 text-sm">
              <button onClick={() => navigate('/personality')} className="underline underline-offset-4 hover:text-turquoise">👋 Complete your personality profile to unlock career recommendations</button>
            </div>
            <button
              aria-label="Dismiss"
              className="text-turquoise/60 hover:text-turquoise"
              onClick={() => { sessionStorage.setItem('ls_banner_dismissed', '1'); setShowBanner(false); }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <ProfileCard profile={currentProfile} />
        <DailySyncCard dailySync={dailySync} />
        <QuickTipCard />
        <PersonalityDisplayCard profile={currentProfile} navigate={navigate} />
        <CareerMatchCard careers={recommendedCareers} navigate={navigate} />
        <QuickActionButtons navigate={navigate} onShowStats={() => setShowStatsModal(true)} />
      </div>

      <WelcomeModal
        open={showWelcome}
        onStartQuiz={() => { setShowWelcome(false); navigate('/personality'); storage.set('hasCompletedPersonality', false); /* to ensure the quiz is started */ }}
        onSkip={() => { setShowWelcome(false); storage.set('hasCompletedPersonality', false); sessionStorage.setItem('ls_banner_dismissed', '0'); setShowBanner(true); }}
      />

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-cream-light rounded-2xl p-6 max-w-md w-full shadow-xl border-turquoise/20 border">
            <h2 className="text-xl font-bold mb-4 text-turquoise">LifeSync Stats Card 📊</h2>
            <ul className="mb-4 space-y-2 text-teal-dark text-base">
              <li><span className="font-semibold">Total Spend:</span> ${totalSpend.toFixed(2)}</li>
              <li><span className="font-semibold">Top Category:</span> {maxCategory || 'N/A'}</li>
              <li><span className="font-semibold">Categories Tracked:</span> {categories.length}</li>
              <li><span className="font-semibold">Latest Expense:</span> {expenses.length > 0 ? expenses[expenses.length - 1].description : '—'}</li>
            </ul>
            <div className="mb-4 bg-turquoise/10 text-turquoise px-4 py-2 rounded-lg text-center">
              💡 <span className="font-medium">Tip:</span> {totalSpend > 500 ? 'Review your biggest category for saving opportunities.' : 'You are within a healthy budget!'}
            </div>
            <Button onClick={() => setShowStatsModal(false)} className="w-full">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

