# Flashcard Spaced Repetition PWA - Technical Documentation

> **⚠️ IMPORTANT**: This file provides high-level guidance and references. Keep detailed implementation specifics, test details, user guides, and API documentation in `/planning/` directory. This file should remain concise and navigational.

## Project Overview

This is a Progressive Web App (PWA) for learning with textual flashcards using an efficient spaced repetition algorithm (SM-2). The app allows users to create and manage decks of cards, track learning progress, and study with optimal scheduling. Fully offline-capable with optional LLM-powered card generation.

## Quick Links

- **User Guide**: [How to run the app on iOS, macOS, etc.](/planning/user-guide.md)
- **Testing Guide**: [How to run tests and write new ones](/planning/testing-guide.md)
- **Development Plans**: See `/planning/in-progress.md` for current work

## Planning Directory

The `/planning` directory contains structured documentation for development and decision-making:

```
/planning
├── in-progress.md                   # Current sprint tasks and priorities
├── user-guide.md                    # How to run the app (iOS, macOS, etc.)
├── testing-guide.md                 # How to run tests and write new ones
├── done/                            # Completed features (implementation docs)
│   ├── spaced_repetition.md         # ✅ Implemented (2026-01-11)
│   ├── automated_testing.md         # ✅ Implemented (2026-01-11)
│   └── card_management_dashboard.md # ✅ Implemented (2026-01-12)
├── requests/                        # User stories (what to build)
├── specs/                           # Implementation specifications
├── todo/                            # Technical tasks (how to build)
├── design_decisions/                # Architectural decisions
└── future/                          # Post-MVP enhancements
```

### Using Planning Documents During Development

**Before Starting Work:**
1. Check `/planning/in-progress.md` for current sprint tasks
2. Read the user story in `/planning/requests/{feature}.md` (understand what users want)
3. Review the specification in `/planning/specs/{feature}.md` (understand implementation structure)
4. Follow the technical tasks in `/planning/todo/{feature}.md` (detailed implementation steps)
5. Read design decisions in `/planning/design_decisions/` to understand architecture

**When Adding Features:**
1. Read the user story in `/planning/requests/{feature}.md` - WHAT users want
2. Check `/planning/specs/{feature}.md` - HOW the system should be structured
3. Follow the technical tasks in `/planning/todo/{feature}.md` - DETAILED STEPS
4. Implement in code matching the spec exactly
5. Update `/planning/specs/{feature}.md` with actual implementation if it differs
6. When complete, create documentation in `/planning/done/{feature}.md`

**CRITICAL: After Every Code Change:**
1. **ALWAYS update `/planning/` documentation immediately after code changes**
2. Update `/planning/in-progress.md` - mark completed tasks, update status
3. Update `/planning/specs/{feature}.md` - reflect actual implementation
4. Update or create `/planning/done/{feature}.md` - document what was built
5. Update `CLAUDE.md` - add feature to "Implemented Features" list if major
6. **Document ALL bug fixes and improvements**, not just initial implementations
7. Keep line number references current when code changes
8. This is MANDATORY, not optional - outdated docs cause confusion

**When Fixing Bugs:**
1. Fix the bug in code first
2. Immediately document the fix in `/planning/done/{feature}.md`
3. Update affected planning docs with new line numbers or behavior
4. Commit code and documentation updates together

**When Making Architectural Decisions:**
1. Review `/planning/design_decisions/` for previous rationales
2. Document new decisions if they differ from planning docs
3. Update relevant planning docs if approach changes

**For Future Enhancements:**
- Check `/planning/future/` for planned features and enhancements

## Current Implementation Status

### Architecture
- **Offline-First**: Client-side only, no backend required
- **Storage**: localStorage-based persistence
- **Algorithm**: SM-2 spaced repetition
- **Format**: Single-file app (index.html with inline CSS + JavaScript)

See `/planning/design_decisions/` for detailed architectural choices.

### File Structure

```
/
├── index.html              # Main app (HTML + inline CSS + JavaScript)
├── manifest.webmanifest    # PWA manifest
├── service-worker.js       # Service worker for offline support (sw.js)
├── package.json            # npm scripts and dev dependencies
├── CLAUDE.md               # This documentation
├── src/
│   └── core.js             # Core functions (SM-2, storage, card management)
├── tests/
│   ├── sm2.test.js         # SM-2 algorithm tests
│   ├── storage.test.js     # Storage and persistence tests
│   ├── cards.test.js       # Card management tests
│   └── helpers/
│       └── mocks.js        # Test mocks (localStorage, Date)
└── planning/               # Development planning and specs
```

