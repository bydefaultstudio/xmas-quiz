'use client';

import { Player } from '@/types';
import AvatarSelector from './AvatarSelector';
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
        <AvatarSelector
          players={players}
          selectedPlayer={null}
          onSelect={handleSelect}
          excludePlayerId={activePlayer?.id}
        />
        <button className={styles.closeButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

