import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoundResult, LeaderboardEntry, Player } from '@/types';

interface LeaderboardStore {
  results: RoundResult[];
  playerRegistry: Record<string, string>; // playerId -> playerName (kept for backward compatibility)
  addResult: (result: RoundResult) => void;
  registerPlayers: (players: Player[]) => void;
  getLeaderboard: () => LeaderboardEntry[];
  clearLeaderboard: () => void;
}

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    (set, get) => ({
      results: [],
      playerRegistry: {},

      addResult: (result) => {
        set((state) => ({
          results: [...state.results, result],
        }));
      },

      registerPlayers: (players: Player[]) => {
        set((state) => {
          const updatedRegistry = { ...state.playerRegistry };
          players.forEach((player) => {
            updatedRegistry[player.id] = player.name;
          });
          return { playerRegistry: updatedRegistry };
        });
      },

      getLeaderboard: () => {
        const { results } = get();
        const playerMap = new Map<string, LeaderboardEntry>();

        // Process all results
        results.forEach((result) => {
          if (!playerMap.has(result.playerId)) {
            playerMap.set(result.playerId, {
              playerId: result.playerId,
              totalScore: 0,
              averageScore: 0,
              gamesPlayed: 0,
              helperPointsGiven: 0,
              helperPointsReceived: 0,
              lastPlayed: 0,
            });
          }

          const entry = playerMap.get(result.playerId)!;
          entry.totalScore += result.totalScore;
          entry.gamesPlayed += 1;
          entry.lastPlayed = Math.max(entry.lastPlayed, result.createdAt);

          // Calculate helper points
          result.answers.forEach((answer) => {
            if (answer.usedFriend && answer.isCorrect) {
              entry.helperPointsGiven += answer.pointsFriend;
            }
          });
        });

        // Calculate helper points received
        results.forEach((result) => {
          result.answers.forEach((answer) => {
            if (answer.usedFriend && answer.friendId && answer.isCorrect) {
              if (!playerMap.has(answer.friendId)) {
                playerMap.set(answer.friendId, {
                  playerId: answer.friendId,
                  totalScore: 0,
                  averageScore: 0,
                  gamesPlayed: 0,
                  helperPointsGiven: 0,
                  helperPointsReceived: 0,
                  lastPlayed: 0,
                });
              }
              playerMap.get(answer.friendId)!.helperPointsReceived += answer.pointsFriend;
            }
          });
        });

        // Calculate averages
        playerMap.forEach((entry) => {
          entry.averageScore = entry.gamesPlayed > 0 ? entry.totalScore / entry.gamesPlayed : 0;
        });

        return Array.from(playerMap.values());
      },

      clearLeaderboard: () => {
        set({ results: [] });
      },
    }),
    {
      name: 'leaderboard-storage',
    }
  )
);

