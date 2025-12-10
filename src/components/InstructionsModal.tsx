'use client';

import styles from './InstructionsModal.module.css';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2 className={styles.title}>How to Play</h2>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>How the game works</h3>
            <ul className={styles.list}>
              <li>Choose players before starting a round.</li>
              <li>Each player gets 5 questions per round.</li>
              <li>Questions can be typed answers or multiple choice depending on the player's choice.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Scoring</h3>
            <ul className={styles.list}>
              <li>
                <strong>If answered normally:</strong> 4 points
              </li>
              <li>
                <strong>If "Multiple Choice" is used:</strong> 2 points
              </li>
              <li>
                <strong>If "Ask a Friend" is used:</strong>
                <ul className={styles.sublist}>
                  <li>Player gets 2 points</li>
                  <li>The chosen friend gets 2 helper points</li>
                </ul>
              </li>
              <li>
                <strong>If BOTH MC + Ask a Friend are used:</strong>
                <ul className={styles.sublist}>
                  <li>Player gets 1 point</li>
                  <li>Friend gets 1 helper point</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Question Types</h3>
            <ul className={styles.list}>
              <li>Easy</li>
              <li>Medium</li>
              <li>Hard</li>
            </ul>
            <p className={styles.note}>(They appear in random order)</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Player Turn Flow</h3>
            <ul className={styles.list}>
              <li>Each player gets 5 questions</li>
              <li>After a player finishes, the Player Turn Screen appears for the next player</li>
              <li>After all players complete their turn, the Game Summary Screen appears</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Leaderboards</h3>
            <p className={styles.paragraph}>Tracks:</p>
            <ul className={styles.list}>
              <li>Lifetime total points</li>
              <li>Average score</li>
              <li>Number of games</li>
              <li>Helper Points Given</li>
              <li>Helper Points Received</li>
            </ul>
            <p className={styles.paragraph}>Sort modes:</p>
            <ul className={styles.list}>
              <li>Top Score</li>
              <li>Average Score</li>
              <li>Best Helper</li>
            </ul>
          </section>

          <div className={styles.actions}>
            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

