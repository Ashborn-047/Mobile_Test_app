// Mock API layer

import { PersonalityProfileV2, Career, Meditation, Expense } from './types';

export interface PersonalityProfile {
  id: string;
  traits: string[];
  summary: string;
  radarData: { trait: string; value: number }[];
  createdAt: string;
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
  type: 'affirmation' | 'meditation';
  text: string;
  duration: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Personality Profiler
  async submitPersonalityQuiz(_answers: Record<string, number>): Promise<PersonalityProfileV2> {
    await delay(1500);
    // This is now handled by generatePersonalitySummary in Personality/utils.ts
    // and Personality/components/Results.tsx
    throw new Error("This method is deprecated. Personality quiz logic moved to client-side utilities.");
  },

  // Career Compass
  async getCareerRecommendations(_profileId: string, profile: PersonalityProfileV2): Promise<Career[]> {
    await delay(1000);
    const careers: Career[] = [
      {
        id: '1',
        title: 'UX Designer',
        description: 'Design user-centered experiences for digital products',
        skills: ['Figma', 'User Research', 'Prototyping'],
        matchScore: 92,
        progress: 65,
      },
      {
        id: '2',
        title: 'Product Manager',
        description: 'Lead product strategy and development',
        skills: ['Strategy', 'Communication', 'Analytics'],
        matchScore: 88,
        progress: 45,
      },
      {
        id: '3',
        title: 'Data Scientist',
        description: 'Extract insights from complex data',
        skills: ['Python', 'Machine Learning', 'Statistics'],
        matchScore: 75,
        progress: 30,
      },
    ];
    // Mock logic to adjust matchScore based on personality traits
    if (profile) {
      const opennessTrait = profile.traits.find(t => t.trait === 'Openness');
      const conscientiousnessTrait = profile.traits.find(t => t.trait === 'Conscientiousness');
      const extraversionTrait = profile.traits.find(t => t.trait === 'Extraversion');

      if (opennessTrait && opennessTrait.value > 60) {
        // Higher openness means better match for creative roles
        careers[0].matchScore = Math.min(100, careers[0].matchScore + 5);
      }
      if (conscientiousnessTrait && conscientiousnessTrait.value > 70) {
        // Higher conscientiousness means better match for structured roles
        careers[1].matchScore = Math.min(100, careers[1].matchScore + 5);
      }
      if (extraversionTrait && extraversionTrait.value > 50) {
        // Higher extraversion means better match for people-facing roles
        careers[0].matchScore = Math.min(100, careers[0].matchScore + 3);
        careers[1].matchScore = Math.min(100, careers[1].matchScore + 2);
      }
    }

    return careers.sort((a, b) => b.matchScore - a.matchScore);
  },

  // MindMesh
  async generateMeditation(mood: string, _goal: string, duration: number, personalityProfile: PersonalityProfileV2 | null): Promise<Meditation> {
    await delay(1200);
    
    const affirmations = [
      "You are capable of overcoming any challenge that comes your way.",
      "Every step forward, no matter how small, is progress worth celebrating.",
      "Your inner strength grows with each moment of mindfulness.",
    ];
    
    const meditations = [
      "Take a deep breath. Feel the air filling your lungs, bringing calmness to every cell. As you exhale, release tension and embrace the present moment.",
      "Visualize yourself achieving your goal. See every detail clearly—the sounds, the feelings, the sense of accomplishment. Hold that vision.",
      "Focus on your breath. Inhale peace, exhale stress. With each cycle, you become more centered and aligned with your purpose.",
    ];

    const isAffirmation = mood.toLowerCase().includes('anxious') || mood.toLowerCase().includes('stressed');
    
    let personalityInsight = "";
    if (personalityProfile) {
      const topTrait = personalityProfile.traits.sort((a, b) => b.value - a.value)[0];
      if (topTrait) {
        switch (topTrait.trait) {
          case 'Openness':
            personalityInsight = `As a creative individual, your mind thrives on exploration. Let your thoughts flow freely during this session.`;
            break;
          case 'Conscientiousness':
            personalityInsight = `Your diligent nature benefits from structured mindfulness. Focus on the guided steps to maximize your calm.`;
            break;
          case 'Extraversion':
            personalityInsight = `As an outgoing person, you might find group meditations or sharing your experience helpful. For now, embrace this personal moment.`;
            break;
          case 'Agreeableness':
            personalityInsight = `Your empathetic spirit is a strength. Use this session to extend kindness to yourself, as you do to others.`;
            break;
          case 'Neuroticism':
            personalityInsight = `For your sensitive nature, a gentle focus on breathing can anchor you. Acknowledge your feelings without judgment.`;
            break;
          default:
            personalityInsight = `Your unique personality brings a special quality to mindfulness. Embrace it fully.`;
        }
      }
    }

    return {
      type: isAffirmation ? 'affirmation' : 'meditation',
      text: isAffirmation 
        ? affirmations[Math.floor(Math.random() * affirmations.length)]
        : meditations[Math.floor(Math.random() * meditations.length)],
      duration,
      personalityInsight,
    };
  },

  // BudgetBuddy
  async categorizeExpense(description: string, amount: number): Promise<string> {
    await delay(800);
    
    const categories: Record<string, string[]> = {
      'Food': ['restaurant', 'food', 'cafe', 'coffee', 'lunch', 'dinner', 'groceries'],
      'Transport': ['uber', 'taxi', 'gas', 'parking', 'metro', 'bus'],
      'Shopping': ['amazon', 'store', 'clothes', 'shopping', 'purchase'],
      'Bills': ['electric', 'water', 'internet', 'phone', 'utility'],
      'Entertainment': ['movie', 'concert', 'game', 'streaming', 'netflix'],
    };

    const desc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => desc.includes(kw))) {
        return category;
      }
    }
    
    return amount > 100 ? 'Shopping' : 'Miscellaneous';
  },
};

