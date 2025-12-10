'use client';

import { Question } from '@/types';
import CheckIcon from './icons/CheckIcon';
import CrossIcon from './icons/CrossIcon';
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
            <span className={styles.contentWrapper}>
              <span>{option}</span>
              {showCheckmark && (
                <CheckIcon
                  size={20}
                  color="currentColor"
                  className={styles.checkmark}
                />
              )}
              {showCross && (
                <CrossIcon
                  size={20}
                  color="currentColor"
                  className={styles.cross}
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

