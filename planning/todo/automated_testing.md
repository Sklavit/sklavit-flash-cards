# Automated Testing - Implementation Tasks

## Phase 1: Setup Testing Infrastructure

### Task 1.1: Create package.json
- [ ] Create `package.json` in project root
- [ ] Add npm test scripts
- [ ] Set `"type": "module"` for ES modules
- [ ] Add c8 as dev dependency (optional for coverage)

### Task 1.2: Create Test Directory Structure
- [ ] Create `tests/` directory
- [ ] Create `tests/helpers/` subdirectory
- [ ] Create placeholder test files:
  - `tests/sm2.test.js`
  - `tests/storage.test.js`
  - `tests/cards.test.js`
- [ ] Create `tests/helpers/mocks.js`

### Task 1.3: Extract Core Functions
- [ ] Create `src/` directory
- [ ] Create `src/core.js` file
- [ ] Extract `calculateSM2()` function to `src/core.js`
- [ ] Extract `getDueCards()` function to `src/core.js`
- [ ] Export functions as ES modules
- [ ] Update `index.html` to import from `src/core.js`
- [ ] Test that app still works after refactoring

## Phase 2: Implement Mock Helpers

### Task 2.1: Create localStorage Mock
- [ ] Implement `mockLocalStorage()` in `tests/helpers/mocks.js`
- [ ] Support `getItem()`, `setItem()`, `clear()` methods
- [ ] Return isolated storage object per test

### Task 2.2: Create Date Mock
- [ ] Implement `mockDate()` in `tests/helpers/mocks.js`
- [ ] Override `Date.now()` to return fixed timestamp
- [ ] Return cleanup function to restore original Date

## Phase 3: Write SM-2 Algorithm Tests

### Task 3.1: Test Quality 0 (No idea)
- [ ] Test that repetitions reset to 0
- [ ] Test that interval resets to 1
- [ ] Test ease factor adjustment
- [ ] Test nextReview is 1 day from now

### Task 3.2: Test Quality 1 (Mistakes)
- [ ] Test that repetitions reset to 0
- [ ] Test that interval resets to 1
- [ ] Test ease factor adjustment (less penalty than quality 0)
- [ ] Test nextReview is 1 day from now

### Task 3.3: Test Quality 3 (Correct)
- [ ] Test first review: interval = 1, repetitions = 1
- [ ] Test second review: interval = 6, repetitions = 2
- [ ] Test third+ review: interval = previous * easeFactor
- [ ] Test ease factor adjustment (small increase)

### Task 3.4: Test Quality 5 (Easy)
- [ ] Test interval progression (same as quality 3)
- [ ] Test ease factor adjustment (larger increase)
- [ ] Test that easeFactor grows faster than quality 3

### Task 3.5: Test Edge Cases
- [ ] Test ease factor minimum (should not go below 1.3)
- [ ] Test large intervals (10+ reviews)
- [ ] Test transition from quality 0 to quality 5
- [ ] Test rounding of interval to integer

## Phase 4: Write Storage Tests

### Task 4.1: Test Initial Storage Setup
- [ ] Test cards are initialized on first load
- [ ] Test progress is initialized for all cards
- [ ] Test default progress values (interval=0, reps=0, easeFactor=2.5)

### Task 4.2: Test Card Loading
- [ ] Test loading existing cards from localStorage
- [ ] Test loading existing progress from localStorage
- [ ] Test handling of missing localStorage key

### Task 4.3: Test Progress Persistence
- [ ] Test saving progress after review
- [ ] Test loading progress on app restart
- [ ] Test progress updates don't affect other cards

## Phase 5: Write Card Management Tests

### Task 5.1: Test getDueCards()
- [ ] Test returns cards with nextReview <= now
- [ ] Test excludes cards with nextReview > now
- [ ] Test returns empty array when no cards due
- [ ] Test returns all cards when all are due

### Task 5.2: Test Random Card Selection
- [ ] Test that random selection works with multiple due cards
- [ ] Test that selection returns a valid card
- [ ] Test handling of single due card (no randomness needed)

### Task 5.3: Test Progress Counter
- [ ] Test counter updates after each review
- [ ] Test counter shows correct "X / Y" format
- [ ] Test counter resets when all cards reviewed

## Phase 6: Integration and Documentation

### Task 6.1: Run All Tests
- [ ] Execute `npm test` and ensure all tests pass
- [ ] Fix any failing tests
- [ ] Ensure tests run in < 5 seconds

### Task 6.2: Add Test Coverage
- [ ] Run `npm run test:coverage`
- [ ] Verify >80% coverage for core functions
- [ ] Document any uncovered edge cases

### Task 6.3: Update Documentation
- [ ] Update `/planning/in-progress.md` with testing status
- [ ] Update `CLAUDE.md` with testing information
- [ ] Document test running instructions
- [ ] Create entry in `/planning/done/automated_testing.md`

### Task 6.4: Create CI Configuration (Optional)
- [ ] Create `.github/workflows/test.yml`
- [ ] Configure to run tests on PR
- [ ] Set up to block merge on test failure

## Phase 7: Cleanup and Verification

### Task 7.1: Code Review
- [ ] Review all test code for clarity
- [ ] Ensure test names are descriptive
- [ ] Remove any console.log() debugging statements
- [ ] Check that mocks are properly cleaned up

### Task 7.2: Final Verification
- [ ] Run full test suite 3 times (ensure no flaky tests)
- [ ] Verify app still works in browser
- [ ] Test that watch mode works (`npm run test:watch`)
- [ ] Verify tests are fast (< 5 seconds total)

## Dependencies Between Tasks
- Task 1.3 must complete before Phase 3-5 (need extracted functions)
- Phase 2 must complete before Phase 3-5 (need mocks)
- Phase 6 depends on Phase 3-5 completing
- Phase 7 is the final validation phase

## Estimated Effort
- Phase 1: 30 minutes (setup)
- Phase 2: 20 minutes (mocks)
- Phase 3: 60 minutes (SM-2 tests - most critical)
- Phase 4: 30 minutes (storage tests)
- Phase 5: 30 minutes (card tests)
- Phase 6: 30 minutes (integration)
- Phase 7: 20 minutes (cleanup)
- **Total: ~3.5 hours**

## Success Criteria
- ✅ All tests pass consistently
- ✅ Test suite runs in < 5 seconds
- ✅ >80% code coverage for core functions
- ✅ App still works correctly after refactoring
- ✅ Documentation updated
- ✅ Easy to run: `npm test`
