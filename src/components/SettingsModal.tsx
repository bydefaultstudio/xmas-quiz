'use client';

import { useState } from 'react';
import ResetConfirmationModal from './ResetConfirmationModal';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export default function SettingsModal({ isOpen, onClose, onReset }: SettingsModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    onReset();
    setShowConfirm(false);
    onClose();
  };

  const handleCancelReset = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.content}>
            <h2 className={styles.title}>Settings</h2>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Data Management</h3>
              <p className={styles.description}>
                Reset all game data including saved players, leaderboard history, and game results.
              </p>
              <button className={styles.resetButton} onClick={handleResetClick}>
                Reset All Data
              </button>
            </div>

            <div className={styles.actions}>
              <button className={styles.closeButton} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResetConfirmationModal
        isOpen={showConfirm}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </>
  );
}

