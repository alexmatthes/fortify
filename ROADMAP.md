# 🗺️ Fortify Roadmap

This roadmap outlines the strategic direction for the Fortify project, prioritized by impact and stability.

## 🚨 Phase 1: Critical Fixes & Stability
**Goal:** Ensure the application works as intended and user data is preserved.

- [ ] **Fix "The Missing Loop" (Session Saving)**
    -   **Problem:** `SessionPage.tsx` runs the workout but never saves data to the backend when finished.
    -   **Solution:** Implement API calls to `POST /api/sessions` upon routine completion.
    -   **Details:** Auto-log all completed items. Display a summary on the completion screen.

## 🏗️ Phase 2: Infrastructure & Scalability
**Goal:** Build a solid foundation for future development and refactoring.

- [ ] **Backend Testing Infrastructure**
    -   Install `jest` and `supertest`.
    -   Create initial integration tests for critical paths (Auth, Sessions).
- [ ] **Code Cleanup**
    -   Refactor "messy" areas (TBD during development).
    -   Ensure consistent error handling and type safety.

## 📚 Phase 3: Documentation
**Goal:** Make the codebase easier to understand for new contributors (and future self).

- [ ] **API Documentation**
    -   Document API endpoints (params, request/response bodies).
- [ ] **Developer Guide**
    -   Update `README.md` with testing instructions and architecture overview.

## 🚀 Phase 4: Feature Expansion
**Goal:** Enhance the user experience with new tools and better data.

### Medium Priority
- [ ] **"Smart Mode" Runtime Resolution**
    -   Calculate progressive overload tempo at *start* of session, not build time.
- [ ] **Visual Metronome**
    -   Add visual cues (flashing border/circle) for silent practice.
- [ ] **Gap Click (Ghost Mode)**
    -   Randomly silence the metronome to train internal clock.

### Low Priority
- [ ] **Mobile Optimizations**
    -   Implement Wake Lock API to prevent screen sleep.
    -   Larger touch targets.
- [ ] **Settings & Customization**
    -   Change password / Delete account.
    -   Audio sample selection (Beep, Cowbell, etc.).

---
*Based on `FUTURE_PLANS.md` and user discussions.*
