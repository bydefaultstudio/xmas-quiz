# Questions Logic Breakdown

## 📋 Overview

This document explains how questions work in the 2025 Quiz app, from storage to gameplay.

---

## 1. Question Storage & Format

### File Location
- **Primary**: `/public/questrions.md`
- **Duplicate**: `/questrions.md` (root)

### Markdown Format
Each question is separated by `---` and follows this structure:

```markdown
---
id: q001
category: tv-film | music | general | science | food | art
difficulty: easy | medium | hard
question: "Question text here?"
answer: "Correct Answer"
options:
  - "Option A"
  - "Option B"
  - "Option C"
  - "Option D"
---
```

### Question Interface (`src/types/index.ts`)
```typescript
interface Question {
  id: string;              // Unique identifier (e.g., "q001")
  category: string;        // tv-film | music | general | science | food | art
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;        // The question text
  answer: string;          // Correct answer
  options: string[];       // Array of 4 options for multiple choice
}
```

---

## 2. Question Parsing

### File: `src/data/parseQuestions.ts`

### `parseQuestions(markdownContent: string): Question[]`
- **Input**: Raw markdown file content
- **Process**:
  1. Splits content by `---` (triple dash) to get question blocks
  2. Parses each block line by line:
     - Extracts `id`, `category`, `difficulty`, `question`, `answer`
     - Collects `options` (lines starting with `-`)
  3. Validates: requires `id`, `question`, `answer`, and at least 4 options
  4. Returns array of `Question` objects

### Loading Process (`src/app/page.tsx`)
1. On app mount, checks if `allQuestions` is empty
2. Fetches `/questrions.md` from public folder
3. Calls `parseQuestions()` to convert markdown → Question[]
4. Stores in Zustand store: `setAllQuestions(questions)`

---

## 3. Question Selection & Randomization

### `selectRandomQuestions(questions, count, excludeIds)`

**Location**: `src/data/parseQuestions.ts`

**Parameters**:
- `questions: Question[]` - Full question pool
- `count: number` - How many to select (default: 5)
- `excludeIds: string[]` - Question IDs to exclude

**Logic**:
1. **Filters out excluded questions**: Removes questions with IDs in `excludeIds`
2. **Checks availability**: 
   - If not enough questions available (after filtering), it **cycles back** and uses all questions
   - Otherwise, selects only from available pool
3. **Randomizes**:
   - Shuffles available questions using Fisher-Yates algorithm
   - Takes first `count` questions
   - **Also shuffles the options array** for each selected question

**Example**:
```typescript
// Pool: 20 questions, usedQuestionIds: [q001, q002, q003]
// Selects 5 random from remaining 17 questions
// If only 3 remaining, cycles back to use all 20 questions
```

### `shuffleArray<T>(array: T[])`
- Fisher-Yates shuffle algorithm
- Used for both question selection and option randomization

---

## 4. Question Tracking (Used Questions System)

### State: `usedQuestionIds: string[]`

**Purpose**: Prevents question repetition during an active game session

**When Questions Are Marked as Used**:
1. **`beginPlayerTurn()`** - When a player starts their round:
   - Selects 5 random questions
   - Adds their IDs to `usedQuestionIds`
   
2. **`startNewRound()`** - When "Play Again" is clicked:
   - Selects new questions (excluding already used)
   - Adds new question IDs to `usedQuestionIds`

**When Questions Are Reset**:
- **`clearUsedQuestions()`** - Explicitly clears the array
- **`resetGame()`** - Resets all game state including used questions
- Called when:
  - "New Player" button is clicked
  - Starting a completely new game session

**Flow Example**:
```
Game Start → usedQuestionIds: []
Player 1 Round 1 → Selects [q001, q002, q003, q004, q005]
                 → usedQuestionIds: [q001, q002, q003, q004, q005]
Player 1 Round 2 (Play Again) → Selects [q006, q007, q008, q009, q010]
                              → usedQuestionIds: [q001...q010]
Player 2 Round 1 → Selects [q006, q007, q008, q009, q010] (same pool!)
                 → usedQuestionIds: [q001...q010] (unchanged)
New Game → clearUsedQuestions() → usedQuestionIds: []
```

