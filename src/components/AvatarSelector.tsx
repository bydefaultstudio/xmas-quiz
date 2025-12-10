'use client';

import { Player } from '@/types';
import Image from 'next/image';
import styles from './AvatarSelector.module.css';

interface AvatarSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelect: (player: Player) => void;
  excludePlayerId?: string;
}

export default function AvatarSelector({
  players,
  selectedPlayer,
  onSelect,
  excludePlayerId,
}: AvatarSelectorProps) {
  const filteredPlayers = excludePlayerId
    ? players.filter((p) => p.id !== excludePlayerId)
    : players;

  return (
    <div className={styles.grid}>
      {filteredPlayers.map((player) => {
        const isSelected = selectedPlayer?.id === player.id;
        return (
          <button
            key={player.id}
            className={`${styles.avatarButton} ${isSelected ? styles.selected : ''}`}
            onClick={() => onSelect(player)}
          >
            <div className={styles.avatarFrame}>
              {player.avatar && typeof player.avatar === 'string' ? (
                <Image
                  src={player.avatar as string}
                  alt={player.name}
                  width={120}
                  height={120}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>{player.name.charAt(0).toUpperCase()}</div>
              )}
            </div>
            {isSelected && <p className={styles.name}>{player.name}</p>}
          </button>
        );
      })}
    </div>
  );
}

