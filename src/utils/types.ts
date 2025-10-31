export interface Meditation {
  type: 'affirmation' | 'meditation';
  text: string;
  duration: number;
  personalityInsight?: string; // Added for personality-based insights
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface MoodEntry {
  id: string;
  mood: string;
  timestamp: string;
}

export interface MeditationSession {
  id: string;
  type: 'affirmation' | 'meditation';
  text: string;
  duration: number;
  personalityInsight?: string;
  timestamp: string;
  moodBefore: string;
  moodAfter?: string; // Optional, can be added after session
}
