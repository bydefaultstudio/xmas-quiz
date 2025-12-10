import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player } from '@/types';

interface PlayerStore {
  savedPlayers: Player[]; // All players ever created
  nextPlayerNumber: number; // For generating display numbers (#1, #2, etc.)
  addPlayer: (player: Player) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  removePlayer: (playerId: string) => void;
  getPlayerById: (playerId: string) => Player | undefined;
  getAllPlayers: () => Player[];
  getPlayerDisplayNumber: (playerId: string) => number | null;
  generateNewPlayerId: () => string;
  initializePlayerNumber: () => void;
  migrateFromRegistry: (registry: Record<string, string>) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      savedPlayers: [],
      nextPlayerNumber: 1,

      getAllPlayers: () => {
        return get().savedPlayers;
      },

      getPlayerById: (playerId: string) => {
        return get().savedPlayers.find((p) => p.id === playerId);
      },

      getPlayerDisplayNumber: (playerId: string) => {
        const player = get().savedPlayers.find((p) => p.id === playerId);
        return player?.displayNumber || null;
      },

      addPlayer: (player: Player) => {
        set((state) => {
          // Check if player already exists
          const existing = state.savedPlayers.find((p) => p.id === player.id);
          if (existing) {
            // Update existing player but keep their display number
            return state;
          }
          
          // Assign display number and creation timestamp for new players
          const playerWithMetadata: Player = {
            ...player,
            displayNumber: player.displayNumber || state.nextPlayerNumber,
            createdAt: player.createdAt || Date.now(),
          };
          
          const newPlayers = [...state.savedPlayers, playerWithMetadata];
          // Calculate next available display number
          const maxDisplayNumber = Math.max(
            ...newPlayers.map((p) => p.displayNumber || 0),
            0
          );
          
          return {
            savedPlayers: newPlayers,
            nextPlayerNumber: maxDisplayNumber + 1,
          };
        });
      },

      updatePlayer: (playerId: string, updates: Partial<Player>) => {
        set((state) => ({
          savedPlayers: state.savedPlayers.map((p) =>
            p.id === playerId ? { ...p, ...updates } : p
          ),
        }));
      },

      removePlayer: (playerId: string) => {
        set((state) => ({
          savedPlayers: state.savedPlayers.filter((p) => p.id !== playerId),
        }));
      },

      generateNewPlayerId: () => {
        // Generate a stable ID using timestamp
        return `player_${Date.now()}`;
      },

      initializePlayerNumber: () => {
        const { savedPlayers } = get();
        if (savedPlayers.length > 0) {
          // Find the highest display number
          const maxNumber = Math.max(
            ...savedPlayers.map((p) => p.displayNumber || 0),
            0
          );
          set({ nextPlayerNumber: maxNumber + 1 });
        } else {
          set({ nextPlayerNumber: 1 });
        }
      },

      migrateFromRegistry: (registry: Record<string, string>) => {
        set((state) => {
          const existingIds = new Set(state.savedPlayers.map((p) => p.id));
          const newPlayers: Player[] = [];
          let nextNum = state.nextPlayerNumber;

          Object.entries(registry).forEach(([playerId, playerName]) => {
            if (!existingIds.has(playerId)) {
              newPlayers.push({
                id: playerId,
                name: playerName,
                displayNumber: nextNum++,
                createdAt: Date.now(),
              });
            }
          });

          if (newPlayers.length > 0) {
            return {
              savedPlayers: [...state.savedPlayers, ...newPlayers],
              nextPlayerNumber: nextNum,
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'player-storage',
    }
  )
);

