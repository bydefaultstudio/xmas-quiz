import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Player,
  Question,
  QuestionState,
  RoundResult,
  Screen,
  GameState,
  PlayerRound,
} from '@/types';
import { selectRandomQuestions } from '@/data/parseQuestions';
import { checkAnswer, checkMultipleChoiceAnswer } from '@/utils/answerValidation';

interface QuizStore extends GameState {
  allQuestions: Question[];
  setAllQuestions: (questions: Question[]) => void;
  setCurrentScreen: (screen: Screen) => void;
  setPlayers: (players: Player[]) => void;
  startGame: () => void;
  beginPlayerTurn: () => void;
  startNewRound: (questions: Question[]) => void;
  selectAnswer: (answer: string) => void;
  toggleMultipleChoice: () => void;
  selectFriend: (friend: Player) => void;
  clearFriend: () => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  calculateScore: () => { player: number; friend: number };
  completeCurrentPlayerRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  clearUsedQuestions: () => void;
}

const initialQuestionState: QuestionState = {
  questionId: '',
  selectedAnswer: null,
  isCorrect: null,
  usedMultipleChoice: false,
  usedFriend: false,
  friendId: null,
  pointsPlayer: 0,
  pointsFriend: 0,
};

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  activePlayer: null,
  currentScreen: 'start',
  currentRound: [],
  currentQuestionIndex: 0,
  questionStates: [],
  playerRounds: [],
  friendSelected: null,
  multipleChoiceActive: false,
  usedQuestionIds: [],
  gameInProgress: false,
};

