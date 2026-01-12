/**
 * Storage and Persistence Tests
 *
 * Tests localStorage operations and data persistence:
 * - Initial storage setup
 * - Card and progress loading
 * - Progress saving
 * - Error handling
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  initializeProgress,
  initializeStorage,
  saveProgress
} from '../src/core.js';
import { mockLocalStorage, createTestCards } from './helpers/mocks.js';

describe('Storage - Progress Initialization', () => {
  test('creates progress for all cards', () => {
    const cards = createTestCards(3);
    const progress = initializeProgress(cards);

    assert.strictEqual(Object.keys(progress).length, 3, 'Should create progress for 3 cards');
    assert.ok(progress['1'], 'Should have progress for card 1');
    assert.ok(progress['2'], 'Should have progress for card 2');
    assert.ok(progress['3'], 'Should have progress for card 3');
  });

  test('sets default progress values', () => {
    const cards = [{ id: '1', question: 'Q', answer: 'A' }];
    const progress = initializeProgress(cards);

    assert.strictEqual(progress['1'].interval, 0, 'Initial interval should be 0');
    assert.strictEqual(progress['1'].repetitions, 0, 'Initial repetitions should be 0');
    assert.strictEqual(progress['1'].easeFactor, 2.5, 'Initial ease factor should be 2.5');
    assert.ok(progress['1'].nextReview, 'Should have nextReview timestamp');
  });

  test('sets nextReview to current time', () => {
    const now = Date.now();
    const cards = [{ id: '1', question: 'Q', answer: 'A' }];
    const progress = initializeProgress(cards);

    const tolerance = 100; // 100ms tolerance
    assert.ok(
      Math.abs(progress['1'].nextReview - now) < tolerance,
      'nextReview should be approximately now'
    );
  });

  test('handles empty card array', () => {
    const progress = initializeProgress([]);
    assert.strictEqual(Object.keys(progress).length, 0, 'Should create empty progress object');
  });
});

describe('Storage - localStorage Initialization', () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  test('initializes cards on first load', () => {
    const initialCards = createTestCards(2);
    const { cards } = initializeStorage(initialCards);

    assert.strictEqual(cards.length, 2, 'Should initialize with 2 cards');
    assert.strictEqual(cards[0].id, '1', 'Card IDs should match');
  });

  test('initializes progress on first load', () => {
    const initialCards = createTestCards(2);
    const { progress } = initializeStorage(initialCards);

    assert.ok(progress['1'], 'Should have progress for card 1');
    assert.ok(progress['2'], 'Should have progress for card 2');
    assert.strictEqual(progress['1'].interval, 0, 'Should have default interval');
    assert.strictEqual(progress['1'].easeFactor, 2.5, 'Should have default ease factor');
  });

  test('loads existing cards from localStorage', () => {
    const existingCards = [
      { id: '99', question: 'Existing Q', answer: 'Existing A' }
    ];
    localStorage.setItem('flashcards', JSON.stringify(existingCards));
    localStorage.setItem('progress', JSON.stringify({
      '99': { interval: 5, repetitions: 2, easeFactor: 2.7, nextReview: 123456 }
    }));

    const initialCards = createTestCards(2);
    const { cards, progress } = initializeStorage(initialCards);

    assert.strictEqual(cards.length, 1, 'Should load existing cards');
    assert.strictEqual(cards[0].id, '99', 'Should have existing card ID');
    assert.strictEqual(progress['99'].interval, 5, 'Should load existing progress');
  });

  test('loads existing progress from localStorage', () => {
    const existingCards = createTestCards(1);
    const existingProgress = {
      '1': { interval: 10, repetitions: 3, easeFactor: 2.8, nextReview: 999999 }
    };

    localStorage.setItem('flashcards', JSON.stringify(existingCards));
    localStorage.setItem('progress', JSON.stringify(existingProgress));

    const { progress } = initializeStorage(existingCards);

    assert.strictEqual(progress['1'].interval, 10, 'Should preserve interval');
    assert.strictEqual(progress['1'].repetitions, 3, 'Should preserve repetitions');
    assert.strictEqual(progress['1'].easeFactor, 2.8, 'Should preserve ease factor');
  });

  test('writes to localStorage when initializing', () => {
    const initialCards = createTestCards(1);
    initializeStorage(initialCards);

    const storedCards = localStorage.getItem('flashcards');
    const storedProgress = localStorage.getItem('progress');

    assert.ok(storedCards, 'Should save cards to localStorage');
    assert.ok(storedProgress, 'Should save progress to localStorage');
  });

  test('does not overwrite existing localStorage', () => {
    const existingCards = [{ id: '999', question: 'Keep Me', answer: 'Please' }];
    localStorage.setItem('flashcards', JSON.stringify(existingCards));
    localStorage.setItem('progress', JSON.stringify({
      '999': { interval: 100, repetitions: 10, easeFactor: 3.0, nextReview: 1 }
    }));

    const newCards = createTestCards(5);
    const { cards, progress } = initializeStorage(newCards);

    assert.strictEqual(cards.length, 1, 'Should keep existing cards');
    assert.strictEqual(cards[0].id, '999', 'Should not overwrite with new cards');
    assert.strictEqual(progress['999'].interval, 100, 'Should keep existing progress');
  });
});

describe('Storage - Progress Saving', () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  test('saves progress to localStorage', () => {
    const progress = {
      '1': { interval: 5, repetitions: 2, easeFactor: 2.6, nextReview: 123456 }
    };

    saveProgress(progress);

    const stored = localStorage.getItem('progress');
    assert.ok(stored, 'Should save to localStorage');

    const parsed = JSON.parse(stored);
    assert.strictEqual(parsed['1'].interval, 5, 'Should preserve interval');
    assert.strictEqual(parsed['1'].repetitions, 2, 'Should preserve repetitions');
  });

  test('updates existing progress', () => {
    const initial = {
      '1': { interval: 1, repetitions: 1, easeFactor: 2.5, nextReview: 100 }
    };
    localStorage.setItem('progress', JSON.stringify(initial));

    const updated = {
      '1': { interval: 6, repetitions: 2, easeFactor: 2.6, nextReview: 200 }
    };
    saveProgress(updated);

    const stored = JSON.parse(localStorage.getItem('progress'));
    assert.strictEqual(stored['1'].interval, 6, 'Should update interval');
    assert.strictEqual(stored['1'].repetitions, 2, 'Should update repetitions');
  });

  test('handles multiple cards', () => {
    const progress = {
      '1': { interval: 1, repetitions: 1, easeFactor: 2.5, nextReview: 100 },
      '2': { interval: 6, repetitions: 2, easeFactor: 2.6, nextReview: 200 },
      '3': { interval: 15, repetitions: 3, easeFactor: 2.7, nextReview: 300 }
    };

    saveProgress(progress);

    const stored = JSON.parse(localStorage.getItem('progress'));
    assert.strictEqual(Object.keys(stored).length, 3, 'Should save all cards');
    assert.strictEqual(stored['2'].interval, 6, 'Should preserve card 2 data');
  });
});
