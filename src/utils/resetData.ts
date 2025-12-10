/**
 * Utility function to clear all localStorage data related to the quiz app
 * This includes all Zustand stores and any other stored data
 */
export function clearAllQuizData() {
  // Clear all Zustand store localStorage keys
  const storageKeys = [
    'quiz-storage', // useGameStore
    'leaderboard-storage', // useLeaderboardStore
    'player-storage', // usePlayerStore
  ];

  storageKeys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to clear ${key}:`, error);
    }
  });

  // Clear any other potential storage keys
  // This catches any edge cases or future storage keys
  try {
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (key.includes('quiz') || key.includes('leaderboard') || key.includes('player')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing additional storage keys:', error);
  }
}

