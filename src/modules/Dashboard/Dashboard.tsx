import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { storage } from '../../utils/storage';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [dailySync, setDailySync] = useState<any>(null);

  useEffect(() => {
    const profile = storage.get('personalityProfile');
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
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-12 rounded-full bg-turquoise/20 flex items-center justify-center border border-turquoise/40">
          <span className="text-turquoise text-xl font-bold">PB</span>
        </div>
        <h1 className="text-4xl font-bold text-turquoise">LifeSync AI</h1>
      </motion.div>

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
  );
};

