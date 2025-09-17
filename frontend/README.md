# Personalized Sales Outreach Agent - Frontend

A Next.js 14 frontend application for generating personalized sales outreach emails and voice notes.

## Features

- Clean, modern UI built with Next.js 14 and Tailwind CSS
- Form validation for lead name and company name
- Loading states with spinner animation
- Error handling and user feedback
- Copy-to-clipboard functionality for generated emails
- Audio player for voice notes
- Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

## API Integration

The frontend communicates with the backend API at `/api/generate` through a proxy configuration in `next.config.js`. Make sure the backend server is running on port 3000.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks for state management