export const useGameStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      allQuestions: [],

      setAllQuestions: (questions) => set({ allQuestions: questions }),

      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      setPlayers: (players) => set({ players }),

      startGame: () => {
        const { players, allQuestions } = get();
        if (players.length === 0 || allQuestions.length === 0) return;

        // Initialize player rounds
        const playerRounds: PlayerRound[] = players.map((player) => ({
          playerId: player.id,
          questions: [],
          questionStates: [],
          completed: false,
        }));

        // Start with first player - show Player Turn Screen first
        const firstPlayer = players[0];

        set({
          gameInProgress: true,
          currentScreen: 'player-turn',
          currentPlayerIndex: 0,
          activePlayer: firstPlayer,
          currentRound: [],
          currentQuestionIndex: 0,
          questionStates: [],
          playerRounds,
          multipleChoiceActive: false,
          friendSelected: null,
        });
      },

      beginPlayerTurn: () => {
        // Prepare questions for the current player and start their round
        const { activePlayer, allQuestions, usedQuestionIds } = get();
        if (!activePlayer || allQuestions.length === 0) return;

        const randomQuestions = selectRandomQuestions(
          allQuestions,
          5,
          usedQuestionIds
        );

        const states = randomQuestions.map((q) => ({
          ...initialQuestionState,
          questionId: q.id,
        }));

        // Mark questions as used
        const newQuestionIds = randomQuestions.map((q) => q.id);
        const updatedUsedIds = [
          ...usedQuestionIds,
          ...newQuestionIds.filter((id) => !usedQuestionIds.includes(id)),
        ];

        set({
          currentScreen: 'question',
          currentRound: randomQuestions,
          currentQuestionIndex: 0,
          questionStates: states,
          usedQuestionIds: updatedUsedIds,
          multipleChoiceActive: false,
          friendSelected: null,
        });
      },

      startNewRound: (questions) => {
        const states = questions.map((q) => ({
          ...initialQuestionState,
          questionId: q.id,
        }));

        // Mark questions as used
        const { usedQuestionIds } = get();
        const newQuestionIds = questions.map((q) => q.id);
        const updatedUsedIds = [
          ...usedQuestionIds,
          ...newQuestionIds.filter((id) => !usedQuestionIds.includes(id)),
        ];

        set({
          currentRound: questions,
          currentQuestionIndex: 0,
          questionStates: states,
          multipleChoiceActive: false,
          friendSelected: null,
          usedQuestionIds: updatedUsedIds,
        });
      },

      selectAnswer: (answer) => {
        const { currentQuestionIndex, questionStates } = get();
        const newStates = [...questionStates];
        newStates[currentQuestionIndex] = {
          ...newStates[currentQuestionIndex],
          selectedAnswer: answer,
        };
        set({ questionStates: newStates });
      },

      toggleMultipleChoice: () => {
        const {
          multipleChoiceActive,
          currentQuestionIndex,
          questionStates,
        } = get();
        const newStates = [...questionStates];
        newStates[currentQuestionIndex] = {
          ...newStates[currentQuestionIndex],
          selectedAnswer: null,
        };
        set({
          multipleChoiceActive: !multipleChoiceActive,
          questionStates: newStates,
        });
      },

      selectFriend: (friend) => {
        const { players, currentQuestionIndex, questionStates } = get();
        
        // Prevent Ask a Friend if there's only one player
        if (players.length <= 1) {
          return;
        }
        
        const newStates = [...questionStates];
        newStates[currentQuestionIndex] = {
          ...newStates[currentQuestionIndex],
          usedFriend: true,
          friendId: friend.id,
        };
        set({
          friendSelected: friend,
          questionStates: newStates,
        });
      },

      clearFriend: () => {
        const { currentQuestionIndex, questionStates } = get();
        const newStates = [...questionStates];
        newStates[currentQuestionIndex] = {
          ...newStates[currentQuestionIndex],
          usedFriend: false,
          friendId: null,
        };
        set({
          friendSelected: null,
          questionStates: newStates,
        });
      },

      submitAnswer: () => {
        const {
          currentRound,
          currentQuestionIndex,
          questionStates,
          multipleChoiceActive,
          friendSelected,
        } = get();

        const currentQuestion = currentRound[currentQuestionIndex];
        const currentState = questionStates[currentQuestionIndex];

        if (!currentQuestion || !currentState.selectedAnswer) return;

        // Use appropriate validation based on mode
        let isCorrect: boolean;
        if (multipleChoiceActive) {
          // Multiple choice: exact matching against acceptable answers (no fuzzy)
          isCorrect = checkMultipleChoiceAnswer(
            currentState.selectedAnswer,
            currentQuestion.answer,
            currentQuestion.acceptable_answers || []
          );
        } else {
          // Text input: normalization + acceptable answers + fuzzy matching
          isCorrect = checkAnswer(
            currentState.selectedAnswer,
            currentQuestion.answer,
            currentQuestion.acceptable_answers || [],
            0.75 // Fuzzy threshold
          );
        }

        const { player: pointsPlayer, friend: pointsFriend } =
          get().calculateScore();

        const newStates = [...questionStates];
        newStates[currentQuestionIndex] = {
          ...currentState,
          isCorrect,
          usedMultipleChoice: multipleChoiceActive,
          usedFriend: !!friendSelected,
          friendId: friendSelected?.id || null,
          pointsPlayer: isCorrect ? pointsPlayer : 0,
          pointsFriend: isCorrect ? pointsFriend : 0,
        };

        set({ questionStates: newStates });
      },

      calculateScore: () => {
        const { multipleChoiceActive, friendSelected, players } = get();

        // If there's only one player, friend points are always 0
        if (players.length <= 1) {
          if (!multipleChoiceActive) {
            return { player: 4, friend: 0 };
          } else {
            return { player: 2, friend: 0 };
          }
        }

        if (!multipleChoiceActive && !friendSelected) {
          return { player: 4, friend: 0 };
        } else if (multipleChoiceActive && !friendSelected) {
          return { player: 2, friend: 0 };
        } else if (!multipleChoiceActive && friendSelected) {
          return { player: 2, friend: 2 };
        } else {
          return { player: 1, friend: 1 };
        }
      },

      nextQuestion: () => {
        const { currentQuestionIndex, currentRound } = get();
        if (currentQuestionIndex < currentRound.length - 1) {
          set({
            currentQuestionIndex: currentQuestionIndex + 1,
            multipleChoiceActive: false,
            friendSelected: null,
          });
        }
      },

      completeCurrentPlayerRound: () => {
        const {
          activePlayer,
          questionStates,
          currentRound,
          currentPlayerIndex,
          players,
          playerRounds,
          allQuestions,
          usedQuestionIds,
        } = get();

        if (!activePlayer) return;

        // Save this player's round
        const totalScore = questionStates.reduce(
          (sum, state) => sum + state.pointsPlayer,
          0
        );

        const updatedPlayerRounds = playerRounds.map((round) => {
          if (round.playerId === activePlayer.id) {
            return {
              ...round,
              questions: currentRound,
              questionStates: [...questionStates],
              completed: true,
            };
          }
          return round;
        });

        // Check if all players have completed
        const allCompleted = updatedPlayerRounds.every((round) => round.completed);

        if (allCompleted) {
          // All players done - go to game summary
          set({
            playerRounds: updatedPlayerRounds,
            gameInProgress: false,
            currentScreen: 'game-summary',
          });
        } else {
          // Move to next player - show Player Turn Screen first
          const nextPlayerIndex = currentPlayerIndex + 1;
          const nextPlayer = players[nextPlayerIndex];

          if (nextPlayer) {
            set({
              currentPlayerIndex: nextPlayerIndex,
              activePlayer: nextPlayer,
              currentRound: [],
              currentQuestionIndex: 0,
              questionStates: [],
              playerRounds: updatedPlayerRounds,
              multipleChoiceActive: false,
              friendSelected: null,
              currentScreen: 'player-turn',
            });
          }
        }
      },

      endGame: () => {
        const { playerRounds } = get();
        // Save current round if in progress
        const {
          activePlayer,
          questionStates,
          currentRound,
        } = get();

        if (activePlayer && questionStates.length > 0) {
          const updatedPlayerRounds = playerRounds.map((round) => {
            if (round.playerId === activePlayer.id && !round.completed) {
              return {
                ...round,
                questions: currentRound,
                questionStates: [...questionStates],
                completed: true,
              };
            }
            return round;
          });

          set({ playerRounds: updatedPlayerRounds });
        }

        // Go to game summary (early exit)
        set({
          gameInProgress: false,
          currentScreen: 'game-summary',
        });
      },

      resetGame: () => {
        // Reset game state but keep players and questions
        set({
          ...initialState,
          players: get().players, // Keep players list
          allQuestions: get().allQuestions, // Keep questions loaded
        });
      },

      clearUsedQuestions: () => {
        set({ usedQuestionIds: [] });
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        players: state.players,
        allQuestions: state.allQuestions,
      }),
    }
  )
);
