'use client';

import { Question } from '@/types';
import styles from './MultiChoiceGrid.module.css';

interface MultiChoiceGridProps {
  question: Question;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  isSubmitted: boolean;
  isCorrect: boolean | null;
}

export default function MultiChoiceGrid({
  question,
  selectedAnswer,
  onSelect,
  isSubmitted,
  isCorrect,
}: MultiChoiceGridProps) {
  const getButtonClass = (option: string) => {
    if (!isSubmitted) {
      return selectedAnswer === option ? styles.selected : styles.option;
    }

    // After submission
    const isSelected = selectedAnswer === option;
    const isCorrectAnswer = option === question.answer;

    if (isCorrectAnswer) {
      return styles.correct;
    }
    if (isSelected && !isCorrect) {
      return styles.wrong;
    }
    return styles.option;
  };

  return (
    <div className={styles.grid}>
      {question.options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const isCorrectAnswer = option === question.answer;
        const showCheckmark = isSubmitted && isCorrectAnswer;
        const showCross = isSubmitted && isSelected && !isCorrect;

        return (
          <button
            key={index}
            className={getButtonClass(option)}
            onClick={() => !isSubmitted && onSelect(option)}
            disabled={isSubmitted}
          >
            <span>{option}</span>
            {showCheckmark && <span className={styles.checkmark}>✓</span>}
            {showCross && <span className={styles.cross}>✗</span>}
          </button>
        );
      })}
    </div>
  );
}

