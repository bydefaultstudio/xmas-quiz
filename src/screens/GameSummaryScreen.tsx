'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import CheckIcon from '@/components/icons/CheckIcon';
import CrossIcon from '@/components/icons/CrossIcon';
import styles from './GameSummaryScreen.module.css';

export default function GameSummaryScreen() {
  const {
    players,
    playerRounds,
    setCurrentScreen,
  } = useGameStore();
  const { addResult, registerPlayers } = useLeaderboardStore();
  const { addPlayer } = usePlayerStore();

  // Save results to leaderboard when summary is shown
  useEffect(() => {
    // Register all players in both stores
    registerPlayers(players);
    players.forEach((player) => addPlayer(player));

    // Then save results
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
  }, [playerRounds, players, addResult, registerPlayers, addPlayer]);

  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  // Get player data with their rounds
  const playerSummaries = players.map((player) => {
    const round = playerRounds.find((r) => r.playerId === player.id);
    const totalScore = round
      ? round.questionStates.reduce((sum, state) => sum + state.pointsPlayer, 0)
      : 0;
    return {
      player,
      round,
      totalScore,
    };
  });

  // Sort by score descending
  const sortedSummaries = [...playerSummaries].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const getFriendName = (friendId: string | null) => {
    if (!friendId) return null;
    return players.find((p) => p.id === friendId)?.name || null;
  };

  const getHelpDescription = (state: typeof playerRounds[0]['questionStates'][0]) => {
    if (!state.isCorrect) return null;
    
    if (state.usedMultipleChoice && state.usedFriend) {
      const friendName = getFriendName(state.friendId);
      return friendName ? `Multiple Choice + Ask a Friend: ${friendName}` : 'Multiple Choice + Ask a Friend';
    } else if (state.usedMultipleChoice) {
      return 'Multiple Choice';
    } else if (state.usedFriend) {
      const friendName = getFriendName(state.friendId);
      return friendName ? `Ask a Friend: ${friendName}` : 'Ask a Friend';
    } else {
      return 'No Help';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Game Summary</h1>

        <div className={styles.summariesList}>
          {sortedSummaries.map((summary) => {
            const { player, round, totalScore } = summary;
            if (!round || !round.completed) return null;

            return (
              <div key={player.id} className={styles.playerCard}>
                <div className={styles.playerHeader}>
                  <h2 className={styles.playerName}>{player.name}</h2>
                  <div className={styles.totalScore}>
                    Total Score: <span className={styles.scoreValue}>{totalScore} Points</span>
                  </div>
                </div>

                <div className={styles.questionBreakdown}>
                  <h3 className={styles.breakdownTitle}>Question Breakdown</h3>
                  {round.questionStates.map((state, index) => {
                    const question = round.questions[index];
                    const isCorrect = state.isCorrect;
                    const helpDesc = getHelpDescription(state);
                    const friendName = getFriendName(state.friendId);

                    return (
                      <div
                        key={index}
                        className={`${styles.questionItem} ${
                          isCorrect ? styles.correct : styles.wrong
                        }`}
                      >
                        <div className={styles.questionHeader}>
                          <span className={styles.questionNumber}>
                            Question {index + 1}
                          </span>
                          <span className={styles.questionStatus}>
                            {isCorrect ? (
                              <>
                                <CheckIcon size={16} color="currentColor" className={styles.statusIcon} />
                                Correct
                              </>
                            ) : (
                              <>
                                <CrossIcon size={16} color="currentColor" className={styles.statusIcon} />
                                Wrong
                              </>
                            )}
                          </span>
                          <span className={styles.questionPoints}>
                            {state.pointsPlayer} points
                          </span>
                        </div>
                        {isCorrect && helpDesc && (
                          <div className={styles.questionHelp}>
                            {helpDesc}
                          </div>
                        )}
                        {isCorrect && state.usedFriend && state.pointsFriend > 0 && friendName && (
                          <div className={styles.friendNote}>
                            +{state.pointsFriend} point earned with help from {friendName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button className={styles.leaderboardButton} onClick={handleViewLeaderboard}>
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

