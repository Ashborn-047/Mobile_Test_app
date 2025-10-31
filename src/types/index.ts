export type PersonalityResult = {
  id: string;
  name: string;
  description: string;
  traits: string[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
};

export type UserResponse = {
  questionId: string;
  selectedOption: string;
};

export type PersonalityHistoryEntry = {
  date: string;
  resultId: string;
  userResponses: UserResponse[];
};
