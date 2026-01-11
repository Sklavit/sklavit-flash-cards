/**
 * Test Mocks and Helpers
 *
 * Provides mock implementations for browser APIs used in tests
 */

/**
 * Mock localStorage implementation for testing
 *
 * Creates an isolated storage object that mimics localStorage behavior
 * without actually writing to browser storage.
 *
 * @returns {Object} Mock localStorage with getItem, setItem, clear methods
 */
export function mockLocalStorage() {
  const store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
}

/**
 * Mock Date.now() for deterministic testing
 *
 * Overrides the global Date object to return a fixed timestamp.
 * Returns a cleanup function to restore the original Date.
 *
 * @param {number} timestamp - Fixed timestamp to return from Date.now()
 * @returns {Function} Cleanup function to restore original Date
 *
 * @example
 * const restore = mockDate(1609459200000); // 2021-01-01
 * // ... run tests ...
 * restore(); // Restore original Date
 */
export function mockDate(timestamp) {
  const RealDate = Date;

  // Create a new Date class that uses our fixed timestamp
  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(timestamp);
      } else {
        super(...args);
      }
    }

    static now() {
      return timestamp;
    }
  };

  // Return cleanup function
  return () => {
    global.Date = RealDate;
  };
}

/**
 * Create sample flashcards for testing
 *
 * @param {number} count - Number of cards to create
 * @returns {Array} Array of flashcard objects
 */
export function createTestCards(count = 3) {
  const cards = [];
  for (let i = 1; i <= count; i++) {
    cards.push({
      id: String(i),
      question: `Question ${i}`,
      answer: `Answer ${i}`
    });
  }
  return cards;
}

/**
 * Create sample progress data for testing
 *
 * @param {Array} cards - Cards to create progress for
 * @param {Object} overrides - Custom values for specific card IDs
 * @returns {Object} Progress object
 *
 * @example
 * const progress = createTestProgress(cards, {
 *   '1': { nextReview: Date.now() - 1000 } // Card 1 is due
 * });
 */
export function createTestProgress(cards, overrides = {}) {
  const progress = {};
  cards.forEach(card => {
    progress[card.id] = {
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: Date.now(),
      ...overrides[card.id]
    };
  });
  return progress;
}
