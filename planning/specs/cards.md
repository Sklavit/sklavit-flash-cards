# Specification: Card Management System

**Status**: ✅ Partially Implemented (2026-01-12)
**Links**: User Story: `/planning/requests/cards.md` | Tasks: `/planning/todo/cards.md` | Done: `/planning/done/card_management_dashboard.md`

## Overview

Card management system handles creating, reading, updating, and deleting flashcards. Cards are the core unit and can be organized into decks.

## File Structure

```
script.js (main file)
├── GLOBAL STATE
│   └── let cards = [];  // Array of all cards loaded from localStorage
├── STORAGE FUNCTIONS
│   ├── loadCards()      // Load from localStorage.cards
│   └── saveCards()      // Save to localStorage.cards
├── CRUD OPERATIONS
│   ├── createCard(deckId, question, answer, tags, difficulty)
│   ├── getCard(cardId)
│   ├── getCardsByDeck(deckId)
│   ├── updateCard(cardId, updates)
│   └── deleteCard(cardId, archive)
├── UTILITY FUNCTIONS
│   ├── generateCardId()
│   ├── validateCard(card)
│   └── formatCardForDisplay(card)
└── UI FUNCTIONS
    ├── displayCard(card)
    ├── showCardModal(card = null)  // Create or edit
    └── handleCardRating(cardId, quality)
```

## Data Model

### Card Object
```javascript
{
  id: "card-123456789",           // Unique ID (timestamp or UUID)
  deckId: "deck-abc",             // Parent deck reference
  question: "What is X?",         // Required, max 500 chars
  answer: "X is...",              // Required, max 5000 chars
  tags: ["biology", "cell"],      // Optional array of strings
  difficulty: "medium",           // 'easy' | 'medium' | 'hard'
  createdAt: 1609459200000,       // Timestamp (ms)
  updatedAt: 1609459200000        // Timestamp (ms)
}
```

### Storage
- **Key**: `localStorage.cards`
- **Format**: JSON stringified array
- **Limit**: ~5-10MB (localStorage limit)
- **Persistence**: Browser session + app updates

## Key Functions

### `createCard(deckId, question, answer, tags = [], difficulty = 'medium')`
- Generate unique ID
- Validate required fields (question, answer)
- Create progress record
- Save to localStorage
- Trigger UI update
- Return: card object or null on error

### `updateCard(cardId, updates = {})`
- Find card by ID
- Apply updates (question, answer, tags, difficulty)
- Preserve review history (don't touch progress)
- Update `updatedAt` timestamp
- Save to localStorage
- Return: updated card object

### `deleteCard(cardId, archive = false)`
- If archive: keep card, mark as archived
- If delete: remove from array, cascade delete progress
- Save to localStorage
- Trigger UI update
- Return: success boolean

### `getCardsByDeck(deckId)`
- Filter cards where card.deckId === deckId
- Return: array of card objects (in display order)

## Component Interactions

```
User Input
    ↓
showCardModal() → HTML form
    ↓
validateCard() ← Check required fields
    ↓
createCard() or updateCard()
    ↓
saveCards() → localStorage
    ↓
UI Update ← Display success message
```

## Implementation Notes

- **Validation**: Require both question and answer (client-side only)
- **IDs**: Use `Date.now()` for simplicity or UUID library if needed
- **Display**: Show question first, answer on tap (card flip)
- **Performance**: With 10000+ cards, use indexing or pagination
- **Transitions**: Smooth 200ms fade for card flip

## Related Features

- **Decks**: Cards belong to decks via `deckId`
- **Progress**: Progress records linked via `cardId`
- **Spaced Repetition**: Card review triggers progress calculation
- **UI**: Cards displayed in modal and main view

## Testing Checklist

- [ ] Create card with all fields
- [ ] Create card with minimal fields
- [ ] Edit card preserves timestamps
- [ ] Delete card removes from array
- [ ] Export/import roundtrip works
- [ ] 10000+ cards loads without lag
- [ ] Display updates after CRUD operation

## Implementation Status

- [x] localStorage integration ✅ (inline in index.html)
- [x] Create card operation ✅ (index.html:464-502)
- [x] Read/Display cards ✅ (index.html:372-437)
- [x] Delete card operation ✅ (index.html:505-525)
- [x] Reset card progress ✅ (index.html:528-548)
- [x] UI forms working ✅ (modal form at index.html:440-457)
- [x] Validation in place ✅ (requires question and answer)
- [x] Error handling added ✅ (localStorage and basic validation)
- [ ] Update card operation (edit question/answer) - Not implemented yet
- [ ] Card archiving - Not implemented yet
- [ ] Bulk operations (import/export) - Not implemented yet
- [ ] Search/filter functionality - Not implemented yet
- [ ] Performance tested - Basic testing complete

## Actual Implementation Notes (2026-01-12)

Implemented as single-file app in `index.html` with inline JavaScript:
- No separate `script.js` file - all code inline
- Cards stored as `localStorage.flashcards` (JSON array)
- Progress stored as `localStorage.progress` (JSON object)
- Simplified data model: cards only have {id, question, answer}
- No deckId, tags, or difficulty fields yet (future enhancement)
- No separate createAt/updatedAt timestamps yet
- Dashboard view with navigation tabs
- Modal form for adding cards
- Statistics display for all SM-2 metrics
- Reset progress functionality for manual card updates

See `/planning/done/card_management_dashboard.md` for complete implementation details.
