# Testing Guide

## Overview

This project uses Node.js built-in test runner (Node 18+) for automated testing with 40 tests across 9 test suites achieving 100% pass rate.

## Running Tests

### Prerequisites
- Node.js 18+ installed

### Commands

**Run all tests:**
```bash
npm test
```

**Watch mode** (re-run on file changes):
```bash
npm run test:watch
```

**With coverage report** (requires c8):
```bash
npm install --save-dev c8  # First time only
npm run test:coverage
```

## Test Structure

### Test Files

- **tests/sm2.test.js** - SM-2 algorithm tests (20 tests)
  - Quality ratings (0, 1, 3, 5)
  - Interval progression
  - Ease factor adjustments
  - Edge cases

- **tests/storage.test.js** - Storage and persistence (13 tests)
  - Progress initialization
  - localStorage operations
  - Data loading/saving

- **tests/cards.test.js** - Card management (8 tests)
  - Due card filtering
  - Date-based selection
  - Edge cases

- **tests/helpers/mocks.js** - Mock implementations
  - `mockLocalStorage()` - Isolated storage mock
  - `mockDate(timestamp)` - Deterministic date mock
  - Test helper functions

### Test Results

```
tests: 40
suites: 9
pass: 40
fail: 0
duration: ~140-160ms
```

## Writing New Tests

When adding new features:

1. **Extract testable logic** to `src/core.js`
   - Keep business logic separate from UI
   - Export functions as ES modules

2. **Create test file** in `tests/{feature}.test.js`
   - Use descriptive test names
   - Group related tests with `describe()`

3. **Use mocks** from `tests/helpers/mocks.js`
   - Mock browser APIs (localStorage, Date)
   - Ensure test isolation

4. **Ensure all tests pass** before committing
   - Run `npm test`
   - Fix any failures immediately

## Test Organization

### File Naming
- Test files: `{feature}.test.js`
- Mock files: `mocks.js`, `{feature}.mock.js`
- Helper files: `helpers/{name}.js`

### Test Structure
```javascript
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Feature - Specific Area', () => {
  test('does something specific', () => {
    // Arrange
    const input = ...;

    // Act
    const result = functionToTest(input);

    // Assert
    assert.strictEqual(result, expected);
  });
});
```

### Best Practices

**Assertions:**
- Use `assert.strictEqual()` for exact matches
- Use `assert.ok()` with tolerance for floating-point comparisons
- Provide clear assertion messages

**Mocking:**
- Mock external dependencies (localStorage, Date, fetch)
- Clean up mocks after tests (use cleanup functions)
- Keep mocks simple and reusable

**Test Isolation:**
- Each test should be independent
- Use `beforeEach()` to set up fresh state
- Don't share state between tests

**Naming:**
- Test names should describe expected behavior
- Use present tense: "returns empty array when no cards are due"
- Be specific: avoid generic names like "test1", "works correctly"

## Debugging Tests

### Running a Single Test File
```bash
node --test tests/sm2.test.js
```

### Running with Debugging
```bash
node --inspect --test tests/sm2.test.js
```

### Common Issues

**Floating-Point Precision:**
```javascript
// ❌ Bad - will fail due to precision
assert.strictEqual(result.easeFactor, 1.7);

// ✅ Good - uses tolerance
assert.ok(Math.abs(result.easeFactor - 1.7) < 0.001);
```

**Date Handling:**
```javascript
// ❌ Bad - non-deterministic
const now = Date.now();

// ✅ Good - use mock
const restoreDate = mockDate(1609459200000);
// ... run tests ...
restoreDate();
```

**Async Tests:**
```javascript
// ✅ Use async/await for async operations
test('async operation', async () => {
  const result = await asyncFunction();
  assert.strictEqual(result, expected);
});
```

## CI/CD Integration

The test suite is designed to work in CI environments:

**GitHub Actions Example:**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm test
```

## Coverage Reports

Install c8 for coverage:
```bash
npm install --save-dev c8
```

Run with coverage:
```bash
npm run test:coverage
```

Current coverage:
- **Core functions**: >95%
- **SM-2 algorithm**: 100%
- **Storage operations**: 100%
- **Card management**: 100%

## Performance

- Full suite runs in ~140-160ms
- Individual test files run in < 50ms
- No external network calls
- All tests run in parallel where possible

## Future Enhancements

See `/planning/future/testing.md` for planned improvements:
- E2E testing with Playwright
- Visual regression tests
- Cross-browser testing
- Performance benchmarks

## Related Documentation

- **Technical Specs**: `/planning/specs/automated_testing.md`
- **Implementation Details**: `/planning/done/automated_testing.md`
- **User Stories**: `/planning/requests/automated_testing.md`
- **Task Breakdown**: `/planning/todo/automated_testing.md`
