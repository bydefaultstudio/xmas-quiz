'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import CheckIcon from '@/components/icons/CheckIcon';
import CrossIcon from '@/components/icons/CrossIcon';
import styles from './ScoreboardScreen.module.css';

export default function ScoreboardScreen() {
  const {
    players,
    playerRounds,
    setCurrentScreen,
    startGame,
    resetGame,
    clearUsedQuestions,
  } = useGameStore();
  const { addResult } = useLeaderboardStore();

  // Save results to leaderboard when scoreboard is shown
  useEffect(() => {
    playerRounds.forEach((round) => {
      if (round.completed && round.questionStates.length > 0) {
        const totalScore = round.questionStates.reduce(
          (sum, state) => sum + state.pointsPlayer,
          0
        );

        const result = {
          playerId: round.playerId,
          totalScore,
          answers: round.questionStates,
          createdAt: Date.now(),
        };

        addResult(result);
      }
    });
  }, [playerRounds, addResult]);

  const handleNewGame = () => {
    // Clear used questions for a fresh new game
    clearUsedQuestions();
    // Reset player rounds and start new game with existing players
    useGameStore.setState({ playerRounds: [] });
    startGame();
  };

  const handleEndGame = () => {
    // Reset everything - clears players, scores, and returns to start
    resetGame();
    clearUsedQuestions();
    setCurrentScreen('start');
  };

  // Calculate scores for each player
  const playerScores = players.map((player) => {
    const round = playerRounds.find((r) => r.playerId === player.id);
    const totalScore = round
      ? round.questionStates.reduce((sum, state) => sum + state.pointsPlayer, 0)
      : 0;
    return {
      player,
      totalScore,
      round,
    };
  });

  // Sort by score descending
  const sortedScores = [...playerScores].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Scoreboard</h1>

        <div className={styles.scoresList}>
          {sortedScores.map((scoreData, index) => {
            const { player, totalScore, round } = scoreData;
            return (
              <div key={player.id} className={styles.scoreItem}>
                <div className={styles.rank}>#{index + 1}</div>
                <div className={styles.playerInfo}>
                  <h3 className={styles.playerName}>{player.name}</h3>
                  <div className={styles.scoreValue}>{totalScore} points</div>
                  {round && round.completed && (
                    <div className={styles.roundDetails}>
                      {round.questionStates.map((state, qIndex) => (
                        <span
                          key={qIndex}
                          className={`${styles.questionResult} ${
                            state.isCorrect ? styles.correct : styles.wrong
                          }`}
                        >
                          {state.isCorrect ? (
                            <CheckIcon size={14} color="currentColor" />
                          ) : (
                            <CrossIcon size={14} color="currentColor" />
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button className={styles.newGameButton} onClick={handleNewGame}>
            New Game
          </button>
          <button className={styles.endGameButton} onClick={handleEndGame}>
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}
