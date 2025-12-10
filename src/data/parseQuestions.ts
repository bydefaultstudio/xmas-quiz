import { Question } from '@/types';

export function parseQuestions(markdownContent: string): Question[] {
  const questions: Question[] = [];
  
  // Split by triple dashes to get individual question blocks
  const blocks = markdownContent.split(/^---$/gm).filter(block => block.trim());
  
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    
    if (lines.length < 3) continue; // Skip if too short
    
    let id = '';
    let category = '';
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    let question = '';
    let answer = '';
    const question_variants: string[] = [];
    const acceptable_answers: string[] = [];
    const multiple_choice: string[] = [];
    const options: string[] = []; // For backwards compatibility with old format
    
    // State tracking for parsing
    let inQuestionVariants = false;
    let inAcceptableAnswers = false;
    let inMultipleChoice = false;
    let inOptions = false; // For old format
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed) continue;
      
      // ID
      if (trimmed.startsWith('id:')) {
        id = trimmed.replace('id:', '').trim();
      }
      // Category
      else if (trimmed.startsWith('category:')) {
        category = trimmed.replace('category:', '').trim();
      }
      // Difficulty
      else if (trimmed.startsWith('difficulty:')) {
        const diff = trimmed.replace('difficulty:', '').trim();
        if (diff === 'easy' || diff === 'medium' || diff === 'hard') {
          difficulty = diff;
        }
      }
      // Old format: question: (for backwards compatibility)
      else if (trimmed.startsWith('question:')) {
        question = trimmed.replace('question:', '').trim().replace(/^["']|["']$/g, '');
      }
      // Answer
      else if (trimmed.startsWith('answer:')) {
        answer = trimmed.replace('answer:', '').trim().replace(/^["']|["']$/g, '');
      }
      // Question variants (new format)
      else if (trimmed === 'question_variants:' || trimmed.startsWith('question_variants:')) {
        inQuestionVariants = true;
        inAcceptableAnswers = false;
        inMultipleChoice = false;
        inOptions = false;
        // Check if there's a value on same line (empty list)
        const rest = trimmed.replace('question_variants:', '').trim();
        if (rest === '[]') {
          inQuestionVariants = false;
        }
      }
      // Acceptable answers (new format)
      else if (trimmed === 'acceptable_answers:' || trimmed.startsWith('acceptable_answers:')) {
        inQuestionVariants = false;
        inAcceptableAnswers = true;
        inMultipleChoice = false;
        inOptions = false;
      }
      // Multiple choice (new format)
      else if (trimmed === 'multiple_choice:' || trimmed.startsWith('multiple_choice:')) {
        inQuestionVariants = false;
        inAcceptableAnswers = false;
        inMultipleChoice = true;
        inOptions = false;
      }
      // Old format: options:
      else if (trimmed === 'options:') {
        inQuestionVariants = false;
        inAcceptableAnswers = false;
        inMultipleChoice = false;
        inOptions = true;
      }
      // List items (starting with -)
      else if (trimmed.startsWith('-')) {
        const value = trimmed.replace(/^-\s*/, '').trim().replace(/^["']|["']$/g, '');
        if (value) {
          if (inQuestionVariants) {
            question_variants.push(value);
          } else if (inAcceptableAnswers) {
            acceptable_answers.push(value);
          } else if (inMultipleChoice) {
            multiple_choice.push(value);
          } else if (inOptions) {
            options.push(value);
          }
        }
      }
      // End of list sections (non-list line after being in a section)
      else if (inQuestionVariants || inAcceptableAnswers || inMultipleChoice || inOptions) {
        // Check if this is a new section
        if (trimmed.includes(':') && !trimmed.startsWith('#')) {
          inQuestionVariants = false;
          inAcceptableAnswers = false;
          inMultipleChoice = false;
          inOptions = false;
          // Re-parse this line as it might be a new section
          i--; // Go back one line to re-parse
        }
      }
    }
    
    // Validation: must have id and answer
    if (!id || !answer) continue;
    
    // Handle question text:
    // - New format: question_variants may be present (even if empty [])
    // - Old format: question field is present
    // - If question_variants is empty and no question field, we need a fallback
    //   (for new format with empty variants, we'll use answer as context for question text)
    let hasQuestionVariantsField = false;
    // Check if we encountered question_variants: in the block (even if empty)
    for (const line of lines) {
      if (line.trim().startsWith('question_variants:')) {
        hasQuestionVariantsField = true;
        break;
      }
    }
    
    // For new format: if question_variants exists (even if empty), don't require question field
    // For old format: require question field
    if (!hasQuestionVariantsField && !question) {
      // Old format requires question field
      continue;
    }
    
    // If question_variants is empty and no question, skip this question
    // (questions with empty variants but no question text cannot be displayed)
    if (hasQuestionVariantsField && question_variants.length === 0 && !question) {
      console.warn(`Question ${id} has empty question_variants but no question text - skipping`);
      continue;
    }
    
    // Determine options/multiple_choice (prefer multiple_choice, fallback to options)
    const finalOptions = multiple_choice.length >= 4 ? multiple_choice : options;
    
    // Validation: must have at least 4 options
    if (finalOptions.length < 4) continue;
    
    // Build question object
    const questionObj: Question = {
      id,
      category: category || 'general',
      difficulty,
      question: question || '', // Will be set to selected variant later if variants exist
      answer,
      options: finalOptions,
    };
    
    // Add new format fields if present (or if field was explicitly set to empty array)
    if (hasQuestionVariantsField) {
      questionObj.question_variants = question_variants.length > 0 ? question_variants : [];
    }
    
    // For backwards compatibility: if we have question but no question_variants field,
    // and no variants array, create an empty array
    if (!hasQuestionVariantsField && question) {
      // Old format - don't set question_variants
    }
    
    if (acceptable_answers.length > 0) {
      questionObj.acceptable_answers = acceptable_answers;
    }
    
    if (multiple_choice.length > 0) {
      questionObj.multiple_choice = multiple_choice;
    }
    
    questions.push(questionObj);
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

export function selectRandomQuestions(
  questions: Question[],
  count: number = 5,
  excludeIds: string[] = []
): Question[] {
  // Filter out already used questions
  const availableQuestions = questions.filter(
    (q) => !excludeIds.includes(q.id)
  );

  // If we don't have enough questions, reset and use all questions
  if (availableQuestions.length < count) {
    const shuffled = shuffleArray(questions);
    return shuffled.slice(0, count).map(selectQuestionVariant);
  }

  // Select from available questions
  const shuffled = shuffleArray(availableQuestions);
  return shuffled.slice(0, count).map(selectQuestionVariant);
}

/**
 * Selects a random question variant and sets it as the question text
 * If no variants exist, uses the existing question text
 */
function selectQuestionVariant(question: Question): Question {
  // If question_variants exists and has items, select a random variant
  if (question.question_variants && question.question_variants.length > 0) {
    const randomVariant = shuffleArray(question.question_variants)[0];
    return {
      ...question,
      question: randomVariant,
      options: shuffleArray(question.options || []), // Shuffle options
    };
  }
  
  // No variants or empty array - use existing question text (or empty string for backwards compatibility)
  return {
    ...question,
    options: shuffleArray(question.options || []), // Shuffle options
  };
}

