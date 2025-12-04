# Xmas Quiz App

Interactive quiz application built with Next.js, React, and TypeScript.

## Features

- Player avatar selection
- 5-question round system
- Randomised question selection from markdown-based question bank
- Multiple Choice mode
- Ask A Friend mode
- Auto-scoring with four possible score outcomes per question
- Real-time visual feedback (green/red states)
- Leaderboard with persistent score history
- UI transitions matching design specifications

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/src
  /components      # Reusable UI components
  /screens         # Main screen components
  /store           # Zustand state management
  /data            # Data parsers and constants
  /styles          # Global styles
  /types           # TypeScript type definitions

/public
  /images/avatars  # Player avatar images

questrions.md      # Question database
quiz_logic.md      # Game logic specification
```

## Scoring System

| Mode Used               | Player | Friend | Total |
|-------------------------|--------|--------|-------|
| No help                 | 4      | 0      | 4     |
| Multiple Choice only    | 2      | 0      | 2     |
| Ask A Friend only       | 1      | 1      | 2     |
| MC + Ask A Friend       | 1      | 1      | 2     |

Wrong answers always yield 0 points.

## License

Internal project for By Default Studio.

