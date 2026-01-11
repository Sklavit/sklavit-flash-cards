# Automated Testing - Technical Specification

## Overview
Implement a lightweight testing framework for the flashcard PWA using vanilla JavaScript testing with Node.js test runner (built into Node.js 18+). No external dependencies required for MVP.

## Testing Architecture

### Technology Stack
- **Test Runner**: Node.js built-in `node:test` module (Node 18+)
- **Assertions**: Node.js built-in `node:assert` module
- **Mocking**: Manual localStorage mock implementation
- **Coverage**: Optional `c8` for coverage reports (npm install only)

### File Structure
```
/
├── index.html              # Application code
├── tests/
│   ├── sm2.test.js         # SM-2 algorithm tests
│   ├── storage.test.js     # localStorage persistence tests
│   ├── cards.test.js       # Card management tests
│   └── helpers/
│       └── mocks.js        # localStorage mock
├── src/
│   └── core.js             # Extracted core functions for testing
├── package.json            # npm scripts for testing
└── .github/
    └── workflows/
        └── test.yml        # CI configuration (future)
```

## Implementation Details

### 1. Extract Testable Functions

Move core logic from `index.html` to `src/core.js` for easier testing:

**Functions to Extract:**
```javascript
// src/core.js
export function calculateSM2(cardProgress, quality) { ... }
export function getDueCards(cards, progress) { ... }
export function initializeProgress(cards) { ... }
export function initializeStorage(cards) { ... }
```

**Keep in index.html:**
- DOM manipulation
- Event handlers
- UI rendering
- Service worker registration

### 2. Test Files

#### tests/sm2.test.js
Test the SM-2 algorithm implementation:
```javascript
import { test } from 'node:test';
import assert from 'node:assert';
import { calculateSM2 } from '../src/core.js';

test('SM-2: Quality 0 resets repetitions', () => {
  const result = calculateSM2({
    interval: 10,
    repetitions: 5,
    easeFactor: 2.5,
    nextReview: 0
  }, 0);

  assert.strictEqual(result.repetitions, 0);
  assert.strictEqual(result.interval, 1);
});

// More tests...
```

#### tests/storage.test.js
Test localStorage operations with mocks:
```javascript
import { test, beforeEach } from 'node:test';
import assert from 'node:assert';
import { mockLocalStorage } from './helpers/mocks.js';
import { initializeStorage, loadCards } from '../src/core.js';

beforeEach(() => {
  global.localStorage = mockLocalStorage();
});

test('Storage: Initialize cards on first load', () => {
  // Test implementation
});
```

#### tests/cards.test.js
Test card management:
```javascript
import { test } from 'node:test';
import assert from 'node:assert';
import { getDueCards } from '../src/core.js';

test('Cards: getDueCards returns only due cards', () => {
  const now = Date.now();
  const cards = [
    { id: '1', question: 'Q1', answer: 'A1' },
    { id: '2', question: 'Q2', answer: 'A2' }
  ];
  const progress = {
    '1': { nextReview: now - 1000 }, // Due
    '2': { nextReview: now + 1000 }  // Not due
  };

  const result = getDueCards(cards, progress);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, '1');
});
```

### 3. Mock Helpers

#### tests/helpers/mocks.js
```javascript
export function mockLocalStorage() {
  const store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

export function mockDate(timestamp) {
  const RealDate = Date;
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
  return () => { global.Date = RealDate; };
}
```

### 4. npm Scripts

#### package.json
```json
{
  "name": "flashcard-pwa",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node --test tests/**/*.test.js",
    "test:watch": "node --test --watch tests/**/*.test.js",
    "test:coverage": "c8 node --test tests/**/*.test.js"
  },
  "devDependencies": {
    "c8": "^8.0.1"
  }
}
```

## Test Coverage Goals

### Critical Functions (Must Have 100% Coverage)
- `calculateSM2()` - Core algorithm logic
- `getDueCards()` - Due card filtering
- `initializeProgress()` - Progress initialization

### Important Functions (Target 80%+ Coverage)
- `initializeStorage()` - Storage setup
- Card loading/saving functions

### Lower Priority (Target 50%+ Coverage)
- UI helper functions
- Display formatting

## Testing Workflow

### Local Development
```bash
# Run all tests once
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### CI/CD (Future)
- Run on every pull request
- Block merge if tests fail
- Report coverage to PR comments

## Edge Cases to Test

### SM-2 Algorithm
- Quality 0: Reset to beginning
- Quality 1: Reset to beginning
- Quality 3: First review (interval = 1)
- Quality 3: Second review (interval = 6)
- Quality 3: Third review (interval = easeFactor * previous)
- Quality 5: Same progression but higher ease factor
- Ease factor minimum (1.3)
- Large intervals (test exponential growth)

### Storage
- Empty localStorage (first load)
- Existing cards (subsequent load)
- Corrupted JSON (error handling)
- Missing progress for card (initialize default)

### Card Management
- Empty due card list
- All cards due
- Random selection from multiple due cards
- Single due card

## Performance Considerations
- Mock Date.now() for deterministic tests
- Mock localStorage to avoid I/O
- Keep tests isolated (no shared state)
- Each test < 100ms execution time

## Future Enhancements (Post-MVP)
- E2E tests with Playwright
- Visual regression tests
- Performance benchmarks
- Mutation testing
- CI/CD integration
