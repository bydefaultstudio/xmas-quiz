'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { PLAYERS } from '@/data/players';
import { selectRandomQuestions, parseQuestions } from '@/data/parseQuestions';
import AvatarSelector from '@/components/AvatarSelector';
import styles from './AvatarSelectScreen.module.css';

export default function AvatarSelectScreen() {
  const { setActivePlayer, setAllQuestions, allQuestions, startNewRound } = useGameStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load questions on mount
    if (allQuestions.length === 0) {
      setLoading(true);
      fetch('/questrions.md')
        .then((res) => res.text())
        .then((text) => {
          const questions = parseQuestions(text);
          setAllQuestions(questions);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load questions:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [allQuestions.length, setAllQuestions]);

  const handleSelectPlayer = (player: typeof PLAYERS[0]) => {
    if (allQuestions.length === 0) {
      alert('Questions are still loading. Please wait...');
      return;
    }
    
    setActivePlayer(player);
    
    // Start a new round with random questions
    const randomQuestions = selectRandomQuestions(allQuestions, 5);
    startNewRound(randomQuestions);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading questions...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SELECT PLAYER</h1>
      <AvatarSelector
        players={PLAYERS}
        selectedPlayer={null}
        onSelect={handleSelectPlayer}
      />
    </div>
  );
}

