'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/useGameStore';
import { PLAYERS } from '@/data/players';
import MultiChoiceGrid from '@/components/MultiChoiceGrid';
import AskFriendModal from '@/components/AskFriendModal';
import ScoreBadge from '@/components/ScoreBadge';
import styles from './QuestionScreen.module.css';

export default function QuestionScreen() {
  const [showAskFriend, setShowAskFriend] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');

  const {
    activePlayer,
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
    setCurrentScreen,
    calculateScore,
  } = useGameStore();

  const currentQuestion = currentRound[currentQuestionIndex];
  const currentState = questionStates[currentQuestionIndex];
  const isSubmitted = currentState?.isCorrect !== null;
  const selectedAnswer = currentState?.selectedAnswer || textAnswer;

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
      return; // Need to select an option
    }
    
    if (!multipleChoiceActive && !textAnswer.trim()) {
      return; // Need text answer
    }

    submitAnswer();
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleMultipleChoiceToggle = () => {
    if (!isSubmitted) {
      toggleMultipleChoice();
      setTextAnswer(''); // Clear text when switching to MC
      // Clear selected answer when toggling
      if (currentState?.selectedAnswer) {
        selectAnswer('');
      }
    }
  };

  const { player: potentialPlayerPoints, friend: potentialFriendPoints } = calculateScore();
  const totalPotential = potentialPlayerPoints + potentialFriendPoints;

  if (!currentQuestion || !activePlayer) {
    return <div>Loading...</div>;
  }

  const friendPlayer = friendSelected;

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
          className={styles.headerButton}
          onClick={() => setCurrentScreen('leaderboard')}
        >
          SCOREBOARD
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.playerInfo}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarFrame}>
              <Image
                src={activePlayer.avatar}
                alt={activePlayer.name}
                width={100}
                height={100}
                className={styles.avatar}
              />
            </div>
            {friendPlayer && (
              <div className={styles.avatarFrame}>
                <Image
                  src={friendPlayer.avatar}
                  alt={friendPlayer.name}
                  width={100}
                  height={100}
                  className={styles.avatar}
                />
              </div>
            )}
          </div>
          <h2 className={styles.playerName}>
            {activePlayer.name}
            {friendPlayer && ` + ${friendPlayer.name}`}
          </h2>
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
                <span className={styles.checkmark}>✓</span>
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
          players={PLAYERS}
          activePlayer={activePlayer}
          onSelectFriend={selectFriend}
          onClose={() => setShowAskFriend(false)}
        />
      )}
    </div>
  );
}

