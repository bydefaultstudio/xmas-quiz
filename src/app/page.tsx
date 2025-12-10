'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import StartScreen from '@/screens/StartScreen';
import PlayerSetupScreen from '@/screens/PlayerSetupScreen';
import PlayerTurnScreen from '@/screens/PlayerTurnScreen';
import QuestionScreen from '@/screens/QuestionScreen';
import GameSummaryScreen from '@/screens/GameSummaryScreen';
import LeaderboardScreen from '@/screens/LeaderboardScreen';

export default function Home() {
  const { currentScreen, allQuestions, setAllQuestions } = useGameStore();

  useEffect(() => {
    // Load questions on mount
    if (allQuestions.length === 0) {
      fetch('/questrions.md')
        .then((res) => res.text())
        .then((text) => {
          const { parseQuestions } = require('@/data/parseQuestions');
          const questions = parseQuestions(text);
          setAllQuestions(questions);
        })
        .catch((err) => {
          console.error('Failed to load questions:', err);
        });
    }
  }, [allQuestions.length, setAllQuestions]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen />;
      case 'player-setup':
        return <PlayerSetupScreen />;
      case 'player-turn':
        return <PlayerTurnScreen />;
      case 'question':
        return <QuestionScreen />;
      case 'game-summary':
        return <GameSummaryScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      default:
        return <StartScreen />;
    }
  };

  return <main>{renderScreen()}</main>;
}