**Important Note**: Used questions are **shared across all players** in the same game session. This means:
- If Player 1 uses questions q001-q005, Player 2 won't see them
- When a new game starts, all questions become available again

---

## 5. Question State During Gameplay

### `QuestionState` Interface
```typescript
interface QuestionState {
  questionId: string;        // Links back to Question.id
  selectedAnswer: string | null;
  isCorrect: boolean | null; // null = not answered yet
  usedMultipleChoice: boolean;
  usedFriend: boolean;
  friendId: string | null;   // ID of friend who helped
  pointsPlayer: number;      // Points earned by player
  pointsFriend: number;      // Points earned by friend (if used)
}
```

### State Flow Per Question

1. **Initialization** (`beginPlayerTurn()` or `startNewRound()`):
   ```typescript
   {
     questionId: q.id,
     selectedAnswer: null,
     isCorrect: null,
     usedMultipleChoice: false,
     usedFriend: false,
     friendId: null,
     pointsPlayer: 0,
     pointsFriend: 0
   }
   ```

2. **Player Interaction**:
   - `selectAnswer(answer)` - Sets `selectedAnswer`
   - `toggleMultipleChoice()` - Resets answer, toggles mode
   - `selectFriend(friend)` - Sets `usedFriend: true`, `friendId`

3. **Submission** (`submitAnswer()`):
   - Compares `selectedAnswer` (lowercase, trimmed) with `question.answer`
   - Calculates score using `calculateScore()`
   - Updates state:
     ```typescript
     {
       isCorrect: boolean,
       usedMultipleChoice: multipleChoiceActive,
       usedFriend: !!friendSelected,
       friendId: friendSelected?.id || null,
       pointsPlayer: isCorrect ? calculatedPoints : 0,
       pointsFriend: isCorrect ? friendPoints : 0
     }
     ```

---

## 6. Scoring Logic

### `calculateScore()` in `useGameStore.ts`

**Returns**: `{ player: number, friend: number }`

**Scoring Rules**:

| Mode Used | Player Points | Friend Points | Total |
|-----------|--------------|---------------|-------|
| No help | 4 | 0 | 4 |
| Multiple Choice only | 2 | 0 | 2 |
| Ask A Friend only | 2 | 2 | 4 |
| MC + Ask A Friend | 1 | 1 | 2 |

**Special Case**:
- If `players.length <= 1`: Friend points are always 0 (even if friend is selected)

**Implementation**:
```typescript
if (players.length <= 1) {
  // Single player: no friend points
  return multipleChoiceActive ? { player: 2, friend: 0 } : { player: 4, friend: 0 };
}

if (!multipleChoiceActive && !friendSelected) return { player: 4, friend: 0 };
else if (multipleChoiceActive && !friendSelected) return { player: 2, friend: 0 };
else if (!multipleChoiceActive && friendSelected) return { player: 2, friend: 2 };
else return { player: 1, friend: 1 }; // Both used
```

**Important**: Score is calculated **per question** and only applies if `isCorrect === true`

---

## 7. Game Flow & Question Management

### Multi-Player Round System

#### `PlayerRound` Interface
```typescript
interface PlayerRound {
  playerId: string;
  questions: Question[];           // The 5 questions for this player
  questionStates: QuestionState[]; // The state/results for each question
  completed: boolean;
}
```

#### Flow:

1. **`startGame()`** - Initializes game:
   - Creates `PlayerRound[]` for each player
   - Sets first player as active
   - Navigates to `'player-turn'` screen

