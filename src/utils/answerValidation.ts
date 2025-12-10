/**
 * Normalizes a string for answer comparison:
 * - Converts to lowercase
 * - Removes punctuation
 * - Removes diacritics (accents)
 * - Trims whitespace
 * - Collapses multiple spaces
 */
export function normalizeAnswer(answer: string): string {
  if (!answer) return '';
  
  return answer
    .toLowerCase()
    .normalize('NFD') // Decompose characters (é -> e + ́)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^\w\s]/g, '') // Remove punctuation (keep alphanumeric and spaces)
    .trim()
    .replace(/\s+/g, ' '); // Collapse multiple spaces to single space
}

/**
 * Calculates similarity between two strings using Levenshtein distance
 * Returns a value between 0 and 1, where 1 is identical
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = [];

  // Initialize DP table
  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  const distance = dp[m][n];
  const maxLength = Math.max(m, n);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

/**
 * Calculates similarity between two normalized strings
 * Uses Levenshtein distance algorithm
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeAnswer(str1);
  const normalized2 = normalizeAnswer(str2);
  return levenshteinDistance(normalized1, normalized2);
}

/**
 * Checks if a user's answer is correct using:
 * 1. Normalized exact match against acceptable answers
 * 2. Fuzzy matching against main answer (if exact match fails)
 * 
 * @param userAnswer - The answer provided by the user
 * @param mainAnswer - The main/canonical answer
 * @param acceptableAnswers - Array of acceptable answer variants
 * @param fuzzyThreshold - Similarity threshold for fuzzy matching (default 0.75)
 * @returns true if the answer is correct, false otherwise
 */
export function checkAnswer(
  userAnswer: string,
  mainAnswer: string,
  acceptableAnswers: string[] = [],
  fuzzyThreshold: number = 0.75
): boolean {
  if (!userAnswer || !mainAnswer) return false;

  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  
  // 1. Check exact match against acceptable answers
  const normalizedAcceptableAnswers = acceptableAnswers.map(normalizeAnswer);
  for (const acceptable of normalizedAcceptableAnswers) {
    if (normalizedUserAnswer === acceptable) {
      return true;
    }
  }

  // 2. Check exact match against main answer (normalized)
  const normalizedMainAnswer = normalizeAnswer(mainAnswer);
  if (normalizedUserAnswer === normalizedMainAnswer) {
    return true;
  }

  // 3. Fuzzy matching against main answer only (not acceptable answers)
  const similarity = calculateSimilarity(userAnswer, mainAnswer);
  return similarity > fuzzyThreshold;
}

/**
 * Checks if a multiple choice answer is correct
 * For multiple choice, we use exact matching against all acceptable answers
 * (no fuzzy matching for multiple choice)
 */
export function checkMultipleChoiceAnswer(
  selectedOption: string,
  mainAnswer: string,
  acceptableAnswers: string[] = []
): boolean {
  if (!selectedOption) return false;

  const normalizedSelected = normalizeAnswer(selectedOption);
  const normalizedMainAnswer = normalizeAnswer(mainAnswer);
  
  // Check against main answer
  if (normalizedSelected === normalizedMainAnswer) {
    return true;
  }

  // Check against acceptable answers
  const normalizedAcceptableAnswers = acceptableAnswers.map(normalizeAnswer);
  for (const acceptable of normalizedAcceptableAnswers) {
    if (normalizedSelected === acceptable) {
      return true;
    }
  }

  return false;
}

