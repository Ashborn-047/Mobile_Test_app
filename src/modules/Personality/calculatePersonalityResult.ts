export interface QuizAnswer {
  id: string;
  category: string;
  score: number; // 1–5 scale
}

export interface PersonalityResult {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  dominantTraits: string[];
  personalityType: string;
  summary: string;
}

export function calculatePersonalityResult(answers: QuizAnswer[]): PersonalityResult {
  const traits = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"];
  const scores: Record<string, number[]> = {};

  traits.forEach((t) => (scores[t] = []));
  answers.forEach((ans) => {
    if (scores[ans.category]) scores[ans.category].push(ans.score);
  });

  const traitScores: Record<string, number> = {};
  traits.forEach((t) => {
    const avg = scores[t].length ? scores[t].reduce((a, b) => a + b, 0) / scores[t].length : 0;
    traitScores[t.toLowerCase()] = Math.round((avg / 5) * 100);
  });

  const sortedTraits = Object.entries(traitScores).sort((a, b) => b[1] - a[1]);
  const dominantTraits = [sortedTraits[0][0], sortedTraits[1][0]];
  const combo = dominantTraits.join("-");
  const mapping: Record<string, string> = {
    "openness-extraversion": "Creative Visionary",
    "conscientiousness-agreeableness": "Grounded Nurturer",
    "extraversion-neuroticism": "Energetic Optimist",
    "openness-agreeableness": "Independent Thinker",
    "conscientiousness-neuroticism": "Disciplined Perfectionist",
  };

  const personalityType = mapping[combo] || "Balanced Explorer";
  const summaries: Record<string, string> = {
    "Creative Visionary": "You thrive on imagination and new ideas. The world feels like a canvas for your curiosity.",
    "Grounded Nurturer": "Empathetic and reliable, you create stability for others while staying true to your values.",
    "Energetic Optimist": "You light up rooms and see opportunity in everything. People gravitate to your enthusiasm.",
    "Independent Thinker": "You question assumptions and carve your own path — freedom fuels your creativity.",
    "Disciplined Perfectionist": "You chase excellence with focus and precision. Structure gives you peace.",
    "Balanced Explorer": "You’re adaptable, open, and balanced — a mix of curiosity and composure.",
  };

  return {
    openness: traitScores.openness,
    conscientiousness: traitScores.conscientiousness,
    extraversion: traitScores.extraversion,
    agreeableness: traitScores.agreeableness,
    neuroticism: traitScores.neuroticism,
    dominantTraits,
    personalityType,
    summary: summaries[personalityType],
  };
}
