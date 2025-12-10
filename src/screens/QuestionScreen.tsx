'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import MultiChoiceGrid from '@/components/MultiChoiceGrid';
import AskFriendModal from '@/components/AskFriendModal';
import ScoreBadge from '@/components/ScoreBadge';
import CheckIcon from '@/components/icons/CheckIcon';
import styles from './QuestionScreen.module.css';

export default function QuestionScreen() {
  const [showAskFriend, setShowAskFriend] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');

  const {
    activePlayer,
    players,
    currentRound,
    currentQuestionIndex,
    questionStates,
    multipleChoiceActive,
    friendSelected,
    selectAnswer,
    toggleMultipleChoice,
    selectFriend,
    submitAnswer,
    nextQuestion,
    calculateScore,
    completeCurrentPlayerRound,
    endGame,
    currentPlayerIndex,
  } = useGameStore();

  const currentQuestion = currentRound[currentQuestionIndex];
  const currentState = questionStates[currentQuestionIndex];
  const isSubmitted = currentState?.isCorrect !== null;
  const selectedAnswer = currentState?.selectedAnswer || textAnswer;
  const isLastQuestion = currentQuestionIndex === currentRound.length - 1;

  // Reset text answer when question changes or mode changes
  useEffect(() => {
    if (multipleChoiceActive) {
      setTextAnswer('');
    } else if (currentState?.selectedAnswer && !multipleChoiceActive) {
      setTextAnswer(currentState.selectedAnswer);
    } else if (!currentState?.selectedAnswer) {
      setTextAnswer('');
    }
  }, [currentQuestionIndex, multipleChoiceActive, currentState]);

  const handleTextAnswerChange = (value: string) => {
    setTextAnswer(value);
    if (value.trim()) {
      selectAnswer(value);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || isSubmitted) return;

    if (multipleChoiceActive && !currentState?.selectedAnswer) {
      return;
    }

    if (!multipleChoiceActive && !textAnswer.trim()) {
      return;
    }

    submitAnswer();

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (isLastQuestion) {
        // Round complete - move to next player or scoreboard
        completeCurrentPlayerRound();
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const handleMultipleChoiceToggle = () => {
    if (!isSubmitted) {
      toggleMultipleChoice();
      setTextAnswer('');
      if (currentState?.selectedAnswer) {
        selectAnswer('');
      }
    }
  };

  const { player: potentialPlayerPoints, friend: potentialFriendPoints } =
    calculateScore();
  const totalPotential = potentialPlayerPoints + potentialFriendPoints;

  if (!currentQuestion || !activePlayer) {
    return <div>Loading...</div>;
  }

  const friendPlayer = friendSelected
    ? players.find((p) => p.id === friendSelected.id)
    : null;

  // Filter out active player for Ask A Friend
  const availableFriends = players.filter((p) => p.id !== activePlayer.id);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.headerButton}
          onClick={handleMultipleChoiceToggle}
          disabled={isSubmitted}
        >
          {multipleChoiceActive ? (
            <span className={styles.activeButton}>MULTIPLE CHOICE</span>
          ) : (
            <span>MULTIPLE CHOICE</span>
          )}
        </button>
        <button
          className={styles.headerButton}
          onClick={() => !isSubmitted && setShowAskFriend(true)}
          disabled={isSubmitted}
        >
          ASK A FRIEND
        </button>
        <button
          className={styles.endGameButton}
          onClick={endGame}
        >
          END GAME
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.playerInfo}>
          <h2 className={styles.playerName}>
            {activePlayer.name}
            {friendPlayer && ` + ${friendPlayer.name}`}
          </h2>
          <div className={styles.playerProgress}>
            Player {currentPlayerIndex + 1} of {players.length}
          </div>
        </div>

        <div className={styles.questionCounter}>
          {currentQuestionIndex + 1} OF {currentRound.length}
        </div>

        <div className={styles.questionContent}>
          <h1 className={styles.questionText}>{currentQuestion.question}</h1>

          <ScoreBadge
            points={potentialPlayerPoints}
            friendPoints={potentialFriendPoints}
          />

          {!multipleChoiceActive ? (
            <div className={styles.textInputContainer}>
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => handleTextAnswerChange(e.target.value)}
                placeholder="Type your answer..."
                className={`${styles.textInput} ${
                  isSubmitted
                    ? currentState?.isCorrect
                      ? styles.correct
                      : styles.wrong
                    : ''
                }`}
                disabled={isSubmitted}
                autoFocus
              />
              {isSubmitted && currentState?.isCorrect && (
                <CheckIcon
                  size={20}
                  color="var(--color-white)"
                  className={styles.checkmark}
                />
              )}
              {isSubmitted && !currentState?.isCorrect && (
                <div className={styles.correctAnswer}>
                  Correct answer: {currentQuestion.answer}
                </div>
              )}
            </div>
          ) : (
            <MultiChoiceGrid
              question={currentQuestion}
              selectedAnswer={currentState?.selectedAnswer || null}
              onSelect={selectAnswer}
              isSubmitted={isSubmitted}
              isCorrect={currentState?.isCorrect || null}
            />
          )}

          <button
            className={`${styles.submitButton} ${
              !selectedAnswer || isSubmitted ? styles.disabled : ''
            }`}
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitted}
          >
            SUBMIT
          </button>
        </div>
      </div>

      {showAskFriend && (
        <AskFriendModal
          players={availableFriends}
          activePlayer={activePlayer}
          onSelectFriend={selectFriend}
          onClose={() => setShowAskFriend(false)}
        />
      )}
    </div>
  );
}
