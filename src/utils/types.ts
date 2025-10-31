export interface PersonalityTrait {
  trait: string;
  value: number;
}

export interface PersonalityProfileV2 {
  id: string;
  summary: string;
  traits: PersonalityTrait[];
  radarData: PersonalityTrait[];
  createdAt: string;
  emoji: string;
  brainDominance: number; // Added
  personalityType: string; // Added
  superpower: string; // Added
  challenge: string; // Added
}

export interface ComparisonResult {
  trait: string;
  valueBefore: number;
  valueAfter: number;
  change: "up" | "down" | "same";
}

export interface QuizAnswer {
  id: string;
  value: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  category: string;
}

export interface DailyInsight {
  id: string;
  text: string;
  category: string;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  skills: string[];
  matchScore: number;
  progress: number;
}

export interface Meditation {
  type: "affirmation" | "meditation";
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
  type: "affirmation" | "meditation";
  text: string;
  duration: number;
  personalityInsight?: string;
  timestamp: string;
  moodBefore: string;
  moodAfter?: string; // Optional, can be added after session
}
