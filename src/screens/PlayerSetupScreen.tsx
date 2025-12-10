'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { Player } from '@/types';
import styles from './PlayerSetupScreen.module.css';

export default function PlayerSetupScreen() {
  const { players, setPlayers, startGame } = useGameStore();
  const {
    savedPlayers,
    addPlayer,
    updatePlayer,
    getPlayerDisplayNumber,
    generateNewPlayerId,
    initializePlayerNumber,
    migrateFromRegistry,
  } = usePlayerStore();
  const { playerRegistry } = useLeaderboardStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    // Initialize player number counter
    initializePlayerNumber();
    
    // Migrate existing players from leaderboard registry if player store is empty
    if (savedPlayers.length === 0 && Object.keys(playerRegistry).length > 0) {
      migrateFromRegistry(playerRegistry);
    }
  }, [initializePlayerNumber, savedPlayers.length, playerRegistry, migrateFromRegistry]);

  // Get saved players not currently active
  const availableSavedPlayers = savedPlayers.filter(
    (saved) => !players.find((active) => active.id === saved.id)
  );

  const handleSelectSavedPlayer = (savedPlayer: Player) => {
    // Add to active players
    setPlayers([...players, savedPlayer]);
  };

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setEditingName(player.name);
  };

  const handleSave = (playerId: string) => {
    const newName = editingName.trim() || 'Player';
    
    // Update in active players
    const updatedActivePlayers = players.map((p) =>
      p.id === playerId ? { ...p, name: newName } : p
    );
    setPlayers(updatedActivePlayers);

    // Update in saved players registry (updates future entries)
    updatePlayer(playerId, { name: newName });

    setEditingId(null);
    setEditingName('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, playerId: string) => {
    if (e.key === 'Enter') {
      handleSave(playerId);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleAddNewPlayer = () => {
    if (players.length < 10) {
      const newId = generateNewPlayerId();
      const newPlayer: Player = {
        id: newId,
        name: `Player ${players.length + 1}`,
      };

      // Add to saved players registry
      addPlayer(newPlayer);
      
      // Add to active players
      setPlayers([...players, newPlayer]);
    }
  };

  const handleRemoveFromActive = (playerId: string) => {
    // Remove from active players, keep in saved players
    // Allow removing all players - users can build a team from scratch
    const updatedPlayers = players.filter((p) => p.id !== playerId);
    setPlayers(updatedPlayers);
  };

  const handleStartQuiz = () => {
    if (players.length > 0 && players.every((p) => p.name.trim())) {
      // Ensure all active players are in saved players registry
      players.forEach((player) => {
        const existing = savedPlayers.find((p) => p.id === player.id);
        if (!existing) {
          addPlayer(player);
        } else {
          // Update if name changed
          if (existing.name !== player.name) {
            updatePlayer(player.id, { name: player.name });
          }
        }
      });
      
      startGame();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Player Setup</h1>
        <p className={styles.subtitle}>
          Select saved players or add new ones. Add up to 10 players total.
        </p>

        {/* Active Players Section - Always shown first */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Active Players</h2>
          
          {players.length > 0 ? (
            <>
              <div className={styles.playersList}>
                {players.map((player) => {
                  const displayNum = getPlayerDisplayNumber(player.id);
                  return (
                    <div key={player.id} className={styles.playerItem}>
                      {editingId === player.id ? (
                        <div className={styles.editMode}>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, player.id)}
                            className={styles.nameInput}
                            autoFocus
                            placeholder="Player name"
                          />
                          <div className={styles.editActions}>
                            <button
                              className={styles.saveButton}
                              onClick={() => handleSave(player.id)}
                            >
                              Save
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.viewMode}>
                          <span className={styles.playerName}>
                            {player.name}
                            {displayNum && (
                              <span className={styles.playerNumber}>(#{displayNum})</span>
                            )}
                          </span>
                          <div className={styles.actions}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEdit(player)}
                            >
                              Edit
                            </button>
                            <button
                              className={styles.removeButton}
                              onClick={() => handleRemoveFromActive(player.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {players.length < 10 && (
                <button className={styles.addButton} onClick={handleAddNewPlayer}>
                  + Add New Player
                </button>
              )}
            </>
          ) : (
            <button className={styles.addButton} onClick={handleAddNewPlayer}>
              + Add New Player
            </button>
          )}
        </div>

        {/* Saved Players Section - Shown below Active Players */}
        {savedPlayers.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Saved Players</h2>
            <p className={styles.sectionSubtitle}>
              Select a saved player to add them to the active game.
            </p>
            {availableSavedPlayers.length > 0 ? (
              <div className={styles.playersList}>
                {availableSavedPlayers.map((savedPlayer) => {
                  const displayNum = getPlayerDisplayNumber(savedPlayer.id);
                  return (
                    <div key={savedPlayer.id} className={styles.savedPlayerItem}>
                      <span className={styles.playerName}>
                        {savedPlayer.name}
                        {displayNum && <span className={styles.playerNumber}>(#{displayNum})</span>}
                      </span>
                      <button
                        className={styles.selectButton}
                        onClick={() => handleSelectSavedPlayer(savedPlayer)}
                        disabled={players.length >= 10}
                      >
                        Select
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.emptyMessage}>
                All saved players are already in the active game.
              </p>
            )}
          </div>
        )}

        <div className={styles.startSection}>
          <button
            className={styles.startButton}
            onClick={handleStartQuiz}
            disabled={players.length === 0 || !players.every((p) => p.name.trim())}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