2. **`beginPlayerTurn()`** - Starts a player's round:
   - Selects 5 random questions (excluding `usedQuestionIds`)
   - Creates initial `QuestionState[]` for each question
   - Marks questions as used
   - Navigates to `'question'` screen

3. **Question Loop** (5 questions):
   - Player answers question → `submitAnswer()`
   - Auto-advances after 2 seconds → `nextQuestion()`
   - Resets `multipleChoiceActive` and `friendSelected` for next question

4. **`completeCurrentPlayerRound()`** - End of player's round:
   - Saves current round to `playerRounds`
   - Marks round as `completed: true`
   - Checks if all players done:
     - **Yes**: Navigate to `'game-summary'`, set `gameInProgress: false`
     - **No**: Move to next player's `'player-turn'` screen

5. **`endGame()`** - Manual end:
   - Saves current round
   - Sets `gameInProgress: false`
   - Navigates to `'game-summary'`

---

## 8. Answer Validation

### Location: `submitAnswer()` in `useGameStore.ts`

**Process**:
```typescript
const isCorrect = 
  currentState.selectedAnswer.trim().toLowerCase() === 
  currentQuestion.answer.trim().toLowerCase();
```

**Notes**:
- **Case-insensitive** comparison
- **Trimmed** (removes leading/trailing whitespace)
- Exact string match required
- No partial credit
- Wrong answer = 0 points regardless of help used

---

## 9. Current Limitations & Potential Improvements

### 🔍 Current Behavior

1. **Question Pool Management**:
   - If all questions are used, system cycles back to use all questions again
   - No distinction between players - shared used pool per game

2. **Answer Validation**:
   - Exact match only (case-insensitive)
   - No partial matching, synonyms, or typo tolerance

3. **Question Distribution**:
   - Purely random (no difficulty balancing)
   - No category balancing
   - All players in same game share same used questions pool

4. **Storage**:
   - Questions loaded once on mount
   - Cached in Zustand store (persisted)
   - No dynamic reloading

5. **Randomization**:
   - Options are shuffled per question
   - Questions are shuffled per round
   - No seed-based randomization (different every time)

### 💡 Potential Improvements

1. **Balanced Question Selection**:
   - Ensure mix of difficulties per round
   - Balance categories across rounds
   - Per-player used questions (vs shared pool)

2. **Answer Flexibility**:
   - Fuzzy matching for typos
   - Synonym recognition
   - Multiple correct answers support

3. **Question Analytics**:
   - Track which questions are hardest
   - Track most commonly missed
   - Difficulty adjustment based on performance

4. **Custom Question Sets**:
   - Category-specific rounds
   - Difficulty-specific rounds
   - Custom question lists

5. **Better Exhaustion Handling**:
   - When pool exhausted, show notification
   - Option to restart with same questions
   - Option to import more questions

---

## 10. Key Files Reference

| File | Purpose |
|------|---------|
| `src/data/parseQuestions.ts` | Question parsing & selection logic |
| `src/store/useGameStore.ts` | Question state management, game flow |
| `src/types/index.ts` | TypeScript interfaces |
| `public/questrions.md` | Question database (markdown) |
| `src/app/page.tsx` | Question loading on app start |
| `src/screens/QuestionScreen.tsx` | Question display & interaction |

---

## 11. Quick Reference: Key Functions

### Question Selection
```typescript
selectRandomQuestions(questions, 5, usedQuestionIds)
```

### State Management
```typescript
beginPlayerTurn()        // Start new round, select questions
nextQuestion()           // Move to next question
submitAnswer()           // Validate and score
completeCurrentPlayerRound() // Save round, check if all done
```

### Tracking
```typescript
clearUsedQuestions()     // Reset used questions pool
resetGame()              // Reset all game state
```

---

## Questions or Improvements?

What specific aspect would you like to improve? Common requests:
- Better question distribution/balancing
- More flexible answer matching
- Per-player question tracking
- Category/difficulty filtering
- Question analytics
- Custom question sets

