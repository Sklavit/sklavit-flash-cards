# Automated Testing - User Stories

## Overview
As a developer, I need automated tests to ensure code quality, catch regressions, and maintain confidence when making changes to the application.

## User Stories

### 1. As a Developer
**I want** automated tests for core functionality
**So that** I can catch bugs before they reach users and refactor with confidence

**Acceptance Criteria:**
- Tests run quickly (< 5 seconds for full suite)
- Tests can run in CI/CD pipeline
- Tests cover critical paths: SM-2 algorithm, storage, card management
- Tests are easy to read and maintain
- Test failures provide clear error messages

### 2. As a Developer
**I want** tests for the SM-2 spaced repetition algorithm
**So that** I can ensure scheduling logic is correct and doesn't regress

**Acceptance Criteria:**
- Test all quality ratings (0, 1, 3, 5)
- Test interval progression (1, 6, then exponential)
- Test ease factor adjustments
- Test edge cases (minimum ease factor 1.3)
- Test nextReview date calculation

### 3. As a Developer
**I want** tests for localStorage persistence
**So that** I can ensure data is saved and loaded correctly

**Acceptance Criteria:**
- Test card storage and retrieval
- Test progress storage and retrieval
- Test initialization of new users
- Test data migration scenarios
- Mock localStorage to avoid side effects

### 4. As a Developer
**I want** tests for card management functions
**So that** I can ensure due card selection works correctly

**Acceptance Criteria:**
- Test getDueCards() filters by nextReview date
- Test random card selection from due cards
- Test handling of empty due card list
- Test progress counter updates

### 5. As a Developer
**I want** a simple testing workflow
**So that** I can run tests locally and in CI without complex setup

**Acceptance Criteria:**
- Single command to run all tests: `npm test`
- Tests run in Node.js environment (no browser required)
- No complex build step required
- Test output is readable and informative

## Non-Goals (Out of Scope)
- UI/visual testing (no Playwright/Puppeteer for MVP)
- Integration tests with service worker
- Performance testing
- Load testing
- Cross-browser testing (manual for MVP)

## Success Metrics
- Test coverage > 80% for core functions
- All tests pass consistently
- Test suite runs in < 5 seconds
- Zero false positives/flaky tests
