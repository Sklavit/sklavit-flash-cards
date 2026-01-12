/**
 * SM-2 Spaced Repetition Algorithm Tests
 *
 * Tests the core SM-2 algorithm implementation to ensure:
 * - Correct interval progression for different quality ratings
 * - Proper ease factor adjustments
 * - Reset behavior on failed recalls
 * - Edge cases (minimum ease factor, large intervals)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateSM2 } from '../src/core.js';

describe('SM-2 Algorithm - Quality 0 (No idea)', () => {
  test('resets repetitions to 0', () => {
    const result = calculateSM2({
      interval: 10,
      repetitions: 5,
      easeFactor: 2.5,
      nextReview: 0
    }, 0);

    assert.strictEqual(result.repetitions, 0, 'Repetitions should reset to 0');
  });

  test('resets interval to 1 day', () => {
    const result = calculateSM2({
      interval: 30,
      repetitions: 10,
      easeFactor: 2.8,
      nextReview: 0
    }, 0);

    assert.strictEqual(result.interval, 1, 'Interval should reset to 1');
  });

  test('decreases ease factor significantly', () => {
    const result = calculateSM2({
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: 0
    }, 0);

    // Quality 0: EF' = 2.5 + (0.1 - (5-0) * (0.08 + (5-0) * 0.02))
    // EF' = 2.5 + (0.1 - 5 * (0.08 + 0.1))
    // EF' = 2.5 + (0.1 - 5 * 0.18) = 2.5 + (0.1 - 0.9) = 2.5 - 0.8 = 1.7
    assert.ok(Math.abs(result.easeFactor - 1.7) < 0.001, 'Ease factor should be ~1.7');
  });

  test('sets nextReview to 1 day from now', () => {
    const now = Date.now();
    const result = calculateSM2({
      interval: 10,
      repetitions: 5,
      easeFactor: 2.5,
      nextReview: 0
    }, 0);

    const expectedNextReview = now + (1 * 24 * 60 * 60 * 1000);
    const tolerance = 100; // 100ms tolerance for test execution time

    assert.ok(
      Math.abs(result.nextReview - expectedNextReview) < tolerance,
      `nextReview should be ~1 day from now (expected ${expectedNextReview}, got ${result.nextReview})`
    );
  });
});

describe('SM-2 Algorithm - Quality 1 (Mistakes)', () => {
  test('resets repetitions to 0', () => {
    const result = calculateSM2({
      interval: 10,
      repetitions: 5,
      easeFactor: 2.5,
      nextReview: 0
    }, 1);

    assert.strictEqual(result.repetitions, 0, 'Repetitions should reset to 0');
  });

  test('resets interval to 1 day', () => {
    const result = calculateSM2({
      interval: 15,
      repetitions: 3,
      easeFactor: 2.5,
      nextReview: 0
    }, 1);

    assert.strictEqual(result.interval, 1, 'Interval should reset to 1');
  });

  test('decreases ease factor (but less than quality 0)', () => {
    const result = calculateSM2({
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: 0
    }, 1);

    // Quality 1: EF' = 2.5 + (0.1 - (5-1) * (0.08 + (5-1) * 0.02))
    // EF' = 2.5 + (0.1 - 4 * (0.08 + 0.08))
    // EF' = 2.5 + (0.1 - 4 * 0.16) = 2.5 + (0.1 - 0.64) = 2.5 - 0.54 = 1.96
    assert.strictEqual(result.easeFactor, 1.96, 'Ease factor should be 1.96');
  });
});

describe('SM-2 Algorithm - Quality 3 (Correct)', () => {
  test('first review: interval = 1, repetitions = 1', () => {
    const result = calculateSM2({
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: 0
    }, 3);

    assert.strictEqual(result.interval, 1, 'First review interval should be 1');
    assert.strictEqual(result.repetitions, 1, 'Repetitions should increase to 1');
  });

  test('second review: interval = 6, repetitions = 2', () => {
    const result = calculateSM2({
      interval: 1,
      repetitions: 1,
      easeFactor: 2.5,
      nextReview: 0
    }, 3);

    assert.strictEqual(result.interval, 6, 'Second review interval should be 6');
    assert.strictEqual(result.repetitions, 2, 'Repetitions should increase to 2');
  });

  test('third review: interval = previous * easeFactor', () => {
    const result = calculateSM2({
      interval: 6,
      repetitions: 2,
      easeFactor: 2.5,
      nextReview: 0
    }, 3);

    // interval = 6 * 2.5 = 15
    assert.strictEqual(result.interval, 15, 'Third review interval should be 6 * 2.5 = 15');
    assert.strictEqual(result.repetitions, 3, 'Repetitions should increase to 3');
  });

  test('adjusts ease factor slightly upward', () => {
    const result = calculateSM2({
      interval: 1,
      repetitions: 1,
      easeFactor: 2.5,
      nextReview: 0
    }, 3);

    // Quality 3: EF' = 2.5 + (0.1 - 2 * (0.08 + 2 * 0.02))
    // EF' = 2.5 + (0.1 - 2 * 0.12) = 2.5 + (0.1 - 0.24) = 2.5 - 0.14 = 2.36
    assert.strictEqual(result.easeFactor, 2.36, 'Ease factor should be 2.36');
  });

  test('rounds interval to nearest integer', () => {
    const result = calculateSM2({
      interval: 7,
      repetitions: 3,
      easeFactor: 2.36,
      nextReview: 0
    }, 3);

    // 7 * 2.36 = 16.52, should round to 17
    assert.strictEqual(result.interval, 17, 'Interval should round to 17');
  });
});

describe('SM-2 Algorithm - Quality 5 (Easy)', () => {
  test('first review: interval = 1, repetitions = 1', () => {
    const result = calculateSM2({
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: 0
    }, 5);

    assert.strictEqual(result.interval, 1, 'First review interval should be 1');
    assert.strictEqual(result.repetitions, 1, 'Repetitions should increase to 1');
  });

  test('increases ease factor more than quality 3', () => {
    const result3 = calculateSM2({
      interval: 1,
      repetitions: 1,
      easeFactor: 2.5,
      nextReview: 0
    }, 3);

    const result5 = calculateSM2({
      interval: 1,
      repetitions: 1,
      easeFactor: 2.5,
      nextReview: 0
    }, 5);

    assert.ok(
      result5.easeFactor > result3.easeFactor,
      `Quality 5 should increase EF more (q5: ${result5.easeFactor}, q3: ${result3.easeFactor})`
    );
  });

  test('calculates correct ease factor for quality 5', () => {
    const result = calculateSM2({
      interval: 1,
      repetitions: 1,
      easeFactor: 2.5,
      nextReview: 0
    }, 5);

    // Quality 5: EF' = 2.5 + (0.1 - 0 * (0.08 + 0 * 0.02))
    // EF' = 2.5 + 0.1 = 2.6
    assert.strictEqual(result.easeFactor, 2.6, 'Ease factor should be 2.6');
  });
});

describe('SM-2 Algorithm - Edge Cases', () => {
  test('ease factor never goes below 1.3', () => {
    let progress = {
      interval: 1,
      repetitions: 1,
      easeFactor: 1.3,
      nextReview: 0
    };

    // Rate as quality 0 multiple times
    progress = calculateSM2(progress, 0);
    progress = calculateSM2(progress, 0);
    progress = calculateSM2(progress, 0);

    assert.strictEqual(progress.easeFactor, 1.3, 'Ease factor should stay at minimum 1.3');
  });

  test('handles large intervals correctly', () => {
    const result = calculateSM2({
      interval: 365,
      repetitions: 10,
      easeFactor: 3.0,
      nextReview: 0
    }, 5);

    // 365 * 3.0 = 1095 days
    assert.strictEqual(result.interval, 1095, 'Should handle large intervals');
  });

  test('transition from failure to success resets properly', () => {
    let progress = {
      interval: 30,
      repetitions: 5,
      easeFactor: 2.8,
      nextReview: 0
    };

    // Fail the card
    progress = calculateSM2(progress, 0);
    assert.strictEqual(progress.repetitions, 0, 'Should reset to 0 reps');
    assert.strictEqual(progress.interval, 1, 'Should reset to interval 1');

    // Review again successfully
    progress = calculateSM2(progress, 3);
    assert.strictEqual(progress.repetitions, 1, 'Should be back at 1 rep');
    assert.strictEqual(progress.interval, 1, 'Should still be interval 1 (first success)');
  });

  test('exponential growth over many successful reviews', () => {
    let progress = {
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: 0
    };

    // Simulate 5 successful reviews at quality 5
    progress = calculateSM2(progress, 5); // interval=1, reps=1, EF=2.6
    progress = calculateSM2(progress, 5); // interval=6, reps=2, EF=2.7
    progress = calculateSM2(progress, 5); // interval=16, reps=3, EF=2.8
    progress = calculateSM2(progress, 5); // interval=45, reps=4, EF=2.9
    progress = calculateSM2(progress, 5); // interval=131, reps=5, EF=3.0

    assert.strictEqual(progress.repetitions, 5, 'Should have 5 repetitions');
    assert.ok(progress.interval > 100, 'Interval should grow exponentially');
    assert.ok(progress.easeFactor > 2.5, 'Ease factor should increase');
  });
});
