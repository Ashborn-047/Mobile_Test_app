// Mock API layer

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
  async submitPersonalityQuiz(_answers: Record<string, number>): Promise<PersonalityProfile> {
    await delay(1500);
    
    const traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
    const radarData = traits.map(trait => ({
      trait,
      value: Math.floor(Math.random() * 60) + 40,
    }));

    return {
      id: Date.now().toString(),
      traits: traits.slice(0, 3),
      summary: `You're a creative problem-solver with strong interpersonal skills. You thrive in collaborative environments and bring innovative ideas to the table. Your intuitive nature helps you navigate complex situations with ease.`,
      radarData,
      createdAt: new Date().toISOString(),
    };
  },

  // Career Compass
  async getCareerRecommendations(_profileId: string): Promise<Career[]> {
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

    return careers;
  },

  // MindMesh
  async generateMeditation(mood: string, _goal: string, duration: number): Promise<Meditation> {
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
    
    return {
      type: isAffirmation ? 'affirmation' : 'meditation',
      text: isAffirmation 
        ? affirmations[Math.floor(Math.random() * affirmations.length)]
        : meditations[Math.floor(Math.random() * meditations.length)],
      duration,
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

