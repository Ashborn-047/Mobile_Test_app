import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingShimmer } from '../../components/LoadingShimmer';
import { api, Meditation } from '../../utils/api';
import { storage } from '../../utils/storage';

export const MindMesh = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Meditation | null>(null);
  const [breathing, setBreathing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || !goal) return;

    setLoading(true);
    try {
      const meditation = await api.generateMeditation(mood, goal, duration);
      setResult(meditation);
      storage.set('currentMood', mood);
      storage.set('lastMeditation', meditation);
      setBreathing(true);
    } catch (error) {
      console.error('Error generating meditation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = storage.get<Meditation>('lastMeditation');
    if (saved) {
      setResult(saved);
    }
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto relative overflow-hidden">
      {breathing && (
        <motion.div
          className="absolute inset-0 bg-turquoise/5 rounded-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        <Button onClick={() => navigate('/')} variant="secondary" className="mb-6">
          ← Back to Dashboard
        </Button>
        <h1 className="text-4xl font-bold text-turquoise mb-2">Mind Mesh</h1>
        <p className="text-turquoise/70 mb-8">Find your center with AI-guided mindfulness</p>

        {loading ? (
          <LoadingShimmer />
        ) : result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-turquoise/20 text-turquoise rounded-full text-sm font-medium border border-turquoise/40">
                  {result.type === 'affirmation' ? 'Affirmation' : 'Meditation'}
                </span>
                <span className="text-turquoise/70 text-sm">{result.duration} min</span>
              </div>
              <p className="text-turquoise/90 text-lg leading-relaxed">{result.text}</p>
            </Card>
            <Button onClick={() => { setResult(null); setBreathing(false); }} variant="secondary">
              Start New Session
            </Button>
          </motion.div>
        ) : (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-turquoise/70 mb-2">How are you feeling?</label>
                <input
                  type="text"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-4 py-3 bg-teal-light/50 border border-turquoise/30 rounded-xl text-turquoise placeholder-turquoise/40 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise/20"
                  placeholder="e.g., Anxious, Calm, Stressed, Excited"
                />
              </div>
              <div>
                <label className="block text-turquoise/70 mb-2">What's your goal?</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-teal-light/50 border border-turquoise/30 rounded-xl text-turquoise placeholder-turquoise/40 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise/20"
                  placeholder="e.g., Focus, Relax, Confidence"
                />
              </div>
              <div>
                <label className="block text-turquoise/70 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-teal-light/50 border border-turquoise/30 rounded-xl text-turquoise placeholder-turquoise/40 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise/20"
                />
              </div>
              <Button type="submit" className="w-full">Generate Session</Button>
            </form>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

