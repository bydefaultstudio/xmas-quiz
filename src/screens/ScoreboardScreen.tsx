'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/useGameStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { PLAYERS } from '@/data/players';
import { LeaderboardEntry } from '@/types';
import styles from './ScoreboardScreen.module.css';

type SortOption = 'total' | 'average' | 'helper';

export default function ScoreboardScreen() {
  const { setCurrentScreen } = useGameStore();
  const { getLeaderboard } = useLeaderboardStore();
  const [sortBy, setSortBy] = useState<SortOption>('total');

  const leaderboard = getLeaderboard();

  const getPlayer = (playerId: string) => {
    return PLAYERS.find((p) => p.id === playerId);
  };

  const sortLeaderboard = (entries: LeaderboardEntry[]): LeaderboardEntry[] => {
    const sorted = [...entries];
    
    switch (sortBy) {
      case 'total':
        return sorted.sort((a, b) => b.totalScore - a.totalScore);
      case 'average':
        return sorted.sort((a, b) => b.averageScore - a.averageScore);
      case 'helper':
        return sorted.sort((a, b) => b.helperPointsReceived - a.helperPointsReceived);
      default:
        return sorted;
    }
  };

  const sortedLeaderboard = sortLeaderboard(leaderboard);

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>LEADERBOARD</h1>
        <button
          className={styles.backButton}
          onClick={() => setCurrentScreen('avatar-select')}
        >
          ← Back to Game
        </button>
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
            <p>No scores yet. Play a round to see your scores!</p>
          </div>
        ) : (
          sortedLeaderboard.map((entry, index) => {
            const player = getPlayer(entry.playerId);
            if (!player) return null;

            return (
              <div key={entry.playerId} className={styles.entry}>
                <div className={styles.rank}>#{index + 1}</div>
                <div className={styles.avatarFrame}>
                  <Image
                    src={player.avatar}
                    alt={player.name}
                    width={80}
                    height={80}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.playerInfo}>
                  <h3 className={styles.playerName}>{player.name}</h3>
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
    </div>
  );
}

