# Flashcard Spaced Repetition PWA - Technical Documentation

## Project Overview

This is a Progressive Web App (PWA) for learning with textual flashcards using an efficient spaced repetition algorithm (SM-2). The app allows users to create and manage decks of cards, track learning progress, and study with optimal scheduling. Fully offline-capable with optional LLM-powered card generation.

## Planning Directory

The `/planning` directory contains structured documentation for development and decision-making:

```
/planning
├── in-progress.md                   # Current sprint tasks and priorities
├── done/                            # Completed features (implementation docs)
│   └── spaced_repetition.md         # ✅ Implemented (2026-01-11)
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
├── script.js               # (Legacy - time tracking code, not used)
├── style.css               # (Legacy - time tracking styles, not used)
├── manifest.webmanifest    # PWA manifest
├── service-worker.js       # Service worker for offline support (sw.js)
├── CLAUDE.md               # This documentation
└── planning/               # Development planning and specs
```

### Implemented Features (MVP Phase 1 - Partial)

✅ **Core Features**:
- Flashcard display with flip animation
- SM-2 spaced repetition algorithm (index.html:235-259)
- localStorage persistence (flashcards + progress)
- 4-button quality rating: No idea, Mistakes, Correct, Easy
- Random due card selection
- 10 test cards included

❌ **Still Needed for Phase 1**:
- Card creation UI
- Card editing UI
- Basic settings panel

See `/planning/in-progress.md` for current priorities.
See `/planning/done/spaced_repetition.md` for full implementation details.

### Data Model (Current Implementation)

**localStorage Keys**:
- `localStorage.flashcards` - Array of card objects (id, question, answer)
- `localStorage.progress` - Object mapping cardId → {interval, repetitions, easeFactor, nextReview}

See `/planning/specs/cards.md` and `/planning/specs/spaced_repetition.md` for detailed data structures.

### Key Functions (Current Implementation)

Located in `index.html:235-325`:
- `calculateSM2(cardProgress, quality)` - SM-2 algorithm implementation
- `getDueCards()` - Filter cards due for review
- `showNextCard()` - Display next due card
- `reviewCard(quality)` - Record review and update progress

See `/planning/done/spaced_repetition.md` for detailed function documentation.

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
2. Test thoroughly with all use cases
3. Create implementation documentation in `/planning/done/{feature}.md`
4. Update `/planning/specs/{feature}.md` to reflect actual implementation
5. Update `/planning/in-progress.md` to mark feature as complete
6. Note any deviations from original spec and why

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
- No unit tests (can add in phase 2+)

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

## Contact & Maintenance

This documentation should be updated when:
- Architecture changes significantly
- New features are added
- Data model changes
- Breaking changes are introduced

For detailed specifications, user stories, implementation plans, and design decisions, always refer to the `/planning/` directory.
