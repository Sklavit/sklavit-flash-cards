# Lessons Learned & Best Practices

This document captures real issues encountered during development and solutions to prevent repeating mistakes.

## Documentation Discipline

### The Problem (2026-01-12)
During card management dashboard implementation, initial documentation was created but 4 follow-up commits with bug fixes weren't documented until explicitly requested. This created a gap between code reality and documentation.

**Timeline:**
- Initial commit: Documented
- Bug fix commit 1: Not documented
- Bug fix commit 2: Not documented
- Bug fix commit 3: Not documented
- Bug fix commit 4: Not documented
- Only after explicit request were all 4 fixes documented

### The Solution
- **Update planning docs IMMEDIATELY after EVERY code change**
- Treat documentation updates as part of the code change, not a separate task
- Document bug fixes, not just initial features
- Keep line number references current
- Commit code and docs together in same session

### Why This Matters
- Outdated docs waste time and cause confusion
- Bug fixes are as important to document as features
- Future work relies on accurate current state
- Planning docs guide all development decisions

## Testing Discipline

### Current State
- 40 tests covering core logic (SM-2, storage, cards)
- Tests in `tests/` directory using Node.js test runner
- Run with: `npm test`

### What's Tested
- SM-2 algorithm correctness
- localStorage persistence
- Card filtering and due card selection

### What's NOT Tested (Future)
- UI interactions (would need Playwright/Cypress)
- Dashboard functionality
- Modal forms
- Button click handlers

## Common Pitfalls to Avoid

### 1. Variable Declaration Issues

**Problem:** Using `const` for variables that need reassignment
**Impact:** Card deletion failed with error

**Example:**
```javascript
// ❌ Wrong - cannot reassign
const { cards, progress } = initializeStorage(initialCards);
cards = cards.filter(c => c.id !== cardId); // ERROR!

// ✅ Correct - can reassign
let { cards, progress } = initializeStorage(initialCards);
cards = cards.filter(c => c.id !== cardId); // Works!
```

**When to use const vs let:**
- Use `const` for values that never change
- Use `let` for variables modified by functions
- Arrays/objects modified by functions need `let`

**Related Commits:**
- 94d5ec3 "Fix critical bugs in card management"

---

### 2. UI Update Gaps

**Problem:** State changes don't automatically update UI
**Impact:** New cards didn't appear until page reload

**Example:**
```javascript
// ❌ Wrong - updates storage but not UI
cards.push(newCard);
localStorage.setItem('flashcards', JSON.stringify(cards));
// User doesn't see the new card!

// ✅ Correct - update storage AND refresh UI
cards.push(newCard);
localStorage.setItem('flashcards', JSON.stringify(cards));
renderCardList();    // Dashboard view
showNextCard();      // Study view
```

**Best Practice:**
After any state change, explicitly refresh all affected views:
1. Update state (cards, progress)
2. Update localStorage
3. Refresh dashboard view (if visible)
4. Refresh study view
5. Update counters/stats

**Related Commits:**
- 94d5ec3 "Fix critical bugs in card management"

---

### 3. Flexbox Overflow Issues

**Problem:** `overflow-y: auto` doesn't work in flex containers
**Impact:** Dashboard didn't scroll despite having overflow CSS

**Example:**
```css
/* ❌ Wrong - child overflow doesn't work */
.view.active {
  display: flex;
  flex: 1;
}
.dashboard {
  overflow-y: auto;  /* Doesn't work! */
}

/* ✅ Correct - add min-height: 0 to parent */
.view.active {
  display: flex;
  flex: 1;
  min-height: 0;      /* Key property! */
  overflow: hidden;
}
.dashboard {
  overflow-y: auto;   /* Now works */
}
```

**Why This Happens:**
Flex items default to `min-height: auto`, which prevents them from shrinking below content size. This breaks overflow scrolling.

**Solution:**
Add `min-height: 0` to flex parent containers that need scrollable children.

**Related Commits:**
- 64dc02a "Fix dashboard scrolling in flexbox layout"

---

### 4. Modal Button Styling

**Problem:** Reusing background-specific button classes in modals
**Impact:** Cancel button was white text on white background (invisible)

**Example:**
```html
<!-- ❌ Wrong - btn-secondary designed for gradient background -->
<div class="modal-content">  <!-- white background -->
  <button class="btn btn-secondary">Cancel</button>
  <!-- White/transparent on white = invisible! -->
</div>

<!-- ✅ Correct - modal-specific button class -->
<div class="modal-content">
  <button class="btn btn-modal-cancel">Cancel</button>
  <!-- Gray background with dark text -->
</div>
```

**Best Practice:**
- Don't reuse context-specific styles across different contexts
- Create modal-specific button styles
- Test components against their actual background colors

**Related Commits:**
- 211fa77 "Improve dashboard UI with fixes and enhancements"

---

### 5. Fixed Headers in Scroll Containers

**Problem:** Header scrolls away with content
**Impact:** Lost navigation and controls when scrolling through many cards

**Example:**
```html
<!-- ❌ Wrong - header and content in same scroll container -->
<div class="dashboard" style="overflow-y: auto">
  <div class="dashboard-header">Header</div>
  <div class="card-list">Many cards...</div>
  <!-- Header scrolls away! -->
</div>

<!-- ✅ Correct - separate header from scrollable content -->
<div class="dashboard" style="display: flex; flex-direction: column">
  <div class="dashboard-header" style="flex-shrink: 0">
    Header (stays fixed)
  </div>
  <div class="dashboard-content" style="overflow-y: auto">
    <div class="card-list">Many cards...</div>
    <!-- Only content scrolls -->
  </div>
</div>
```

**Best Practice:**
- Use flex column layout for fixed header + scrollable content
- Header: `flex-shrink: 0` (stays in place)
- Content wrapper: `overflow-y: auto` (scrolls)
- Always test with enough content to require scrolling

**Related Commits:**
- 3d021ce "Make dashboard header fixed during scroll"

---

## Feature Completion Checklist

Before considering a feature "done":
- [ ] Code implemented and working
- [ ] Manual testing complete (all use cases)
- [ ] Automated tests written (if applicable)
- [ ] All bugs found during testing are fixed
- [ ] `/planning/done/{feature}.md` created with full documentation
- [ ] `/planning/specs/{feature}.md` updated with actual implementation
- [ ] `/planning/in-progress.md` updated to mark feature complete
- [ ] `CLAUDE.md` updated if major architectural change
- [ ] All follow-up bug fix commits documented
- [ ] Line number references are current
- [ ] Code and docs committed together

## Development Principles (Reinforced by Experience)

1. **Test Immediately**: Don't wait to discover bugs - test each feature right away
2. **Document Immediately**: Update planning docs with every commit
3. **Fix Before Moving On**: Don't leave known bugs for later
4. **Keep Docs Current**: Line numbers, behavior, status must match code
5. **Complete Features Fully**: Including bug fixes, UI polish, and documentation
6. **Learn from Issues**: Document common pitfalls to avoid repeating them

## When to Update This Document

Add to this document when:
- You encounter a bug caused by a common mistake
- You discover a pattern that should be avoided
- You find a solution that should be remembered
- You repeat a mistake that was already documented (update the docs!)

Keep this document:
- Practical and actionable
- Focused on real problems encountered
- Updated with each new lesson learned
- Referenced when starting similar work
