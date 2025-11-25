<!-- 4951d56a-4df2-4180-b69d-8832fa6bcd69 43d7b644-125b-41b9-beb8-1ed9f0d75d07 -->
# Create Standard Footer Component

## Overview

Create a reusable Footer component that will be used across all pages with consistent links and copyright statement.

## Implementation Steps

### 1. Create Footer Component

- Create `frontend/src/components/common/Footer.tsx`
- Include links: Blog, Contact, Privacy Policy, Terms of Service, About
- Use copyright statement from LibraryPage: `© {year} Fortify. Built by a drummer, for drummers.`
- Match styling with existing dark theme (bg-card-bg, border-gray-800, etc.)
- Responsive layout (flex-col on mobile, flex-row on desktop)

### 2. Create Placeholder Pages

Create placeholder pages for new routes:

- `frontend/src/pages/ContactPage.tsx` - Contact form page
- `frontend/src/pages/PrivacyPage.tsx` - Privacy Policy page
- `frontend/src/pages/TermsPage.tsx` - Terms of Service page
- `frontend/src/pages/AboutPage.tsx` - About page

### 3. Add Routes

Update `frontend/src/App.tsx` to add routes for:

- `/contact` (public route)
- `/privacy` (public route)
- `/terms` (public route)
- `/about` (public route)

### 4. Replace Existing Footers

- **LandingPage**: Replace existing footer (lines 106-126) with `<Footer />`
- **LibraryPage**: Replace existing footer (lines 219-221) with `<Footer />`
- **DashboardPage**: Add `<Footer />` at the end (currently no footer)
- **BlogIndexPage**: Add `<Footer />` at the end (currently no footer)
- **BlogPostPage**: Add `<Footer />` at the end (currently no footer)

## Files to Modify

- `frontend/src/components/common/Footer.tsx` (new)
- `frontend/src/pages/ContactPage.tsx` (new)
- `frontend/src/pages/PrivacyPage.tsx` (new)
- `frontend/src/pages/TermsPage.tsx` (new)
- `frontend/src/pages/AboutPage.tsx` (new)
- `frontend/src/App.tsx` (add routes)
- `frontend/src/pages/LandingPage.tsx` (replace footer)
- `frontend/src/pages/LibraryPage.tsx` (replace footer)
- `frontend/src/pages/DashboardPage.tsx` (add footer)
- `frontend/src/pages/BlogIndexPage.tsx` (add footer)
- `frontend/src/pages/BlogPostPage.tsx` (add footer)

## Design Notes

- Footer should match the dark theme styling (bg-card-bg, border-gray-800)
- Use consistent spacing and typography
- Links should have hover states (text-gray-400 hover:text-white)
- Copyright text: "© {year} Fortify Drums." (as implemented - user preference)

### To-dos

- [ ] Create Footer component in frontend/src/components/common/Footer.tsx with links to Blog, Contact, Privacy, Terms, About, and copyright statement
- [ ] Create placeholder pages for ContactPage, PrivacyPage, TermsPage, and AboutPage
- [ ] Add routes in App.tsx for /contact, /privacy, /terms, and /about
- [ ] Replace existing footer in LandingPage.tsx with Footer component
- [ ] Replace existing footer in LibraryPage.tsx with Footer component
- [ ] Add Footer component to DashboardPage.tsx
- [ ] Add Footer component to BlogIndexPage.tsx
- [ ] Add Footer component to BlogPostPage.tsx