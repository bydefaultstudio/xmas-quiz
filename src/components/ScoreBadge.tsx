'use client';

import styles from './ScoreBadge.module.css';

interface ScoreBadgeProps {
  points: number;
  friendPoints?: number;
}

export default function ScoreBadge({ points, friendPoints }: ScoreBadgeProps) {
  const totalPoints = friendPoints && friendPoints > 0 ? points + friendPoints : points;
  const showSplit = friendPoints !== undefined && friendPoints > 0;

  return (
    <div className={styles.badge}>
      <span className={styles.points}>{totalPoints} POINTS</span>
      {showSplit ? (
        <span className={styles.split}>
          ({points} player + {friendPoints} friend)
        </span>
      ) : null}
    </div>
  );
}

