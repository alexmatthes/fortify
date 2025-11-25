# 🗺️ Fortify Roadmap

This roadmap outlines the strategic direction for the Fortify project, prioritized by impact and stability.

## 🎯 High Priority: Core Functionality

### Session Quality Rating

-   **Current State:** Sessions default to quality 4 ("Great") with no user input.
-   Add quality rating UI during or after each practice item (1-4 scale).
-   Store user's actual rating instead of defaulting to 4.

### Routine Management

-   Add ability to edit existing routines.
-   Add ability to delete routines.
-   Add routine duplication/cloning feature.

### Error Handling & User Feedback

-   Improve error messages throughout the application.
-   Add loading states for all async operations.
-   Better validation feedback on forms.

## 🚀 Medium Priority: Feature Enhancements

### Smart Mode Runtime Resolution

-   Calculate progressive overload tempo at _start_ of session, not build time.
-   **Current State:** Smart mode calculates tempo at routine build time. Should resolve at session start for most up-to-date recommendations.

### Visual Metronome

-   Add visual cues (flashing border/circle) for silent practice.
-   Sync visual feedback with metronome beats in `HeadlessMetronome` and `SessionPage`.

### Gap Click (Ghost Mode)

-   Randomly silence the metronome to train internal clock.
-   Add toggle in settings and session page.

### Session History & Analytics

-   Add filtering and search to session history.
-   Add export functionality (CSV/JSON) for session data.
-   Enhanced analytics and insights on dashboard.

### Settings & Customization

-   **Current State:** Settings page UI exists but functionality is incomplete.
-   Implement change password functionality (backend endpoint + frontend form).
-   Implement delete account functionality (with confirmation).
-   Audio sample selection (Beep, Cowbell, Woodblock, etc.) - currently hardcoded.

## 🛠️ Infrastructure & Polish

### Code Quality

-   Code cleanup: Refactor "messy" areas (TBD during development).
-   Ensure consistent error handling and type safety.

### Documentation

-   Update `README.md` with testing instructions and architecture overview.
-   Add instructions for running test suite (`npm test` in backend).

### Accessibility

-   Add ARIA labels and keyboard navigation support.
-   Ensure proper focus management.
-   Screen reader compatibility.

### Performance Optimizations

-   Implement code splitting for faster initial load.
-   Optimize chart rendering for large datasets.
-   Add pagination/virtualization for long lists.

### Mobile Optimizations

-   Implement Wake Lock API to prevent screen sleep during practice sessions.
-   Larger touch targets for mobile devices.
-   Responsive design improvements for small screens.

## 🚢 Future: Production & DevOps

### Production Deployment

-   Set up production environment configuration.
-   Add environment-specific build scripts.
-   Set up monitoring and error tracking (e.g., Sentry).

### CI/CD Pipeline

-   Set up automated testing on pull requests.
-   Automated deployment pipeline.
-   Code quality checks (linting, type checking).

---

_Last updated: 2025-11-25_