### Implemented Features (MVP Phase 1 - Complete) ✅

✅ **Core Features**:
- Flashcard display with flip animation
- SM-2 spaced repetition algorithm (src/core.js:31-67)
- localStorage persistence (flashcards + progress)
- 4-button quality rating: No idea, Mistakes, Correct, Easy
- Random due card selection
- 10 test cards included
- Automated test suite (40 tests, 9 test suites, 100% passing)

✅ **Card Management Dashboard** (2026-01-12):
- Two-tab navigation (Study / Dashboard)
- View all cards with complete statistics
- Add new cards via modal form
- Delete cards with confirmation
- Reset card progress (force update state)
- Fixed header with scrollable card list
- Real-time statistics display (interval, repetitions, ease factor, next review)

**Optional for Phase 1** (Future):
- Basic settings panel (not critical for MVP)
- Card editing (update question/answer)

See `/planning/in-progress.md` for current priorities.
See `/planning/done/` for detailed implementation documentation.

### Data Model (Current Implementation)

**localStorage Keys**:
- `localStorage.flashcards` - Array of card objects (id, question, answer)
- `localStorage.progress` - Object mapping cardId → {interval, repetitions, easeFactor, nextReview}

See `/planning/specs/cards.md` and `/planning/specs/spaced_repetition.md` for detailed data structures.

### Key Functions (Current Implementation)

**Core Logic** (located in `src/core.js`):
- `calculateSM2(cardProgress, quality)` - SM-2 algorithm implementation (src/core.js:31-67)
- `getDueCards(cards, progress)` - Filter cards due for review (src/core.js:75-79)
- `initializeProgress(cards)` - Initialize default progress state (src/core.js:87-99)
- `initializeStorage(initialCards)` - Set up localStorage on first load (src/core.js:107-126)
- `saveProgress(progress)` - Persist progress to localStorage (src/core.js:132-135)

**UI Functions** (located in `index.html`):
- `showNextCard()` - Display next due card
- `reviewCard(quality)` - Record review and update progress

See `/planning/done/spaced_repetition.md` and `/planning/done/automated_testing.md` for detailed documentation.

## Development Workflow

### Understanding the Specification Workflow

