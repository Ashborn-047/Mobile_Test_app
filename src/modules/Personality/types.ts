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
  brainDominance: number;
  personalityType: string;
  superpower: string;
  challenge: string;
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
