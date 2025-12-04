'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/useGameStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { PLAYERS } from '@/data/players';
import { selectRandomQuestions } from '@/data/parseQuestions';
import styles from './ResultScreen.module.css';

export default function ResultScreen() {
  const {
    activePlayer,
    questionStates,
    endRound,
    resetGame,
    setCurrentScreen,
    allQuestions,
    startNewRound,
  } = useGameStore();

  const { addResult } = useLeaderboardStore();

  useEffect(() => {
    const result = endRound();
    if (result) {
      addResult(result);
    }
  }, [endRound, addResult]);

  const totalScore = questionStates.reduce((sum, state) => sum + state.pointsPlayer, 0);
  const player = activePlayer ? PLAYERS.find((p) => p.id === activePlayer.id) : null;

  const handlePlayAgain = () => {
    if (allQuestions.length > 0) {
      const randomQuestions = selectRandomQuestions(allQuestions, 5);
      resetGame();
      startNewRound(randomQuestions);
      setCurrentScreen('question');
    }
  };

  const handleNewPlayer = () => {
    resetGame();
    setCurrentScreen('avatar-select');
  };

  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.playerSection}>
          <div className={styles.avatarFrame}>
            <Image
              src={player.avatar}
              alt={player.name}
              width={150}
              height={150}
              className={styles.avatar}
            />
          </div>
          <h1 className={styles.playerName}>{player.name}</h1>
          <div className={styles.score}>
            <span className={styles.scoreLabel}>Total Score</span>
            <span className={styles.scoreValue}>{totalScore} Points</span>
          </div>
        </div>

        <div className={styles.questionsSection}>
          <h2 className={styles.sectionTitle}>Question Breakdown</h2>
          <div className={styles.questionsList}>
            {questionStates.map((state, index) => {
              const question = questionStates[index];
              return (
                <div
                  key={index}
                  className={`${styles.questionItem} ${
                    state.isCorrect ? styles.correct : styles.wrong
                  }`}
                >
                  <div className={styles.questionNumber}>Question {index + 1}</div>
                  <div className={styles.questionResult}>
                    {state.isCorrect ? (
                      <span className={styles.resultText}>✓ Correct</span>
                    ) : (
                      <span className={styles.resultText}>✗ Wrong</span>
                    )}
                    <span className={styles.resultPoints}>
                      {state.pointsPlayer} points
                    </span>
                  </div>
                  {state.usedFriend && (
                    <div className={styles.helperInfo}>
                      Asked friend: +{state.pointsFriend} helper points
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handlePlayAgain}>
            Play Again
          </button>
          <button className={styles.actionButton} onClick={handleNewPlayer}>
            New Player
          </button>
          <button className={styles.actionButton} onClick={handleViewLeaderboard}>
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

