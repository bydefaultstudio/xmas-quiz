/* eslint-disable react/no-unescaped-entities */
'use client';

import { useGameStore } from '@/store/useGameStore';
import styles from './PlayerTurnScreen.module.css';

export default function PlayerTurnScreen() {
  const { activePlayer, beginPlayerTurn } = useGameStore();

  if (!activePlayer) {
    return <div>Loading...</div>;
  }

  const handleStartTurn = () => {
    beginPlayerTurn();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {activePlayer.name}, it&apos;s your turn!
        </h1>
        <p className={styles.subtitle}>Are you ready?</p>
        <button className={styles.startButton} onClick={handleStartTurn}>
          Yes, let&apos;s go!
        </button>
      </div>
    </div>
  );
}

