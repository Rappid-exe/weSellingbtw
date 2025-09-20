# Project State - Personalized Sales Outreach Agent

## Overview
🎉 **FULLY FUNCTIONAL SYSTEM** - A complete web application that generates highly personalized sales outreach emails and voice notes from LinkedIn profile URLs using AI-powered personalization.

## Architecture

### Backend (Node.js/Express/TypeScript)
**Location**: `backend/`
**Port**: 3000
**Dependencies**: 
- Express.js for API server
- Mistral AI for intelligent email generation
- ElevenLabs for voice synthesis with custom voice
- Apify for reliable LinkedIn profile scraping
- UUID for unique file naming
- TypeScript for type safety

**Endpoints**:
- `POST /api/test-apify` - **Main working endpoint** for LinkedIn scraping + email/audio generation
- `POST /api/test-mock` - Testing endpoint with mock data
- `POST /api/outreach` - Legacy unified endpoint

**Key Files**:
- `main.ts` - Express server with unified endpoints and error handling
- `response.ts` - Advanced Mistral AI integration with product-aware personalization
- `voice.ts` - ElevenLabs integration with unique file naming and custom voice ID
- `apify-scraper.ts` - **Working Apify integration** for reliable LinkedIn scraping
- `profile.ts` - TypeScript interfaces and mock data

### Frontend (Next.js 14/React/TypeScript)
**Location**: `frontend/`
**Port**: 3001
**Framework**: Next.js 14 with App Router
**Styling**: Tailwind CSS

**Features**:
- LinkedIn profile URL input with LinkedIn logo
- **Product/service description textarea** for personalized messaging
- Loading states with spinner animation
- Comprehensive error handling and validation
- Email display with copy-to-clipboard functionality
- **Audio player for personalized voice notes**
- Responsive design with improved text visibility

**Key Files**:
- `app/page.tsx` - Main application interface with dual input fields
- `app/layout.tsx` - Root layout component
- `app/globals.css` - Tailwind CSS styles with improved text visibility
- `next.config.js` - API proxy configuration

## ✅ FULLY WORKING SYSTEM STATUS

### Core Features (All Working)
- ✅ **LinkedIn Profile Scraping** - Apify integration successfully extracts real profile data
- ✅ **AI-Powered Email Generation** - Mistral AI creates highly personalized sales emails
- ✅ **Voice Synthesis** - ElevenLabs generates custom voice notes using user's voice
- ✅ **Product-Aware Personalization** - Connects prospect's background to user's specific product/service
- ✅ **Intelligent Angle Detection** - AI analyzes profile data to find best personalization hooks
- ✅ **Professional Email Quality** - Enterprise-grade personalized outreach content
- ✅ **Unique File Management** - UUID-based audio file naming prevents conflicts
- ✅ **Static File Serving** - Audio files served at `/audio/` endpoint
- ✅ **Error Handling** - Graceful fallbacks and detailed error messages
- ✅ **TypeScript Integration** - Full type safety across frontend and backend

### User Interface (All Working)
- ✅ **Dual Input System** - LinkedIn URL + Product description fields
- ✅ **Form Validation** - Required field validation with clear error messages
- ✅ **Loading States** - Professional loading indicators during processing
- ✅ **Results Display** - Clean presentation of generated email and audio
- ✅ **Copy Functionality** - One-click email copying to clipboard
- ✅ **Audio Playback** - HTML5 audio player for voice notes
- ✅ **Responsive Design** - Works across different screen sizes
- ✅ **Improved Text Visibility** - Dark text for better readability in input fields

### Technical Integration (All Working)
- ✅ **Frontend-Backend Communication** - Seamless API integration
- ✅ **Apify LinkedIn Scraping** - Reliable profile data extraction with correct input format
- ✅ **Mistral AI Integration** - Advanced prompt engineering for personalization
- ✅ **ElevenLabs Voice Generation** - Custom voice synthesis with user's specific voice ID
- ✅ **File Management** - Unique audio file generation and serving
- ✅ **Error Recovery** - System continues working even if individual components fail

## Current Workflow (Fully Functional)

### User Experience Flow
1. **Input**: User enters LinkedIn profile URL + describes their product/service
2. **Processing**: Real-time LinkedIn scraping → AI analysis → Email generation → Voice synthesis
3. **Output**: Highly personalized sales email + Custom voice note
4. **Quality**: Enterprise-grade personalization that references specific profile details

### Technical Data Flow
1. User enters LinkedIn profile URL and product description in frontend
2. Frontend sends data to backend `/api/test-apify` endpoint
3. **Backend scrapes LinkedIn profile using Apify** to extract:
   - Full name, headline, about text, recent posts
4. **Backend analyzes scraped data** to find best personalization angle
5. **Backend generates highly personalized email** using advanced Mistral AI prompt with product context
6. **Backend generates audio file** using ElevenLabs with user's custom voice
7. Backend saves audio file to `backend/public/audio/` directory with unique UUID filename
8. Backend returns JSON response with personalized email and audio URL
9. **Frontend displays actual personalized content** with copy and audio playback functionality

## Environment Variables Required
```
MISTRAL_API_KEY=your_mistral_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
APIFY_API_TOKEN=your_apify_api_token_here
```


## File Structure
```
├── backend/
│   ├── main.ts              # Express server with working endpoints
│   ├── response.ts          # Mistral AI integration with product-aware prompts
│   ├── voice.ts             # ElevenLabs integration with custom voice ID
│   ├── apify-scraper.ts     # Working Apify LinkedIn scraping integration
│   ├── profile.ts           # TypeScript interfaces and mock data
│   ├── package.json         # Backend dependencies
│   └── public/
│       └── audio/           # Generated audio files with unique UUID names
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main UI with dual input fields
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Styles with improved visibility
│   ├── next.config.js       # Next.js configuration with API proxy
│   └── package.json         # Frontend dependencies
├── Agent.md                 # Original requirements
└── PROJECT_STATE.md         # This file
```

## API Response Format (Working)

### Current `/api/test-apify` Response
```json
{
  "email": "Subject: AI ethics in aerospace—how Boeing's approach might shape your future work\n\nHi Umair,\n\nYour background at Boeing combined with your focus on AI/ML and aerospace engineering caught my eye...",
  "audioUrl": "http://localhost:3000/audio/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6.mp3",
  "scrapedData": {
    "fullName": "Umair Ismati",
    "headline": "Software & Aerospace Engineer | Python, C , AI/ML, Cloud | Ex-Boeing",
    "aboutText": "Welcome to my LinkedIn profile...",
    "recentPostText": "No recent posts available"
  }
}
```

## System Capabilities (All Working)

### Personalization Quality
- **Enterprise-grade** personalized outreach content
- **Specific references** to prospect's background, experience, and interests
- **Product-aware messaging** that connects prospect needs to user's solution
- **Professional tone** appropriate for business outreach
- **Intelligent angle selection** based on profile analysis

### Technical Performance
- **Reliable LinkedIn scraping** using Apify professional service
- **Fast email generation** using Mistral AI
- **High-quality voice synthesis** using ElevenLabs custom voice
- **Robust error handling** with graceful fallbacks
- **Scalable architecture** ready for production use

## 🎯 SYSTEM STATUS: PRODUCTION READY

This is a complete, fully functional personalized sales outreach system that delivers:
- **Real LinkedIn profile data extraction**
- **AI-powered personalized email generation**
- **Custom voice note synthesis**
- **Professional user interface**
- **Enterprise-grade output quality**

The system is ready for real-world sales outreach use cases and delivers personalization quality that matches or exceeds commercial sales automation platforms.