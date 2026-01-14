# Flashcard Spaced Repetition App - Development Plans

## Current Status
Transitioning from Time Tracker PWA to a Flashcard learning application with spaced repetition algorithm.

## Core Requirements

### Architecture & Delivery
- [ ] Simple, minimalistic design
- [ ] Standalone macOS app feel (PWA-based)
- [ ] Simple but efficient spaced repetition algorithm
- [ ] Fully offline-capable
- [ ] No backend required
- [ ] Serverless after initial load
- [ ] Fast performance
- [ ] Persist application state locally

### Features (Priority Order)
- [x] **Textual Flashcards** - Display Q&A style cards ✅ (2026-01-11)
- [x] **Test Set of Cards** - Provide sample deck for users to test ✅ (10 cards included)
- [x] **Card Editing** - Allow users to modify existing cards ✅ (2026-01-12 - Dashboard)
- [x] **Local Storage** - Remember app state when closed ✅ (localStorage)
- [x] **Spaced Repetition** - Implement efficient scheduling algorithm ✅ (SM-2)
- [x] **Random Card Proposal** - Suggest cards due for review now ✅ (random selection)
- [x] **Learning Progress** - Track and display progress per card ✅ (Dashboard with stats)
- [x] **Automated Testing** - Test suite for core functionality ✅ (40 tests, 2026-01-11)
- [x] **Card Creation UI** - Add new cards via modal form ✅ (2026-01-12 - Dashboard)
- [x] **Card Deletion** - Remove cards with confirmation ✅ (2026-01-12 - Dashboard)
- [x] **Manual Card Updates** - Reset card progress regardless of schedule ✅ (2026-01-12 - Dashboard)
- [ ] **Named Decks** - Support multiple card collections
- [ ] **Card Creation with LLM** - Generate 1 or multiple cards from prompts
- [ ] **Time Travel** - Navigate to specific date for manual review

### Data Persistence
- [x] localStorage-based card storage ✅ (index.html:207-209)
- [x] localStorage-based progress tracking ✅ (index.html:210-221)
- [ ] localStorage-based deck management (future)
- [x] Automatic state recovery on app load ✅ (loads from localStorage)

### User Interface
- [x] Clean, minimal card display ✅ (flip animation)
- [x] Simple navigation between cards ✅ (automatic on rating)
- [x] Progress indicators ✅ (X / Y counter)
- [ ] Deck selector/switcher (future)
- [ ] Basic settings/configuration (future)
- [ ] Export/Import functionality (future)

## Feature Details

See individual files in `/planning/features/` for detailed specifications:
- `cards.md` - Card management and display
- `spaced_repetition.md` - Scheduling algorithm details
- `decks.md` - Multi-deck support
- `progress_tracking.md` - Learning statistics
- `llm_integration.md` - LLM-powered card generation
- `ui_layout.md` - User interface design

## Design Decisions

See `/planning/design_decisions/` for architectural choices:
- `spa_vs_pwa.md` - Why PWA approach
- `storage_strategy.md` - localStorage vs alternatives
- `algorithm_choice.md` - Spaced repetition algorithm selection
- `offline_first.md` - Offline-first architecture

## Future Enhancements

See `/planning/future/` for post-MVP ideas:
- `advanced_features.md` - Potential advanced features
- `performance_optimizations.md` - Scaling considerations
- `mobile_considerations.md` - Mobile-specific improvements
- `sync_strategies.md` - Future sync capabilities

## Development Phases

### Phase 1: MVP (Complete) ✅
1. ✅ Basic card display (10 test cards)
2. ✅ Simple review workflow (flip + rate)
3. ✅ localStorage persistence
4. ✅ Test deck included (10 cards)
5. ✅ Basic spaced repetition (SM-2 algorithm)
6. ✅ Automated test suite (40 tests, 9 suites, 100% passing)
7. ✅ Card management dashboard (2026-01-12)
8. ✅ Card creation UI (modal form)
9. ✅ Card deletion with confirmation
10. ✅ View all cards with statistics
11. ✅ Reset card progress (force update)

**Optional for Phase 1**:
- Basic settings panel (not critical for MVP)

### Phase 2: Enhancement (In Progress) 🚧
1. **Multiple decks** - In progress
   - ✅ Deck data model and storage layer (2026-01-14)
   - ⏳ Deck UI components (deck selector, modal)
   - ⏳ Deck switching functionality
   - ⏳ Deck statistics display
2. LLM card generation
3. Improved UI/UX
4. Progress statistics

### Phase 3: Advanced
1. Time travel/review
2. Advanced scheduling
3. Import/Export
4. Accessibility improvements

## Notes

- Keep codebase simple and readable
- No external dependencies unless absolutely necessary
- Test on macOS first, ensure PWA install works
- Focus on performance and speed
- Ensure works completely offline
