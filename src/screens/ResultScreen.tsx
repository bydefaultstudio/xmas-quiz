'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/useGameStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { PLAYERS } from '@/data/players';
import { selectRandomQuestions } from '@/data/parseQuestions';
import CheckIcon from '@/components/icons/CheckIcon';
import CrossIcon from '@/components/icons/CrossIcon';
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
    usedQuestionIds,
    clearUsedQuestions,
  } = useGameStore();

  const { addResult } = useLeaderboardStore();

  useEffect(() => {
    const result = endRound();
    if (result) {
      addResult(result);
      // Don't clear used questions here - keep them for "Play Again"
      // They'll be cleared when starting a new game session (new player)
    }
  }, [endRound, addResult]);

  const totalScore = questionStates.reduce((sum, state) => sum + state.pointsPlayer, 0);
  const player = activePlayer ? PLAYERS.find((p) => p.id === activePlayer.id) : null;

  const handlePlayAgain = () => {
    if (allQuestions.length > 0) {
      // Select new questions excluding already used ones during this active game
      const randomQuestions = selectRandomQuestions(allQuestions, 5, usedQuestionIds);
      resetGame();
      startNewRound(randomQuestions);
      setCurrentScreen('question');
    }
  };

  const handleNewPlayer = () => {
    // Clear used questions when starting a new game session
    clearUsedQuestions();
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
            {player.avatar ? (
              <Image
                src={player.avatar}
                alt={player.name}
                width={150}
                height={150}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>{player.name.charAt(0).toUpperCase()}</div>
            )}
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
                      <span className={styles.resultText}>
                        <CheckIcon size={16} color="currentColor" className={styles.icon} />
                        Correct
                      </span>
                    ) : (
                      <span className={styles.resultText}>
                        <CrossIcon size={16} color="currentColor" className={styles.icon} />
                        Wrong
                      </span>
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

