/**
 * Card Management Tests
 *
 * Tests card filtering and selection:
 * - Due card filtering
 * - Date-based filtering
 * - Edge cases
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { getDueCards } from '../src/core.js';
import { createTestCards, createTestProgress, mockDate } from './helpers/mocks.js';

describe('Card Management - getDueCards()', () => {
  let restoreDate;

  beforeEach(() => {
    // Fix time to a known timestamp for consistent testing
    restoreDate = mockDate(1609459200000); // 2021-01-01 00:00:00 UTC
  });

  afterEach(() => {
    if (restoreDate) restoreDate();
  });

  test('returns cards with nextReview <= now', () => {
    const cards = createTestCards(3);
    const now = Date.now();
    const progress = createTestProgress(cards, {
      '1': { nextReview: now - 1000 }, // Due (past)
      '2': { nextReview: now },         // Due (now)
      '3': { nextReview: now + 1000 }   // Not due (future)
    });

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards.length, 2, 'Should return 2 due cards');
    assert.ok(dueCards.find(c => c.id === '1'), 'Should include card 1');
    assert.ok(dueCards.find(c => c.id === '2'), 'Should include card 2');
    assert.ok(!dueCards.find(c => c.id === '3'), 'Should not include card 3');
  });

  test('returns empty array when no cards are due', () => {
    const cards = createTestCards(3);
    const now = Date.now();
    const progress = createTestProgress(cards, {
      '1': { nextReview: now + 1000 },
      '2': { nextReview: now + 2000 },
      '3': { nextReview: now + 3000 }
    });

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards.length, 0, 'Should return empty array');
  });

  test('returns all cards when all are due', () => {
    const cards = createTestCards(5);
    const now = Date.now();
    const progress = createTestProgress(cards, {
      '1': { nextReview: now - 5000 },
      '2': { nextReview: now - 4000 },
      '3': { nextReview: now - 3000 },
      '4': { nextReview: now - 2000 },
      '5': { nextReview: now - 1000 }
    });

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards.length, 5, 'Should return all 5 cards');
  });

  test('handles single card correctly', () => {
    const cards = createTestCards(1);
    const now = Date.now();
    const progress = createTestProgress(cards, {
      '1': { nextReview: now - 100 }
    });

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards.length, 1, 'Should return the single due card');
    assert.strictEqual(dueCards[0].id, '1', 'Should be card 1');
  });

  test('handles empty card array', () => {
    const cards = [];
    const progress = {};

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards.length, 0, 'Should return empty array');
  });

  test('filters based on exact timestamp', () => {
    const cards = createTestCards(2);
    const now = 1609459200000; // Fixed timestamp from mock

    const progress = createTestProgress(cards, {
      '1': { nextReview: 1609459200000 },     // Exactly now (due)
      '2': { nextReview: 1609459200001 }      // 1ms in future (not due)
    });

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards.length, 1, 'Should return 1 card (exactly at boundary)');
    assert.strictEqual(dueCards[0].id, '1', 'Should be card 1');
  });

  test('preserves card data structure', () => {
    const cards = [
      { id: '1', question: 'Test Q', answer: 'Test A', custom: 'data' }
    ];
    const now = Date.now();
    const progress = createTestProgress(cards, {
      '1': { nextReview: now - 100 }
    });

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards[0].question, 'Test Q', 'Should preserve question');
    assert.strictEqual(dueCards[0].answer, 'Test A', 'Should preserve answer');
    assert.strictEqual(dueCards[0].custom, 'data', 'Should preserve custom fields');
  });

  test('works with various time differences', () => {
    const cards = createTestCards(4);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const progress = createTestProgress(cards, {
      '1': { nextReview: now - oneDay * 7 },    // 7 days overdue
      '2': { nextReview: now - oneDay },        // 1 day overdue
      '3': { nextReview: now + oneDay },        // Due in 1 day
      '4': { nextReview: now + oneDay * 30 }    // Due in 30 days
    });

    const dueCards = getDueCards(cards, progress);

    assert.strictEqual(dueCards.length, 2, 'Should return 2 overdue cards');
    assert.ok(dueCards.find(c => c.id === '1'), 'Should include 7-day overdue card');
    assert.ok(dueCards.find(c => c.id === '2'), 'Should include 1-day overdue card');
  });
});

// Helper for tests using afterEach
function afterEach(fn) {
  test.after(fn);
}
