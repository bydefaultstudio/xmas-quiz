'use client';

import styles from './ResetConfirmationModal.module.css';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: ResetConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2 className={styles.title}>Are you sure?</h2>

          <p className={styles.warning}>
            This will permanently delete:
          </p>

          <ul className={styles.list}>
            <li>All saved players</li>
            <li>All leaderboard history</li>
            <li>All results from previous games</li>
          </ul>

          <p className={styles.caution}>This cannot be undone.</p>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

