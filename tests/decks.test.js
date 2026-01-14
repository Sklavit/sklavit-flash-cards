/**
 * Tests for deck management functions
 *
 * Tests cover:
 * - Deck creation with validation
 * - Getting decks (all, single, with/without archived)
 * - Updating deck properties
 * - Deleting and archiving decks
 * - Deck statistics calculation
 * - Deck initialization
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  generateId,
  createDeck,
  getAllDecks,
  getDeck,
  updateDeck,
  deleteDeck,
  getDeckStatistics,
  initializeDecks
} from '../src/core.js';
import { mockLocalStorage } from './helpers/mocks.js';

// Helper to match Jest-style expect API
const expect = (value) => ({
  toBe: (expected) => assert.strictEqual(value, expected),
  toEqual: (expected) => assert.deepStrictEqual(value, expected),
  toBeTruthy: () => assert.ok(value),
  toBeFalsy: () => assert.ok(!value),
  toBeNull: () => assert.strictEqual(value, null),
  not: {
    toBe: (expected) => assert.notStrictEqual(value, expected),
    toEqual: (expected) => assert.notDeepStrictEqual(value, expected),
    toBeNull: () => assert.notStrictEqual(value, null),
  },
  toHaveLength: (expected) => assert.strictEqual(value.length, expected),
  toBeGreaterThan: (expected) => assert.ok(value > expected, `Expected ${value} to be greater than ${expected}`),
  toBeGreaterThanOrEqual: (expected) => assert.ok(value >= expected, `Expected ${value} to be greater than or equal to ${expected}`),
  toThrow: (message) => {
    let threw = false;
    let error;
    try {
      value();
    } catch (e) {
      threw = true;
      error = e;
    }
    if (!threw) {
      assert.fail('Expected function to throw');
    }
    if (message && !error.message.includes(message)) {
      assert.fail(`Expected error message to include "${message}", but got "${error.message}"`);
    }
  },
  toBeDefined: () => assert.notStrictEqual(value, undefined),
  toBeUndefined: () => assert.strictEqual(value, undefined),
});

describe('Deck Management', () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });
  });

  describe('createDeck', () => {
    it('should create a deck with valid name', () => {
      const deck = createDeck('Spanish Vocabulary');

      expect(deck.id).toBeTruthy();
      expect(deck.name).toBe('Spanish Vocabulary');
      expect(deck.description).toBe('');
      expect(deck.color).toBe('#6366f1');
      expect(deck.isDefault).toBe(false);
      expect(deck.isArchived).toBe(false);
      expect(deck.createdAt).toBeTruthy();
      expect(deck.updatedAt).toBe(deck.createdAt);
    });

    it('should create a deck with custom description and color', () => {
      const deck = createDeck('Math', 'Algebra problems', '#FF0000');

      expect(deck.name).toBe('Math');
      expect(deck.description).toBe('Algebra problems');
      expect(deck.color).toBe('#FF0000');
    });

    it('should trim whitespace from name and description', () => {
      const deck = createDeck('  Test Deck  ', '  Test Description  ');

      expect(deck.name).toBe('Test Deck');
      expect(deck.description).toBe('Test Description');
    });

    it('should throw error for empty name', () => {
      expect(() => createDeck('')).toThrow('Deck name is required');
      expect(() => createDeck('   ')).toThrow('Deck name is required');
    });

    it('should throw error for name over 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => createDeck(longName)).toThrow('Deck name must be 50 characters or less');
    });

    it('should save deck to localStorage', () => {
      createDeck('Test Deck');
      const decks = JSON.parse(localStorage.getItem('decks'));

      expect(decks).toHaveLength(1);
      expect(decks[0].name).toBe('Test Deck');
    });
  });

  describe('getAllDecks', () => {
    it('should return empty array when no decks exist', () => {
      const decks = getAllDecks();
      expect(decks).toEqual([]);
    });

    it('should return all non-archived decks', () => {
      createDeck('Deck 1');
      createDeck('Deck 2');

      const decks = getAllDecks();
      expect(decks).toHaveLength(2);
      expect(decks[0].name).toBe('Deck 1');
      expect(decks[1].name).toBe('Deck 2');
    });

    it('should exclude archived decks by default', () => {
      const deck1 = createDeck('Deck 1');
      createDeck('Deck 2');
      updateDeck(deck1.id, { isArchived: true });

      const decks = getAllDecks();
      expect(decks).toHaveLength(1);
      expect(decks[0].name).toBe('Deck 2');
    });

    it('should include archived decks when requested', () => {
      const deck1 = createDeck('Deck 1');
      createDeck('Deck 2');
      updateDeck(deck1.id, { isArchived: true });

      const decks = getAllDecks(true);
      expect(decks).toHaveLength(2);
    });
  });

  describe('getDeck', () => {
    it('should return null for non-existent deck', () => {
      const deck = getDeck('fake-id');
      expect(deck).toBeNull();
    });

    it('should return deck by ID', () => {
      const created = createDeck('Test Deck');
      const retrieved = getDeck(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.name).toBe('Test Deck');
    });

    it('should return archived deck', () => {
      const deck = createDeck('Test Deck');
      updateDeck(deck.id, { isArchived: true });

      const retrieved = getDeck(deck.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved.isArchived).toBe(true);
    });
  });

  describe('updateDeck', () => {
    it('should update deck name', () => {
      const deck = createDeck('Old Name');
      const updated = updateDeck(deck.id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.updatedAt).toBeGreaterThanOrEqual(deck.updatedAt);
    });

    it('should update deck description', () => {
      const deck = createDeck('Test');
      const updated = updateDeck(deck.id, { description: 'New description' });

      expect(updated.description).toBe('New description');
    });

    it('should update deck color', () => {
      const deck = createDeck('Test');
      const updated = updateDeck(deck.id, { color: '#00FF00' });

      expect(updated.color).toBe('#00FF00');
    });

    it('should archive deck', () => {
      const deck = createDeck('Test');
      const updated = updateDeck(deck.id, { isArchived: true });

      expect(updated.isArchived).toBe(true);
    });

    it('should return null for non-existent deck', () => {
      const result = updateDeck('fake-id', { name: 'Test' });
      expect(result).toBeNull();
    });

    it('should throw error for empty name', () => {
      const deck = createDeck('Test');
      expect(() => updateDeck(deck.id, { name: '' })).toThrow('Deck name is required');
    });

    it('should throw error for name over 50 characters', () => {
      const deck = createDeck('Test');
      const longName = 'a'.repeat(51);
      expect(() => updateDeck(deck.id, { name: longName })).toThrow('Deck name must be 50 characters or less');
    });

    it('should trim whitespace from name and description', () => {
      const deck = createDeck('Test');
      const updated = updateDeck(deck.id, {
        name: '  New Name  ',
        description: '  New Description  '
      });

      expect(updated.name).toBe('New Name');
      expect(updated.description).toBe('New Description');
    });
  });

  describe('deleteDeck', () => {
    it('should archive deck when archive=true', () => {
      const deck = createDeck('Test');
      const result = deleteDeck(deck.id, true);

      expect(result).toBe(true);

      const retrieved = getDeck(deck.id);
      expect(retrieved.isArchived).toBe(true);

      // Should still exist in storage
      const allDecks = getAllDecks(true);
      expect(allDecks).toHaveLength(1);
    });

    it('should permanently delete deck when archive=false', () => {
      const deck = createDeck('Test');
      const result = deleteDeck(deck.id, false);

      expect(result).toBe(true);

      const retrieved = getDeck(deck.id);
      expect(retrieved).toBeNull();

      const allDecks = getAllDecks(true);
      expect(allDecks).toHaveLength(0);
    });

    it('should delete cards belonging to deleted deck', () => {
      const deck = createDeck('Test');

      // Add cards to deck
      const cards = [
        { id: '1', question: 'Q1', answer: 'A1', deckId: deck.id },
        { id: '2', question: 'Q2', answer: 'A2', deckId: deck.id },
        { id: '3', question: 'Q3', answer: 'A3', deckId: 'other-deck' }
      ];
      localStorage.setItem('flashcards', JSON.stringify(cards));

      deleteDeck(deck.id, false);

      const remainingCards = JSON.parse(localStorage.getItem('flashcards'));
      expect(remainingCards).toHaveLength(1);
      expect(remainingCards[0].id).toBe('3');
    });

    it('should delete progress for cards in deleted deck', () => {
      const deck = createDeck('Test');

      // Add cards and progress
      const cards = [
        { id: '1', question: 'Q1', answer: 'A1', deckId: deck.id },
        { id: '2', question: 'Q2', answer: 'A2', deckId: 'other-deck' }
      ];
      const progress = {
        '1': { interval: 1, repetitions: 1, easeFactor: 2.5, nextReview: Date.now() },
        '2': { interval: 2, repetitions: 2, easeFactor: 2.6, nextReview: Date.now() }
      };
      localStorage.setItem('flashcards', JSON.stringify(cards));
      localStorage.setItem('progress', JSON.stringify(progress));

      deleteDeck(deck.id, false);

      const remainingProgress = JSON.parse(localStorage.getItem('progress'));
      expect(remainingProgress['1']).toBeUndefined();
      expect(remainingProgress['2']).toBeDefined();
    });

    it('should return false for non-existent deck', () => {
      const result = deleteDeck('fake-id', false);
      expect(result).toBe(false);
    });
  });

  describe('getDeckStatistics', () => {
    it('should return zero statistics for empty deck', () => {
      const deck = createDeck('Test');
      const stats = getDeckStatistics(deck.id);

      expect(stats.totalCards).toBe(0);
      expect(stats.dueCards).toBe(0);
      expect(stats.newCards).toBe(0);
      expect(stats.learningCards).toBe(0);
      expect(stats.averageInterval).toBe(0);
      expect(stats.averageEase).toBe('2.50');
    });

    it('should calculate statistics for deck with cards', () => {
      const deck = createDeck('Test');
      const now = Date.now();

      // Add cards
      const cards = [
        { id: '1', question: 'Q1', answer: 'A1', deckId: deck.id },
        { id: '2', question: 'Q2', answer: 'A2', deckId: deck.id },
        { id: '3', question: 'Q3', answer: 'A3', deckId: deck.id }
      ];
      const progress = {
        '1': { interval: 0, repetitions: 0, easeFactor: 2.5, nextReview: now }, // New, due
        '2': { interval: 1, repetitions: 1, easeFactor: 2.6, nextReview: now + 1000000 }, // Learning, not due
        '3': { interval: 6, repetitions: 2, easeFactor: 2.7, nextReview: now } // Learning, due
      };
      localStorage.setItem('flashcards', JSON.stringify(cards));
      localStorage.setItem('progress', JSON.stringify(progress));

      const stats = getDeckStatistics(deck.id);

      expect(stats.totalCards).toBe(3);
      expect(stats.dueCards).toBe(2);
      expect(stats.newCards).toBe(1);
      expect(stats.learningCards).toBe(2);
      expect(stats.averageInterval).toBe(2); // (0 + 1 + 6) / 3 = 2.33 -> 2
      expect(stats.averageEase).toBe('2.60'); // (2.5 + 2.6 + 2.7) / 3 = 2.6
    });

    it('should only include cards from specified deck', () => {
      const deck1 = createDeck('Deck 1');
      const deck2 = createDeck('Deck 2');

      const cards = [
        { id: '1', question: 'Q1', answer: 'A1', deckId: deck1.id },
        { id: '2', question: 'Q2', answer: 'A2', deckId: deck2.id }
      ];
      const progress = {
        '1': { interval: 1, repetitions: 1, easeFactor: 2.5, nextReview: Date.now() },
        '2': { interval: 2, repetitions: 2, easeFactor: 2.6, nextReview: Date.now() }
      };
      localStorage.setItem('flashcards', JSON.stringify(cards));
      localStorage.setItem('progress', JSON.stringify(progress));

      const stats = getDeckStatistics(deck1.id);
      expect(stats.totalCards).toBe(1);
    });
  });

  describe('initializeDecks', () => {
    it('should create default deck if none exist', () => {
      const deck = initializeDecks();

      expect(deck.name).toBe('Sample Deck');
      expect(deck.description).toBe('Sample cards to get you started');
      expect(deck.color).toBe('#6366f1');
      expect(deck.isDefault).toBe(true);
      expect(deck.isArchived).toBe(false);
    });

    it('should return existing default deck if available', () => {
      const defaultDeck = createDeck('Custom Default');
      updateDeck(defaultDeck.id, { isDefault: true });

      const deck = initializeDecks();
      expect(deck.id).toBe(defaultDeck.id);
    });

    it('should return first deck if no default exists', () => {
      const deck1 = createDeck('Deck 1');
      createDeck('Deck 2');

      const deck = initializeDecks();
      expect(deck.id).toBe(deck1.id);
    });

    it('should save default deck to localStorage', () => {
      initializeDecks();

      const decks = JSON.parse(localStorage.getItem('decks'));
      expect(decks).toHaveLength(1);
      expect(decks[0].name).toBe('Sample Deck');
    });
  });
});
