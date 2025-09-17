'use client';

import { useState } from 'react';

interface ApiResponse {
  email: string;
  audioUrl: string;
}

export default function Home() {
  const [linkedinProfile, setLinkedinProfile] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkedinProfile.trim()) {
      setError('LinkedIn Profile URL is required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedinProfile: linkedinProfile.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // For now, using mock data since backend returns different structure
      // TODO: Update when backend implements actual email/audio generation
      setResult({
        email: `Hi there,\n\nI hope this message finds you well. I came across your LinkedIn profile and was impressed by your professional background and recent posts.\n\nI'd love to discuss how our solutions could help you and your organization achieve even greater success. Would you be available for a brief call this week?\n\nBest regards,\nSales Team`,
        audioUrl: '/generated-audio/output.mp3'
      });
    } catch (err) {
      setError('Failed to generate outreach. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Personalized Sales Outreach Agent
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn Profile *
            </label>
            <input
              type="url"
              id="linkedinProfile"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="https://www.linkedin.com/in/username"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Generating...
              </>
            ) : (
              'Generate Outreach'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900">Generated Email</h2>
                <button
                  onClick={() => copyToClipboard(result.email)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Copy Email
                </button>
              </div>
              <blockquote className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {result.email}
                </pre>
              </blockquote>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Voice Note</h2>
              <audio
                controls
                className="w-full"
                preload="metadata"
              >
                <source src={result.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}