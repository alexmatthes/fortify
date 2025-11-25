# 🥁 Future Plans & Feature Roadmap

_Analysis based on code review of Frontend Logic, Backend Interactions, and Drummer Usability._

## 🚨 Critical Priorities (The "Missing Loop")

**The Problem:**
Currently, `SessionPage.tsx` guides the user through a workout, but data is never saved. When `phase === 'FINISHED'`, the user sees a completion screen, but no API call is made to `POST /api/sessions`.

**The Consequence:**
Users perform routines, but dashboard stats (Total Time, Heatmap, Velocity) never update. This breaks the core promise of "Own your data."

**Proposed Solution:**

-   [ ] **Auto-Log on Finish:** In `SessionPage.tsx`, trigger a function when entering the `FINISHED` phase that iterates through completed items and posts them to the backend.
-   [ ] **Session Summary:** On the completion screen, display a summary of logged data (e.g., _"Logged 15 mins of Single Stroke Roll at 100 BPM"_) before navigating back to the dashboard.

---

## ⚠️ Logic & Architecture Refactors

### "Smart Mode" Runtime Resolution

**The Problem:**
`RoutineBuilderPage.tsx` calculates progressive overload tempo at _build time_, not _play time_. If a user improves from 100 BPM to 120 BPM after creating a routine, the routine remains stale at 100 BPM.

**Proposed Solution:**

-   [ ] **Database Schema:** Update `RoutineItem` to store a flag (e.g., `useSmartTempo: true`) instead of a hardcoded integer.
-   [ ] **Pre-Flight Check:** When loading `SessionPage.tsx`, check for the "Smart" flag. If present, fetch the current suggested tempo from `/rudiments/:id/suggested-tempo` to override the default.

---

## 📱 UI/UX & Usability Improvements

### Drummer-Centric Features

Drummers have specific physical constraints (hands full of sticks, loud environments) that the current UI does not account for.

-   [ ] **Visual Metronome:** Implement a flashing border or large circle indicator on `SessionPage.tsx` that pulses on the beat. Essential for silent practice (pad work) or high-volume acoustic kit practice.
-   [ ] **Tap Tempo:** Add a button to "tap in" a BPM. Adjusting sliders is fiddly; tapping 4 times is standard music app UX.
-   [ ] **"Ready" State / Count-in:** Add a 2-measure (or 4-click) count-in before the timer and metronome start tracking. Gives the user time to grab sticks.

### Mobile Optimization

-   [ ] **Prevent Screen Sleep:** Implement the **Screen Wake Lock API**. Drummers cannot touch the screen to wake it up every 2 minutes during a 10-minute exercise.
-   [ ] **Mobile-First Controls:**
    -   Move manual logging from a modal to a full-screen page to prevent keyboard overlap issues.
    -   Enlarge touch targets for the "Start/Stop" and navigation buttons.

---

## 🚀 Metronome Enhancements (The "Active Coach")

Upgrade `HeadlessMetronome` from a static click to an active training tool to build internal clock and muscle memory.

### 1. Gap Click (Ghost Mode)

Randomly silences the click to test if the user is rushing or dragging.

-   [ ] **Implementation:** Modify `scheduleNote` logic in `HeadlessMetronome.tsx` to accept a `gapFrequency` prop (e.g., silence every 4th bar).

### 2. Subdivision Support

Beginners need 8th or 16th notes at slow tempos to keep time.

-   [ ] **Implementation:** Pass a `subdivision` prop to `HeadlessMetronome` (e.g., `1`=quarters, `2`=8ths, `4`=16ths).

---

## 📉 Data Analysis & Settings

### Velocity Graph Refinement

-   [ ] **Rudiment Filtering:** Add a dropdown to the Velocity Trajectory chart to toggle which rudiment is being viewed. Aggregating different rudiments (e.g., Pataflafla vs. Single Stroke) creates a jagged, meaningless graph.

### Settings Page

-   [ ] **Account Management:** Add functionality to change passwords and delete accounts.
-   [ ] **Audio Settings:** Allow users to select click sounds (Beep, Cowbell, Stick Click) to reduce frequency fatigue.

---

## 📝 Action Items Summary

### High Priority

-   [ ] Implement API logging in `SessionPage` on completion.
-   [ ] Implement Wake Lock API to keep phone screens on.

### Medium Priority

-   [ ] Refactor "Smart Mode" to calculate tempo at the start of a session (Runtime Resolution).
-   [ ] Add Visual Metronome indicator.
-   [ ] Implement "Gap Click" logic in `HeadlessMetronome`.

### Low Priority

-   [ ] Add "Count-in" (2 measures of click before start).
-   [ ] Add Subdivision support to Metronome.
-   [ ] Add Rudiment filtering to Dashboard graphs.
