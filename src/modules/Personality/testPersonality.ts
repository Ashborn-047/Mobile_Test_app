import * as PersonalityModule from "./calculatePersonalityResult.ts";

const mockAnswers: PersonalityModule.QuizAnswer[] = [
  { id: "1", category: "Openness", score: 5 },
  { id: "2", category: "Conscientiousness", score: 3 },
  { id: "3", category: "Extraversion", score: 4 },
  { id: "4", category: "Agreeableness", score: 4 },
  { id: "5", category: "Neuroticism", score: 2 },
  { id: "6", category: "Openness", score: 5 },
  { id: "7", category: "Conscientiousness", score: 3 },
  { id: "8", category: "Extraversion", score: 4 },
  { id: "9", category: "Agreeableness", score: 4 },
  { id: "10", category: "Neuroticism", score: 3 },
];

console.log(PersonalityModule.calculatePersonalityResult(mockAnswers));