The three-document approach for each feature:
1. **requests/** = "What does the user need?" (user stories, acceptance criteria)
2. **specs/** = "How should we structure this?" (file layout, functions, data models)
3. **todo/** = "What are the detailed steps?" (task-by-task implementation)
4. **done/** = "What did we build?" (documentation after completion)

Example workflow:
```
Start: Read /planning/requests/cards.md (user stories)
  ↓
Check: /planning/specs/cards.md (understand file structure, functions)
  ↓
Follow: /planning/todo/cards.md (implementation tasks)
  ↓
Code: Implement following spec structure
  ↓
Update: /planning/specs/cards.md (reflect actual implementation)
  ↓
Document: /planning/done/cards.md (explain what was built)
```

### When Completing a Feature

1. Complete the feature according to `/planning/requests/` and `/planning/todo/` specifications
2. Test thoroughly with all use cases (manual + automated)
3. Run automated test suite: `npm test`
4. Create implementation documentation in `/planning/done/{feature}.md`
5. Update `/planning/specs/{feature}.md` to reflect actual implementation
6. Update `/planning/in-progress.md` to mark feature as complete
7. Note any deviations from original spec and why

## Running the Application

**For Users**: See `/planning/user-guide.md` for instructions on:
- Running in browser (any device)
- Installing as PWA on iOS (iPhone/iPad)
- Installing as PWA on macOS (Safari/Chrome)
- Installing on Android, Windows, Linux
- Troubleshooting and offline usage

**For Developers**: Use a local web server:
```bash
python3 -m http.server 8000   # Python
# OR
npx serve                      # Node.js
```

Then open `http://localhost:8000` in your browser.

## Testing

**Quick Start**: Run `npm test` to execute the test suite (40 tests, 9 suites).

**Full Details**: See `/planning/testing-guide.md` for:
- Running tests (test, watch, coverage)
- Test structure and organization
- Writing new tests
- Debugging and best practices

## Code Quality Notes

**MVP Strengths:**
- Simple, readable code
- Single-page app (no routing complexity)
- No external dependencies (pure vanilla JS)
- Lightweight and fast
- Completely offline-capable
- Deterministic algorithm (SM-2)

**MVP Limitations (by design for simplicity):**
- Minimal input validation (assume valid user input)
- Basic error handling for storage
- Simple UI (no complex interactions)
- Limited accessibility features (can add later)

**Avoiding Common Pitfalls:**
- Don't add features beyond requirements
- Don't over-engineer (YAGNI principle)
- Don't add validation for impossible scenarios
- Don't create abstractions for one-time code
- Keep it simple: Three similar lines beats premature abstraction

**When to Refactor:**
- Code is duplicated 3+ times
- Function is > 50 lines
- Complex nested logic is hard to follow
- Performance is measurably slow

## Documentation Maintenance

### When to Update This File (CLAUDE.md)

Update CLAUDE.md when:
- High-level architecture changes significantly
- Major new features are added
- File structure changes
- Development workflow changes

### What NOT to Include in CLAUDE.md

**Do NOT include in this file:**
- Detailed test instructions or test code examples
- Step-by-step user instructions
- API documentation
- Detailed implementation specifics
- Long code samples
- Detailed troubleshooting guides

**Instead, put these in:**
- `/planning/testing-guide.md` - Test details
- `/planning/user-guide.md` - User instructions
- `/planning/specs/*.md` - API and implementation details
- `/planning/done/*.md` - Detailed feature documentation

### Keeping CLAUDE.md Concise

This file should be:
- High-level and navigational
- Reference `/planning/` docs for details
- Quick to scan and understand
- Updated only when structure changes

For detailed specifications, user stories, implementation plans, and design decisions, always refer to the `/planning/` directory.

## Lessons Learned & Best Practices

### Documentation Discipline

**The Problem:**
During card management dashboard implementation (2026-01-12), initial documentation was created but 4 follow-up commits with bug fixes weren't documented until explicitly requested. This created a gap between code reality and documentation.

**The Solution:**
- **Update planning docs IMMEDIATELY after EVERY code change**
- Treat documentation updates as part of the code change, not a separate task
- Document bug fixes, not just initial features
- Keep line number references current
- Commit code and docs together in same session

**Why This Matters:**
- Outdated docs waste time and cause confusion
- Bug fixes are as important to document as features
- Future work relies on accurate current state
- Planning docs guide all development decisions

### Testing Discipline

**Current State:**
- 40 tests covering core logic (SM-2, storage, cards)
- Tests in `tests/` directory using Node.js test runner
- Run with: `npm test`

**What's Tested:**
- SM-2 algorithm correctness
- localStorage persistence
- Card filtering and due card selection

**What's NOT Tested (Future):**
- UI interactions (would need Playwright/Cypress)
- Dashboard functionality
- Modal forms
- Button click handlers

### Common Pitfalls to Avoid

**1. Variable Declaration Issues**
- ❌ Don't use `const` for variables that need reassignment
- ✅ Use `let` for variables modified by functions (like `cards`, `progress`)
- Example: Card deletion failed because `cards` was `const`

**2. UI Update Gaps**
- ❌ Don't assume UI updates automatically
- ✅ Explicitly refresh all affected views after state changes
- Example: New cards didn't appear until `showNextCard()` was called

**3. Flexbox Overflow**
- ❌ Don't forget `min-height: 0` for scrollable flex children
- ✅ Always test scrolling with many items
- Example: Dashboard scroll required multiple CSS fixes

**4. Modal Button Styling**
- ❌ Don't reuse background-specific button classes in modals
- ✅ Create modal-specific button styles
- Example: Cancel button was white-on-white until fixed

**5. Fixed Headers in Scroll Containers**
- ❌ Don't put scrollable content in same container as header
- ✅ Separate header (fixed) from content (scrollable) with wrapper divs
- Example: Dashboard header needed restructuring to stay fixed

### Feature Completion Checklist

Before considering a feature "done":
- [ ] Code implemented and working
- [ ] Manual testing complete (all use cases)
- [ ] Automated tests written (if applicable)
- [ ] All bugs found during testing are fixed
- [ ] `/planning/done/{feature}.md` created with full documentation
- [ ] `/planning/specs/{feature}.md` updated with actual implementation
- [ ] `/planning/in-progress.md` updated to mark feature complete
- [ ] `CLAUDE.md` updated if major feature
- [ ] All follow-up bug fix commits documented
- [ ] Line number references are current
- [ ] Code and docs committed together

### Development Principles (Reinforced by Experience)

1. **Test Immediately**: Don't wait to discover bugs - test each feature right away
2. **Document Immediately**: Update planning docs with every commit
3. **Fix Before Moving On**: Don't leave known bugs for later
4. **Keep Docs Current**: Line numbers, behavior, status must match code
5. **Complete Features Fully**: Including bug fixes, UI polish, and documentation
6. **Learn from Issues**: Document common pitfalls to avoid repeating them

These practices ensure that features are truly complete and documented before moving to the next task.
