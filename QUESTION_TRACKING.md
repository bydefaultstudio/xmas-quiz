# Question Tracking System

## Overview

The quiz app now tracks which questions have been used during an active game session to prevent question repetition. Questions reset when a game session ends.

## How It Works

### During an Active Game Session

1. **Starting a Round:**
   - When a player selects questions for a round, those question IDs are added to `usedQuestionIds`
   - Each subsequent round excludes already-used questions

2. **Playing Multiple Rounds:**
   - Round 1: Questions 1-5 selected → added to `usedQuestionIds`
   - Round 2 (Play Again): Questions 6-10 selected (excluding 1-5) → added to `usedQuestionIds`
   - Round 3: Questions 11-15 selected (excluding 1-10) → added to `usedQuestionIds`
   - And so on...

3. **No Repeats:**
   - Players cannot see the same question twice during their active game session
   - If all questions are used, the system will cycle through remaining available questions

### When a Game Session Ends

Questions are reset (cleared from memory) when:
- Player clicks **"New Player"** button
- Player goes back to **Avatar Selection** screen
- A completely new game session starts

After reset, all questions become available again for the next game session.

## Technical Implementation

### State Management

- `usedQuestionIds: string[]` - Tracks question IDs used in current session
- Stored in game state (not persisted to localStorage)
- Automatically cleared when starting fresh

### Question Selection

```typescript
selectRandomQuestions(questions, count, excludeIds)
```

- Filters out questions with IDs in `excludeIds` array
- Selects random questions from remaining pool
- If not enough questions available, cycles through all questions

### Reset Points

1. **New Player Selected:** `setActivePlayer()` clears `usedQuestionIds`
2. **New Player Button:** `clearUsedQuestions()` explicitly clears the list
3. **Game Reset:** `resetGame()` resets all state including used questions

## User Experience

✅ **Players cannot see duplicate questions** during their active session  
✅ **Multiple rounds** can be played without repeats  
✅ **Fresh start** when beginning a new game session  
✅ **Automatic tracking** - no manual intervention needed  

## Example Flow

```
Player A selects avatar
  → Round 1: Questions q001, q002, q003, q004, q005
  → Views results, clicks "Play Again"
  → Round 2: Questions q006, q007, q008, q009, q010 (q001-005 excluded)
  → Views results, clicks "Play Again"
  → Round 3: Questions q011, q012, q013, q014, q015 (q001-010 excluded)
  → Views results, clicks "New Player"
  → Used questions cleared
  
Player B selects avatar
  → Round 1: Questions q001, q002, q003, q004, q005 (fresh start!)
```

