import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingShimmer } from '../../components/LoadingShimmer';
import { api, Meditation } from '../../utils/api';
import { storage } from '../../utils/storage';
import { PersonalityProfileV2 } from '../Personality/types'; // Import PersonalityProfileV2
import { gradients } from '../../theme'; // Import gradients from theme.ts
import { MoodEntry, MeditationSession } from '../../utils/types'; // Import new types

export const MindMesh = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Meditation | null>(null);
  const [breathing, setBreathing] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]); // New state for mood history
  const [meditationHistory, setMeditationHistory] = useState<MeditationSession[]>([]); // New state for meditation history

  useEffect(() => {
    const saved = storage.get<Meditation>('lastMeditation');
    if (saved) {
      setResult(saved);
    }
    const savedMoodHistory = storage.get<MoodEntry[]>('moodHistory'); // Load mood history
    if (savedMoodHistory) {
      setMoodHistory(savedMoodHistory);
    }
    const savedMeditationHistory = storage.get<MeditationSession[]>('meditationHistory'); // Load meditation history
    if (savedMeditationHistory) {
      setMeditationHistory(savedMeditationHistory);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || !goal) return;

    setLoading(true);
    try {
      const personalityProfile = storage.get<PersonalityProfileV2>('currentPersonalityProfile');
      const meditation = await api.generateMeditation(mood, goal, duration, personalityProfile);

      const newMoodEntry: MoodEntry = {
        id: Date.now().toString(),
        mood,
        timestamp: new Date().toISOString(),
      };
      const updatedMoodHistory = [...moodHistory, newMoodEntry];
      setMoodHistory(updatedMoodHistory);
      storage.set('moodHistory', updatedMoodHistory);

      const newMeditationSession: MeditationSession = {
        id: Date.now().toString(),
        type: meditation.type,
        text: meditation.text,
        duration: meditation.duration,
        personalityInsight: meditation.personalityInsight,
        timestamp: new Date().toISOString(),
        moodBefore: mood,
      };
      const updatedMeditationHistory = [...meditationHistory, newMeditationSession];
      setMeditationHistory(updatedMeditationHistory);
      storage.set('meditationHistory', updatedMeditationHistory);

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

      <Button onClick={() => navigate('/')} variant="secondary" className="mb-4">
        ← Back to Dashboard
      </Button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-7 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)] mb-8">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark">MindMesh</h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">Find your center with AI-guided mindfulness</p>
        </div>

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
              <p className="text-turquoise/90 text-lg leading-relaxed mb-4">{result.text}</p>
              {result.personalityInsight && (
                <p className="text-turquoise/70 text-sm italic border-t border-turquoise/20 pt-3 mt-3">
                  💡 Insight: {result.personalityInsight}
                </p>
              )}
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
                <div className="flex flex-wrap gap-2">
                  {['Calm', 'Stressed', 'Anxious', 'Energized', 'Focused'].map((m) => (
                    <Button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      variant={mood === m ? 'primary' : 'secondary'}
                      className="px-4 py-2 text-sm"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-turquoise/70 mb-2">What's your goal?</label>
                <div className="flex flex-wrap gap-2">
                  {['Relax', 'Focus', 'Motivate', 'Sleep', 'Clarity'].map((g) => (
                    <Button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      variant={goal === g ? 'primary' : 'secondary'}
                      className="px-4 py-2 text-sm"
                    >
                      {g}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-turquoise/70 mb-2">Duration: {duration} minutes</label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-teal-light/50 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-turquoise/20"
                  style={{ background: `linear-gradient(to right, #09dac6 0%, #09dac6 ${((duration - 1) / 59) * 100}%, #0a4d42 ${((duration - 1) / 59) * 100}%, #0a4d42 100%)` }}
                />
              </div>
              <Button type="submit" className="w-full">Generate Session</Button>
            </form>
          </Card>
        )}
      </motion.div>

      {/* YOUR WELLNESS INSIGHTS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-3xl font-bold text-dark-teal mb-6">Your Wellness Insights 📊</h2>
        <Card className={`${gradients.mindMeshCard} p-6`}>
          <p className="text-white/80">"Based on your personality, you might benefit from grounding exercises when feeling overwhelmed."</p>
          <Button variant="secondary" className="mt-4">Explore Personalized Tips</Button>
        </Card>
      </motion.div>

      {/* MOOD JOURNAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-12 text-center"
      >
        <h2 className="text-3xl font-bold text-dark-teal mb-6">Mood Journal 😌</h2>
        <Card className={`${gradients.mindMeshCard} p-6`}>
          {moodHistory.length === 0 ? (
            <p className="text-white/70">No mood entries yet. Start a session!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {moodHistory.map((entry) => (
                <div key={entry.id} className="bg-teal-light/50 p-3 rounded-lg border border-turquoise/20">
                  <p className="text-white text-lg font-semibold">{entry.mood}</p>
                  <p className="text-white/60 text-xs mt-1">{new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* MEDITATION HISTORY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-12 text-center"
      >
        <h2 className="text-3xl font-bold text-dark-teal mb-6">Meditation History 🧘‍♀️</h2>
        <Card className={`${gradients.mindMeshCard} p-6`}>
          {meditationHistory.length === 0 ? (
            <p className="text-white/70">No meditation sessions yet. Generate your first one!</p>
          ) : (
            <div className="space-y-4">
              {meditationHistory.map((session) => (
                <div key={session.id} className="bg-teal-light/50 p-4 rounded-lg border border-turquoise/20 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-turquoise/20 text-turquoise rounded-full text-xs font-medium">{session.type === 'affirmation' ? 'Affirmation' : 'Meditation'}</span>
                    <span className="text-white/60 text-xs">{session.duration} min</span>
                  </div>
                  <p className="text-white text-md mb-1">{session.text.substring(0, 80)}...</p>
                  <p className="text-white/60 text-xs">Mood Before: {session.moodBefore} | {new Date(session.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

