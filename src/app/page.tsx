'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import AvatarSelectScreen from '@/screens/AvatarSelectScreen';
import QuestionScreen from '@/screens/QuestionScreen';
import ResultScreen from '@/screens/ResultScreen';
import ScoreboardScreen from '@/screens/ScoreboardScreen';

export default function Home() {
  const { currentScreen } = useGameStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'avatar-select':
        return <AvatarSelectScreen />;
      case 'question':
        return <QuestionScreen />;
      case 'result':
        return <ResultScreen />;
      case 'leaderboard':
        return <ScoreboardScreen />;
      default:
        return <AvatarSelectScreen />;
    }
  };

  return <main>{renderScreen()}</main>;
}

