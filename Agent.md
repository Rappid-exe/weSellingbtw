Kiro Prompt: Frontend for Personalized Sales Outreach Agent
You are an expert frontend developer specializing in Next.js, TypeScript, and Tailwind CSS. Your task is to create a clean, modern, and fully functional user interface for a web application called "Personalized Sales Outreach Agent".
The application should be a single-page interface built using the Next.js 14 App Router.
## Core Functionality
Input Form:
Create a form with two text input fields:
One for "Lead's Name" (id: leadName).
One for "Company Name" (id: companyName).
Both fields are required.
Generate Button:
A primary call-to-action button with the text "Generate Outreach".
This button should trigger the API call to the backend.
Results Display:
When the API call is successful, display the results in a clean, card-based format.
Email Result: Display the generated email text inside a styled <blockquote> or <pre> tag to preserve formatting. Include a "Copy Email" button next to it that copies the text to the clipboard.
Voice Note Result: Display a standard HTML5 <audio> player to play the generated voice note.
## Styling and Design (Tailwind CSS)
Layout: The entire interface should be centered both vertically and horizontally on the page. Use a single-column layout with a maximum width (max-w-2xl).
Background: Use a light gray background for the page (e.g., bg-slate-100).
Card: The main component should be a white card with soft shadows and rounded corners (e.g., bg-white shadow-md rounded-lg p-8).
Typography: Use a clean, sans-serif font. The main title should be large and bold.
Inputs: Style the text inputs to be modern, with a light gray border that turns a primary color (e.g., blue or purple) on focus.
Button: The primary button should have a solid background color, white text, and a subtle hover effect (e.g., slightly darker background).
## Component Structure and File Naming
The main page component should be located at app/page.tsx.
Use TypeScript for all components.
## State Management (React Hooks)
You must manage the following states using useState:
leadName (string): To hold the value of the lead's name input.
companyName (string): To hold the value of the company name input.
isLoading (boolean): To track the API call status. This is crucial for the UX.
result (object | null): To store the successful API response { email: string, audioUrl: string }.
error (string | null): To store any error messages from the API call.
## User Experience (UX) and State Logic
Initial State: The results and error sections are hidden. The "Generate Outreach" button is active.
Loading State:
When the "Generate Outreach" button is clicked, set isLoading to true.
The button MUST be disabled to prevent multiple submissions.
The button text should change to "Generating..." and display a spinning loader icon next to it.
Clear any previous results or errors.
Success State:
When the API returns a successful response, set isLoading to false.
Store the response in the result state.
Display the results section containing the email and audio player.
Re-enable the "Generate Outreach" button.
Error State:
If the API call fails, set isLoading to false.
Store an error message in the error state (e.g., "Failed to generate outreach. Please try again.").
Display the error message in a distinct, noticeable style (e.g., red text).
Re-enable the "Generate Outreach" button.
## API Interaction
The frontend will communicate with a backend API endpoint at /api/generate.
Request: It will send a POST request with a JSON body:
code
JSON
{
  "name": "Alex Chen",
  "company": "Innovate Inc."
}
Successful Response: It expects a 200 OK response with a JSON body:
code
JSON
{
  "email": "Hi Alex, I saw the news about the new AI-powered analytics suite...",
  "audioUrl": "/generated-audio/output.mp3" 
}
Error Response: It should handle non-200 status codes gracefully.
Please generate the complete code for the app/page.tsx file based on these detailed requirements.
