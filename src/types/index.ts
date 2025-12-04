export interface Question {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
  options: string[];
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
}

export interface QuestionState {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  usedMultipleChoice: boolean;
  usedFriend: boolean;
  friendId: string | null;
  pointsPlayer: number;
  pointsFriend: number;
}

export interface RoundResult {
  playerId: string;
  totalScore: number;
  answers: QuestionState[];
  createdAt: number;
}

export interface LeaderboardEntry {
  playerId: string;
  totalScore: number;
  averageScore: number;
  gamesPlayed: number;
  helperPointsGiven: number;
  helperPointsReceived: number;
  lastPlayed: number;
}

export type Screen = 'avatar-select' | 'question' | 'result' | 'leaderboard';

export interface GameState {
  activePlayer: Player | null;
  currentScreen: Screen;
  currentRound: Question[];
  currentQuestionIndex: number;
  questionStates: QuestionState[];
  friendSelected: Player | null;
  multipleChoiceActive: boolean;
}

