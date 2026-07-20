# TrackHire

TrackHire is a minimalist application designed to centralize your job search. Avoid spreadsheets and fragmented documents—TrackHire combines tracking metrics with contextual matching tools.

## Core Features

- **Job Tracker:** A clean Kanban board and table layout to log positions, manage progression steps, and register offer parameters.
- **Match Analyzer:** Cross-reference your resumes against job descriptions to identify missing keywords and receive alignment scores.
- **Drafting Tool:** Draft cover letters referencing specific experience points and job requirements.
- **Interview Simulator:** Generate role-specific questions and practice responses.
- **Dark / Light Mode:** A sleek design language inspired by Vercel and Linear, with responsive light/dark toggling.
- **Data Portability:** Download backup archives of your application records or wipe data clean at any time from your settings panel.

## Technology Stack

- **Frontend:** React, TailwindCSS, React Router, Lucide icons, Zustand state store.
- **Backend Services:** Firebase Auth, Firestore Database, Firebase Storage.
- **Text Parsers:** client-side PDF and DOCX converters.

## Setup Instructions

### Prerequisites
- Node.js (version 18 or above recommended)
- Firebase Account and Project Configurations

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/aman-joshi/trackhire.git
   cd trackhire
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environmental settings. Duplicate `.env.example` to `.env` and assign your Firebase variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the local server:
   ```bash
   npm run dev
   ```
