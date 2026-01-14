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
 * @returns {Object} { cards, progress, defaultDeck }
 */
export function initializeStorage(initialCards) {
  let cards, progress;

  // Initialize decks first
  const defaultDeck = initializeDecks();

  // Initialize or migrate cards
  if (!localStorage.getItem('flashcards')) {
    // New installation: Add deckId to initial cards
    const cardsWithDeck = initialCards.map(card => ({
      ...card,
      deckId: defaultDeck.id
    }));
    localStorage.setItem('flashcards', JSON.stringify(cardsWithDeck));
    cards = cardsWithDeck;
  } else {
    // Existing installation: Migrate cards without deckId
    cards = JSON.parse(localStorage.getItem('flashcards'));
    let needsMigration = false;

    cards = cards.map(card => {
      if (!card.deckId) {
        needsMigration = true;
        return { ...card, deckId: defaultDeck.id };
      }
      return card;
    });

    if (needsMigration) {
      localStorage.setItem('flashcards', JSON.stringify(cards));
    }
  }

  // Initialize progress
  if (!localStorage.getItem('progress')) {
    progress = initializeProgress(cards);
    localStorage.setItem('progress', JSON.stringify(progress));
  } else {
    progress = JSON.parse(localStorage.getItem('progress'));

    // Ensure progress exists for all cards
    let needsUpdate = false;
    cards.forEach(card => {
      if (!progress[card.id]) {
        progress[card.id] = {
          interval: 0,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: Date.now()
        };
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      localStorage.setItem('progress', JSON.stringify(progress));
    }
  }

  return { cards, progress, defaultDeck };
}

/**
 * Save progress to localStorage
 *
 * @param {Object} progress - Progress state to save
 */
export function saveProgress(progress) {
  localStorage.setItem('progress', JSON.stringify(progress));
}

/**
 * Generate unique ID for decks and cards
 *
 * @returns {string} Unique identifier
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new deck
 *
 * @param {string} name - Deck name (required, max 50 chars)
 * @param {string} description - Optional description
 * @param {string} color - Optional hex color (e.g., #FF0000)
 * @returns {Object} New deck object
 */
export function createDeck(name, description = '', color = '#6366f1') {
  if (!name || name.trim().length === 0) {
    throw new Error('Deck name is required');
  }
  if (name.length > 50) {
    throw new Error('Deck name must be 50 characters or less');
  }

  const now = Date.now();
  const deck = {
    id: generateId(),
    name: name.trim(),
    description: description.trim(),
    createdAt: now,
    updatedAt: now,
    color: color,
    isDefault: false,
    isArchived: false
  };

  const decks = getAllDecks();
  decks.push(deck);
  localStorage.setItem('decks', JSON.stringify(decks));

  return deck;
}

/**
 * Get all decks
 *
 * @param {boolean} includeArchived - Include archived decks (default: false)
 * @returns {Array} Array of deck objects
 */
export function getAllDecks(includeArchived = false) {
  const decksJson = localStorage.getItem('decks');
  if (!decksJson) {
    return [];
  }

  const decks = JSON.parse(decksJson);
  if (includeArchived) {
    return decks;
  }
  return decks.filter(deck => !deck.isArchived);
}

/**
 * Get a single deck by ID
 *
 * @param {string} deckId - Deck identifier
 * @returns {Object|null} Deck object or null if not found
 */
export function getDeck(deckId) {
  const decks = getAllDecks(true); // Include archived for direct lookups
  return decks.find(deck => deck.id === deckId) || null;
}

/**
 * Update an existing deck
 *
 * @param {string} deckId - Deck identifier
 * @param {Object} updates - Fields to update (name, description, color)
 * @returns {Object|null} Updated deck or null if not found
 */
export function updateDeck(deckId, updates) {
  const decks = getAllDecks(true);
  const deckIndex = decks.findIndex(deck => deck.id === deckId);

  if (deckIndex === -1) {
    return null;
  }

  const deck = decks[deckIndex];

  // Validate name if provided
  if (updates.name !== undefined) {
    if (!updates.name || updates.name.trim().length === 0) {
      throw new Error('Deck name is required');
    }
    if (updates.name.length > 50) {
      throw new Error('Deck name must be 50 characters or less');
    }
    deck.name = updates.name.trim();
  }

  // Update other fields
  if (updates.description !== undefined) {
    deck.description = updates.description.trim();
  }
  if (updates.color !== undefined) {
    deck.color = updates.color;
  }
  if (updates.isArchived !== undefined) {
    deck.isArchived = updates.isArchived;
  }

  deck.updatedAt = Date.now();

  decks[deckIndex] = deck;
  localStorage.setItem('decks', JSON.stringify(decks));

  return deck;
}

/**
 * Delete a deck
 *
 * @param {string} deckId - Deck identifier
 * @param {boolean} archive - If true, archive instead of delete (default: false)
 * @returns {boolean} Success status
 */
export function deleteDeck(deckId, archive = false) {
  if (archive) {
    // Archive the deck
    const result = updateDeck(deckId, { isArchived: true });
    return result !== null;
  } else {
    // Permanently delete deck and its cards
    const decks = getAllDecks(true);
    const deckIndex = decks.findIndex(deck => deck.id === deckId);

    if (deckIndex === -1) {
      return false;
    }

    // Remove deck
    decks.splice(deckIndex, 1);
    localStorage.setItem('decks', JSON.stringify(decks));

    // Remove cards belonging to this deck
    const cards = JSON.parse(localStorage.getItem('flashcards') || '[]');
    const updatedCards = cards.filter(card => card.deckId !== deckId);
    localStorage.setItem('flashcards', JSON.stringify(updatedCards));

    // Remove progress for cards in this deck
    const progress = JSON.parse(localStorage.getItem('progress') || '{}');
    cards.forEach(card => {
      if (card.deckId === deckId) {
        delete progress[card.id];
      }
    });
    localStorage.setItem('progress', JSON.stringify(progress));

    return true;
  }
}

/**
 * Get statistics for a deck
 *
 * @param {string} deckId - Deck identifier
 * @returns {Object} Statistics object
 */
export function getDeckStatistics(deckId) {
  const cards = JSON.parse(localStorage.getItem('flashcards') || '[]')
    .filter(card => card.deckId === deckId);
  const progress = JSON.parse(localStorage.getItem('progress') || '{}');

  const now = Date.now();
  let dueCount = 0;
  let learningCount = 0; // repetitions > 0
  let newCount = 0; // repetitions === 0
  let totalInterval = 0;
  let totalEase = 0;

  cards.forEach(card => {
    const cardProgress = progress[card.id];
    if (!cardProgress) return;

    if (cardProgress.nextReview <= now) {
      dueCount++;
    }

    if (cardProgress.repetitions === 0) {
      newCount++;
    } else {
      learningCount++;
    }

    totalInterval += cardProgress.interval;
    totalEase += cardProgress.easeFactor;
  });

  return {
    totalCards: cards.length,
    dueCards: dueCount,
    newCards: newCount,
    learningCards: learningCount,
    averageInterval: cards.length > 0 ? Math.round(totalInterval / cards.length) : 0,
    averageEase: cards.length > 0 ? (totalEase / cards.length).toFixed(2) : '2.50'
  };
}

/**
 * Initialize decks with a default "Sample" deck
 *
 * @returns {Object} Default deck
 */
export function initializeDecks() {
  const existingDecks = getAllDecks(true);

  if (existingDecks.length === 0) {
    // Create default "Sample" deck
    const deck = {
      id: generateId(),
      name: 'Sample Deck',
      description: 'Sample cards to get you started',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color: '#6366f1',
      isDefault: true,
      isArchived: false
    };

    localStorage.setItem('decks', JSON.stringify([deck]));
    return deck;
  }

  // Return the first deck (or default deck if available)
  return existingDecks.find(d => d.isDefault) || existingDecks[0];
}
