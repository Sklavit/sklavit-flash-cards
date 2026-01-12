/**
 * Flashcard Spaced Repetition - Core Functions
 *
 * These functions implement the core logic for the flashcard app:
 * - SM-2 spaced repetition algorithm
 * - Card management and filtering
 * - Progress tracking
 *
 * See /planning/specs/spaced_repetition.md for algorithm details
 */

/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Calculates the next review interval based on quality of recall.
 * Quality scale:
 * - 0: Complete blackout (No idea)
 * - 1: Incorrect response with correct one seeming familiar (Mistakes)
 * - 3: Correct response with difficulty (Correct)
 * - 5: Perfect response (Easy)
 *
 * @param {Object} cardProgress - Current progress state
 * @param {number} cardProgress.interval - Days until next review
 * @param {number} cardProgress.repetitions - Number of successful reviews
 * @param {number} cardProgress.easeFactor - Multiplier for interval growth
 * @param {number} cardProgress.nextReview - Timestamp of next review
 * @param {number} quality - Quality rating (0, 1, 3, or 5)
 * @returns {Object} Updated progress state
 */
export function calculateSM2(cardProgress, quality) {
  let { interval, repetitions, easeFactor } = cardProgress;

  // Quality < 3: Failed recall, reset progress
  if (quality >= 3) {
    // Successful recall: increase interval
    if (repetitions === 0) {
      interval = 1;  // First review: 1 day
    } else if (repetitions === 1) {
      interval = 6;  // Second review: 6 days
    } else {
      interval = Math.round(interval * easeFactor);  // Exponential growth
    }
    repetitions++;
  } else {
    // Failed recall: restart from beginning
    repetitions = 0;
    interval = 1;
  }

  // Adjust ease factor based on quality
  // Formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Minimum ease factor is 1.3
  if (easeFactor < 1.3) easeFactor = 1.3;

  // Calculate next review timestamp
  const nextReview = Date.now() + (interval * 24 * 60 * 60 * 1000);

  return { interval, repetitions, easeFactor, nextReview };
}

/**
 * Get cards that are due for review
 *
 * @param {Array} cards - All flashcards
 * @param {Object} progress - Progress state for all cards
 * @returns {Array} Cards that need review now
 */
export function getDueCards(cards, progress) {
  const now = Date.now();
  return cards.filter(card => progress[card.id].nextReview <= now);
}

/**
 * Initialize progress for a set of cards
 *
 * @param {Array} cards - Flashcards to initialize
 * @returns {Object} Progress state for all cards
 */
export function initializeProgress(cards) {
  const progress = {};
  cards.forEach(card => {
    progress[card.id] = {
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: Date.now()
    };
  });
  return progress;
}

/**
 * Initialize localStorage with default cards if empty
 *
 * @param {Array} initialCards - Default cards to use if storage is empty
 * @returns {Object} { cards, progress }
 */
export function initializeStorage(initialCards) {
  let cards, progress;

  if (!localStorage.getItem('flashcards')) {
    localStorage.setItem('flashcards', JSON.stringify(initialCards));
    cards = initialCards;
  } else {
    cards = JSON.parse(localStorage.getItem('flashcards'));
  }

  if (!localStorage.getItem('progress')) {
    progress = initializeProgress(initialCards);
    localStorage.setItem('progress', JSON.stringify(progress));
  } else {
    progress = JSON.parse(localStorage.getItem('progress'));
  }

  return { cards, progress };
}

/**
 * Save progress to localStorage
 *
 * @param {Object} progress - Progress state to save
 */
export function saveProgress(progress) {
  localStorage.setItem('progress', JSON.stringify(progress));
}
