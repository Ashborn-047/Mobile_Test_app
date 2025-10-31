import {
  PersonalityTrait,
  PersonalityProfileV2,
  ComparisonResult,
  QuizQuestion,
} from "./types";

export const calculateRadarData = (
  profile: PersonalityProfileV2,
): PersonalityTrait[] => {
  // In a real app, this would be more complex, based on quiz answers.
  // For now, we'll use the profile's traits to generate radar data.
  return profile.traits.map((t) => ({ trait: t.trait, value: t.value }));
};

export const getTraitChange = (
  before: number,
  after: number,
): "up" | "down" | "same" => {
  if (after > before) return "up";
  if (after < before) return "down";
  return "same";
};

export const comparePersonalityProfiles = (
  profileBefore: PersonalityProfileV2,
  profileAfter: PersonalityProfileV2,
): ComparisonResult[] => {
  const comparison: ComparisonResult[] = [];
  profileBefore.traits.forEach((traitBefore) => {
    const traitAfter = profileAfter.traits.find(
      (t) => t.trait === traitBefore.trait,
    );
    if (traitAfter) {
      comparison.push({
        trait: traitBefore.trait,
        valueBefore: traitBefore.value,
        valueAfter: traitAfter.value,
        change: getTraitChange(traitBefore.value, traitAfter.value),
      });
    }
  });
  return comparison;
};

export const generatePersonalitySummary = (
  answers: Record<string, number>,
): { summary: string; traits: PersonalityTrait[]; emoji: string } => {
  // Mock AI summary based on answers
  const traitsMap: Record<string, number> = {};
  for (const question of personalityQuestions) {
    const answerValue = answers[question.id];
    if (answerValue) {
      traitsMap[question.category] =
        (traitsMap[question.category] || 0) + answerValue;
    }
  }

  const traits: PersonalityTrait[] = Object.entries(traitsMap).map(
    ([trait, value]) => ({
      trait,
      value: Math.round(value * 10), // Scale up for radar chart
    }),
  );

  const summary =
    "Based on your responses, you exhibit a balanced profile with strong tendencies towards openness and conscientiousness. You are likely a thoughtful and organized individual who enjoys new experiences and pays attention to detail.";
  const emoji = "🧠"; // Example emoji, could be dynamic

  return { summary, traits, emoji };
};

export const personalityQuestions: QuizQuestion[] = [
  {
    id: "1",
    text: "I enjoy exploring new ideas and concepts",
    category: "Openness",
  },
  {
    id: "2",
    text: "I keep my workspace organized",
    category: "Conscientiousness",
  },
  {
    id: "3",
    text: "I feel energized around large groups of people",
    category: "Extraversion",
  },
  { id: "4", text: "I trust others easily", category: "Agreeableness" },
  { id: "5", text: "I worry about things often", category: "Neuroticism" },
  {
    id: "6",
    text: "I appreciate art and aesthetic experiences",
    category: "Openness",
  },
  {
    id: "7",
    text: "I follow through on commitments",
    category: "Conscientiousness",
  },
  {
    id: "8",
    text: "I prefer one-on-one conversations",
    category: "Extraversion",
  },
  {
    id: "9",
    text: "I prioritize others' needs over my own",
    category: "Agreeableness",
  },
  { id: "10", text: "I handle stress well", category: "Neuroticism" },
];
