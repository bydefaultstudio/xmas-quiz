# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Verify file structure:
   - `/public/questrions.md` - Question database (already copied)
   - `/public/images/avatars/` - Player avatar images (already copied)
   - `/public/Assets/Fonts/` - Custom fonts (already copied)

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open browser to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
/
├── public/
│   ├── questrions.md          # Question database
│   ├── images/avatars/        # Player avatars
│   └── Assets/Fonts/          # Custom fonts
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # Reusable components
│   │   ├── AvatarSelector.tsx
│   │   ├── MultiChoiceGrid.tsx
│   │   ├── AskFriendModal.tsx
│   │   └── ScoreBadge.tsx
│   ├── screens/               # Main screens
│   │   ├── AvatarSelectScreen.tsx
│   │   ├── QuestionScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── ScoreboardScreen.tsx
│   ├── store/                 # State management
│   │   ├── useGameStore.ts
│   │   └── useLeaderboardStore.ts
│   ├── data/                  # Data parsers
│   │   ├── parseQuestions.ts
│   │   └── players.ts
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── styles/                # Global styles
│       └── globals.css
└── package.json
```

## Features Implemented

✅ Player avatar selection
✅ 5-question round system
✅ Randomised question selection
✅ Multiple Choice mode (2x2 grid)
✅ Ask A Friend mode
✅ Scoring system (exact match to requirements)
✅ Visual feedback (green/red states)
✅ Leaderboard with persistence
✅ Navigation between all screens
✅ Markdown question parsing

## Scoring System

| Mode Used               | Player | Friend | Total |
|-------------------------|--------|--------|-------|
| No help                 | 4      | 0      | 4     |
| Multiple Choice only    | 2      | 0      | 2     |
| Ask A Friend only       | 1      | 1      | 2     |
| MC + Ask A Friend       | 1      | 1      | 2     |

Wrong answers: 0 points

## Troubleshooting

### Questions not loading
- Check that `/public/questrions.md` exists
- Check browser console for errors
- Verify markdown format matches expected structure

### Images not showing
- Verify `/public/images/avatars/` contains all player images
- Check image file names match those in `src/data/players.ts`

### Fonts not loading
- Verify `/public/Assets/Fonts/` structure matches CSS font-face declarations
- Check browser console for font loading errors

## Building for Production

```bash
npm run build
npm start
```

## Notes

- All game state is persisted to localStorage
- Leaderboard data persists across sessions
- Questions are loaded once on app start
- Random question selection ensures no duplicates per round

