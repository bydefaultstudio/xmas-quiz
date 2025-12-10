'use client';

import { Player } from '@/types';
import styles from './AskFriendModal.module.css';

interface AskFriendModalProps {
  players: Player[];
  activePlayer: Player | null;
  onSelectFriend: (friend: Player) => void;
  onClose: () => void;
}

export default function AskFriendModal({
  players,
  activePlayer,
  onSelectFriend,
  onClose,
}: AskFriendModalProps) {
  const handleSelect = (friend: Player) => {
    onSelectFriend(friend);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>SELECT PLAYER</h2>
        <div className={styles.playersList}>
          {players
            .filter((p) => p.id !== activePlayer?.id)
            .map((player) => (
              <button
                key={player.id}
                className={styles.playerButton}
                onClick={() => handleSelect(player)}
              >
                {player.name}
              </button>
            ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
