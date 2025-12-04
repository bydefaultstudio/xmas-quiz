import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Question, QuestionState, RoundResult, Screen, GameState } from '@/types';
import { PLAYERS } from '@/data/players';
import { selectRandomQuestions } from '@/data/parseQuestions';

interface QuizStore extends GameState {
  allQuestions: Question[];
  setAllQuestions: (questions: Question[]) => void;
  setActivePlayer: (player: Player) => void;
  setCurrentScreen: (screen: Screen) => void;
  startNewRound: (questions: Question[]) => void;
  selectAnswer: (answer: string) => void;
  toggleMultipleChoice: () => void;
  selectFriend: (friend: Player) => void;
  clearFriend: () => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  calculateScore: () => { player: number; friend: number };
  endRound: () => RoundResult | null;
  resetGame: () => void;
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
  activePlayer: null,
  currentScreen: 'avatar-select',
  currentRound: [],
  currentQuestionIndex: 0,
  questionStates: [],
  friendSelected: null,
  multipleChoiceActive: false,
};

export const useGameStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      allQuestions: [],

      setAllQuestions: (questions) => set({ allQuestions: questions }),

      setActivePlayer: (player) => {
        set({ activePlayer: player, currentScreen: 'question' });
      },

      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      startNewRound: (questions) => {
        const states = questions.map((q) => ({
          ...initialQuestionState,
          questionId: q.id,
        }));
        set({
          currentRound: questions,
          currentQuestionIndex: 0,
          questionStates: states,
          multipleChoiceActive: false,
          friendSelected: null,
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
        const { multipleChoiceActive, currentQuestionIndex, questionStates } = get();
        const newStates = [...questionStates];
        // Clear selected answer when toggling modes
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
        const { currentQuestionIndex, questionStates } = get();
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

        const isCorrect =
          currentState.selectedAnswer.trim().toLowerCase() ===
          currentQuestion.answer.trim().toLowerCase();

        const { player: pointsPlayer, friend: pointsFriend } = get().calculateScore();

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
        const { multipleChoiceActive, friendSelected } = get();

        // Scoring table as per requirements
        if (!multipleChoiceActive && !friendSelected) {
          return { player: 4, friend: 0 };
        } else if (multipleChoiceActive && !friendSelected) {
          return { player: 2, friend: 0 };
        } else if (!multipleChoiceActive && friendSelected) {
          return { player: 1, friend: 1 };
        } else {
          // MC + Ask A Friend
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
        } else {
          set({ currentScreen: 'result' });
        }
      },

      endRound: () => {
        const { activePlayer, questionStates } = get();
        if (!activePlayer) return null;

        const totalScore = questionStates.reduce(
          (sum, state) => sum + state.pointsPlayer,
          0
        );

        return {
          playerId: activePlayer.id,
          totalScore,
          answers: questionStates,
          createdAt: Date.now(),
        };
      },

      resetGame: () => {
        set({
          ...initialState,
          activePlayer: get().activePlayer, // Keep player selected
          currentScreen: 'question',
        });
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        activePlayer: state.activePlayer,
        allQuestions: state.allQuestions,
      }),
    }
  )
);

