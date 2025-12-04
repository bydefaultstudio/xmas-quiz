import { Question } from '@/types';

export function parseQuestions(markdownContent: string): Question[] {
  const questions: Question[] = [];
  
  // Split by triple dashes to get individual question blocks
  const blocks = markdownContent.split(/^---$/gm).filter(block => block.trim());
  
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    
    if (lines.length < 5) continue; // Skip if too short
    
    let id = '';
    let category = '';
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    let question = '';
    let answer = '';
    const options: string[] = [];
    let inOptions = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('id:')) {
        id = trimmed.replace('id:', '').trim();
      } else if (trimmed.startsWith('category:')) {
        category = trimmed.replace('category:', '').trim();
      } else if (trimmed.startsWith('difficulty:')) {
        const diff = trimmed.replace('difficulty:', '').trim();
        if (diff === 'easy' || diff === 'medium' || diff === 'hard') {
          difficulty = diff;
        }
      } else if (trimmed.startsWith('question:')) {
        question = trimmed.replace('question:', '').trim().replace(/^["']|["']$/g, '');
      } else if (trimmed.startsWith('answer:')) {
        answer = trimmed.replace('answer:', '').trim().replace(/^["']|["']$/g, '');
      } else if (trimmed === 'options:') {
        inOptions = true;
      } else if (inOptions && trimmed.startsWith('-')) {
        const option = trimmed.replace(/^-\s*/, '').replace(/^["']|["']$/g, '');
        if (option) options.push(option);
      } else if (inOptions && trimmed && !trimmed.startsWith('#')) {
        // End of options
        inOptions = false;
      }
    }
    
    if (id && question && answer && options.length >= 4) {
      questions.push({
        id,
        category,
        difficulty,
        question,
        answer,
        options,
      });
    }
  }
  
  return questions;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function selectRandomQuestions(questions: Question[], count: number = 5): Question[] {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count).map(q => ({
    ...q,
    options: shuffleArray(q.options), // Shuffle options for each question
  }));
}

