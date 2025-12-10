'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { LeaderboardEntry } from '@/types';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import styles from './LeaderboardScreen.module.css';

type SortOption = 'total' | 'average' | 'helper';

export default function LeaderboardScreen() {
  const { players, gameInProgress, setCurrentScreen, startGame, resetGame, clearUsedQuestions } = useGameStore();
  const { getLeaderboard } = useLeaderboardStore();
  const { getPlayerById, getPlayerDisplayNumber } = usePlayerStore();
  const [sortBy, setSortBy] = useState<SortOption>('total');

  const leaderboard = getLeaderboard();
  
  // Detect if accessed from Start Screen (no active game)
  const fromStartScreen = !gameInProgress && players.length === 0;

  const getPlayerName = (playerId: string) => {
    // First try current game players
    const currentPlayer = players.find((p) => p.id === playerId);
    if (currentPlayer) return currentPlayer.name;
    
    // Then try player store
    const savedPlayer = getPlayerById(playerId);
    return savedPlayer?.name || `Player ${playerId}`;
  };

  const getPlayerDisplayInfo = (playerId: string) => {
    const displayNum = getPlayerDisplayNumber(playerId);
    const name = getPlayerName(playerId);
    return { name, displayNum };
  };

  const sortLeaderboard = (entries: LeaderboardEntry[]): LeaderboardEntry[] => {
    const sorted = [...entries];
    
    switch (sortBy) {
      case 'total':
        return sorted.sort((a, b) => b.totalScore - a.totalScore);
      case 'average':
        return sorted.sort((a, b) => b.averageScore - a.averageScore);
      case 'helper':
        return sorted.sort((a, b) => b.helperPointsGiven - a.helperPointsGiven);
      default:
        return sorted;
    }
  };

  const sortedLeaderboard = sortLeaderboard(leaderboard);

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    return new Date(timestamp).toLocaleDateString();
  };

  const handleNewGame = () => {
    // Clear used questions and player rounds for new game
    clearUsedQuestions();
    useGameStore.setState({ playerRounds: [] });
    // Go to player setup to select players for new game
    setCurrentScreen('player-setup');
  };

  const handleEndGame = () => {
    resetGame();
    clearUsedQuestions();
    setCurrentScreen('start');
  };

  const handleBackToStart = () => {
    // Simply navigate back to Start Screen without modifying game state
    setCurrentScreen('start');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          {fromStartScreen && (
            <button className={styles.backButton} onClick={handleBackToStart}>
              <ArrowLeftIcon size={16} color="currentColor" className={styles.backIcon} />
              Back to Start
            </button>
          )}
        </div>

        <div className={styles.sortButtons}>
          <button
            className={`${styles.sortButton} ${sortBy === 'total' ? styles.active : ''}`}
            onClick={() => setSortBy('total')}
          >
            Top Score
          </button>
          <button
            className={`${styles.sortButton} ${sortBy === 'average' ? styles.active : ''}`}
            onClick={() => setSortBy('average')}
          >
            Average Score
          </button>
          <button
            className={`${styles.sortButton} ${sortBy === 'helper' ? styles.active : ''}`}
            onClick={() => setSortBy('helper')}
          >
            Best Helper
          </button>
        </div>

        <div className={styles.leaderboard}>
          {sortedLeaderboard.length === 0 ? (
            <div className={styles.empty}>
              <p>No scores yet. Play a game to see your scores!</p>
            </div>
          ) : (
            sortedLeaderboard.map((entry, index) => {
              const { name: playerName, displayNum } = getPlayerDisplayInfo(entry.playerId);

              return (
                <div key={entry.playerId} className={styles.entry}>
                  <div className={styles.rank}>#{index + 1}</div>
                  <div className={styles.playerInfo}>
                    <h3 className={styles.playerName}>
                      {playerName}
                      {displayNum && <span className={styles.playerNumber}>(#{displayNum})</span>}
                    </h3>
                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Total:</span>
                        <span className={styles.statValue}>{entry.totalScore} pts</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Average:</span>
                        <span className={styles.statValue}>
                          {entry.averageScore.toFixed(1)} pts
                        </span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Games:</span>
                        <span className={styles.statValue}>{entry.gamesPlayed}</span>
                      </div>
                    </div>
                    <div className={styles.helperStats}>
                      <div className={styles.helperStat}>
                        <span>Helper Points Given:</span> {entry.helperPointsGiven}
                      </div>
                      <div className={styles.helperStat}>
                        <span>Helper Points Received:</span> {entry.helperPointsReceived}
                      </div>
                      <div className={styles.helperStat}>
                        <span>Last Played:</span> {formatDate(entry.lastPlayed)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!fromStartScreen && (
          <div className={styles.actions}>
            <button className={styles.newGameButton} onClick={handleNewGame}>
              New Game
            </button>
            <button className={styles.endGameButton} onClick={handleEndGame}>
              End Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

