'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import InstructionsModal from '@/components/InstructionsModal';
import SettingsModal from '@/components/SettingsModal';
import Toast from '@/components/Toast';
import { clearAllQuizData } from '@/utils/resetData';
import styles from './StartScreen.module.css';

export default function StartScreen() {
  const { setCurrentScreen } = useGameStore();
  const { results } = useLeaderboardStore();
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasLeaderboardData, setHasLeaderboardData] = useState(false);

  // Check if leaderboard has data
  useEffect(() => {
    setHasLeaderboardData(results.length > 0);
  }, [results.length]);

  const handleStartGame = () => {
    setCurrentScreen('player-setup');
  };

  const handleOpenLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleOpenInstructions = () => {
    setInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
  };

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  const handleReset = () => {
    // Clear all localStorage data
    clearAllQuizData();
    
    // Show toast
    setToastMessage('All data has been reset.');
    
    // Reload after toast is shown to ensure complete reset
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleHideToast = () => {
    setToastMessage(null);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Xmas Quiz</h1>
          <div className={styles.buttonGroup}>
            <button className={styles.startButton} onClick={handleStartGame}>
              Start Game
            </button>
            <button className={styles.button} onClick={handleOpenInstructions}>
              Instructions
            </button>
            <button className={styles.button} onClick={handleOpenSettings}>
              Settings
            </button>
            {hasLeaderboardData && (
              <button className={styles.button} onClick={handleOpenLeaderboard}>
                Leaderboard
              </button>
            )}
          </div>
        </div>
      </div>

      <InstructionsModal isOpen={instructionsOpen} onClose={handleCloseInstructions} />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={handleCloseSettings}
        onReset={handleReset}
      />
      <Toast
        message={toastMessage || ''}
        isVisible={!!toastMessage}
        onHide={handleHideToast}
      />
    </>
  );
}

