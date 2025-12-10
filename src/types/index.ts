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
  avatar?: string; // Optional for multi-player mode
  displayNumber?: number; // Human-friendly number (#1, #2, etc.)
  createdAt?: number; // Timestamp for sorting
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

export type Screen = 'start' | 'player-setup' | 'player-turn' | 'question' | 'game-summary' | 'leaderboard';

export interface PlayerRound {
  playerId: string;
  questions: Question[];
  questionStates: QuestionState[];
  completed: boolean;
}

export interface GameState {
  players: Player[]; // All players in the game
  currentPlayerIndex: number; // Index of player currently playing
  activePlayer: Player | null;
  currentScreen: Screen;
  currentRound: Question[];
  currentQuestionIndex: number;
  questionStates: QuestionState[];
  playerRounds: PlayerRound[]; // Track each player's round
  friendSelected: Player | null;
  multipleChoiceActive: boolean;
  usedQuestionIds: string[]; // Track questions used during active game
  gameInProgress: boolean;
}

