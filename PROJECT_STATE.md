# Project State - Personalized Sales Outreach Agent

## Overview
A web application that generates personalized sales outreach emails and voice notes from LinkedIn profile URLs.

## Architecture

### Backend (Node.js/Express/TypeScript)
**Location**: `backend/`
**Port**: 3000
**Dependencies**: 
- Express.js for API server
- Mistral AI for email generation
- ElevenLabs for voice synthesis
- UUID for unique file naming
- TypeScript for type safety

**Endpoints**:
- `POST /api/outreach` - Unified endpoint that generates both email text and audio file

**Key Files**:
- `main.ts` - Express server with API endpoints
- `response.ts` - Mistral AI integration for email generation
- `voice.ts` - ElevenLabs integration for voice synthesis
- `profile.ts` - Mock profile data and TypeScript interfaces

### Frontend (Next.js 14/React/TypeScript)
**Location**: `frontend/`
**Port**: 3001
**Framework**: Next.js 14 with App Router
**Styling**: Tailwind CSS

**Features**:
- LinkedIn profile URL input with LinkedIn logo
- Loading states with spinner animation
- Error handling and validation
- Email display with copy-to-clipboard functionality
- Audio player for voice notes
- Responsive design

**Key Files**:
- `app/page.tsx` - Main application interface
- `app/layout.tsx` - Root layout component
- `app/globals.css` - Tailwind CSS styles
- `next.config.js` - API proxy configuration

## Current Functionality

### Working Components
- ✅ Unified backend endpoint for email and audio generation
- ✅ Backend email generation using Mistral AI
- ✅ Backend voice synthesis using ElevenLabs with unique file naming
- ✅ Static file serving for audio files
- ✅ Frontend UI with LinkedIn profile input
- ✅ Form validation and error handling
- ✅ TypeScript interfaces and type safety
- ✅ Frontend-backend integration with proper JSON response handling

### Current Limitations
- LinkedIn profile URL input is collected but not processed for personalization
- No real LinkedIn data extraction implemented
- Uses mock profile data for all requests

## Data Flow

### Current State
1. User enters LinkedIn profile URL in frontend
2. Frontend sends URL to backend `/api/outreach` endpoint
3. Backend ignores URL input and uses mock profile data
4. Backend generates email using Mistral AI
5. Backend generates audio file using ElevenLabs with unique filename
6. Backend saves audio file to `backend/public/audio/` directory
7. Backend returns JSON response with email text and audio URL
8. Frontend displays actual backend response content

## Environment Variables Required
```
MISTRAL_API_KEY=your_mistral_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## File Structure
```
├── backend/
│   ├── main.ts              # Express server with unified endpoint
│   ├── response.ts          # Mistral AI integration
│   ├── voice.ts             # ElevenLabs integration with unique file naming
│   ├── profile.ts           # Mock data and interfaces
│   ├── package.json         # Backend dependencies
│   └── public/
│       └── audio/           # Generated audio files with unique names
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main UI component
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Styles
│   ├── next.config.js       # Next.js configuration
│   └── package.json         # Frontend dependencies
├── Agent.md                 # Original requirements
└── PROJECT_STATE.md         # This file
```

## Mock Data Structure
```typescript
interface LeadData {
  name: string;
  company: string;
  linkedinProfile: string;
  companyNews: string;
}
```

## API Response Formats

### Current `/api/outreach` Response
```json
{
  "email": "Hi [Name], I saw the news about...",
  "audioUrl": "http://localhost:3000/audio/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6.mp3"
}
```

## Testing Status
- ✅ Backend voice generation confirmed working
- ✅ Frontend UI renders correctly
- ✅ Form validation working
- ✅ Frontend-backend integration complete
- ✅ Unified endpoint architecture implemented
- ✅ Unique audio file naming and static serving