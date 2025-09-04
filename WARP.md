# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is **TravelPlanner**, a Next.js 15 travel planning application built with:
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **React 19** for the frontend

The application allows users to plan trips, create itineraries, manage destinations, and collaborate with others on travel plans.

## Development Commands

### Core Development
```bash
# Start development server with Turbopack (fastest)
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Testing & Quality
- No test framework is currently configured
- ESLint is configured with Next.js TypeScript rules

## Architecture & Structure

### App Router Structure
The app uses Next.js App Router with the following key routes:
- `/` - Landing page with hero section and features
- `/trips` - Trip listing page (shows user's trips)
- `/trip/[id]` - Individual trip detail with itinerary
- `/auth/login` - Authentication login form
- `/auth/register` - User registration (route exists but no page file)
- `/profile` - User profile management
- `/about` - About page

### Component Architecture
```
src/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles and CSS variables
│   └── [routes]/          # Individual page routes
└── components/            # Shared components
    ├── Header.tsx         # Navigation header
    └── Footer.tsx         # Site footer
```

### Design System
The app uses a consistent design system with:
- **Primary color**: `#0ea5a3` (teal)
- **Accent color**: `#7c3aed` (violet) 
- **Muted color**: `#4b5563` (gray-600)
- **Font**: Inter from Google Fonts
- **Spacing**: Custom scale (4px, 8px, 12px, 16px, 24px)
- **Border radius**: Large rounded corners (2xl = 1rem)

### Data Architecture
Currently uses **mock data** throughout the application:
- Trip data is hardcoded in components
- User data is managed with local React state
- No backend or database integration yet

### Integration Points
The codebase has clearly marked integration points for future development:
- **Map API integration** (trip details, homepage features)
- **Weather API integration** (trip sidebar)
- **Authentication API integration** (login/register forms)
- **User API integration** (profile management)
- **Image handling** (trip photos, user avatars)
- **Calendar API integration** (itinerary features)
- **Sharing API integration** (trip collaboration)

### State Management
- Uses React's built-in `useState` for local component state
- Client-side components marked with `'use client'` directive
- No global state management solution implemented

### Styling Approach
- **Tailwind CSS v4** with PostCSS
- CSS custom properties defined in `globals.css`
- Consistent component styling patterns
- Dark mode support prepared but not fully implemented

## Key Development Notes

- The project uses **Turbopack** for faster development builds
- TypeScript path aliases configured: `@/*` maps to `./src/*`
- ESLint configured with Next.js and TypeScript rules
- All pages use consistent layout patterns with proper spacing and responsive design
- Components follow a consistent naming convention and structure
- Mock data is clearly identified and ready for API integration
