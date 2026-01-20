# Environment Setup Guide

This guide will walk you through setting up the required environment variables for the Notes App.

## Prerequisites

- A Google account
- Node.js and npm installed

## Step 1: Firebase Setup

### 1.1 Create a Firebase Project

1. Visit the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if not needed)

### 1.2 Register Your Web App

1. In your Firebase project dashboard, click the **web icon** (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Notes App")
3. Firebase will display your configuration object - keep this window open

### 1.3 Enable Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Go to the **Sign-in method** tab
4. Enable **Google** as a sign-in provider
5. Configure the support email and save

### 1.4 Create Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll set up rules next)
4. Select a location close to your users
5. Click **Enable**

### 1.5 Configure Firestore Security Rules

1. In your Firestore Database, go to the **Rules** tab
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User notes collection
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 2: Gemini API Key Setup

### 2.1 Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select an existing Google Cloud project or create a new one
5. Copy the generated API key

### 2.2 Understanding API Usage

- The Gemini API is used for AI-powered note summarization
- Free tier includes generous usage limits
- View your usage in Google AI Studio

## Step 3: Configure Environment Variables

### 3.1 Create `.env` File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your text editor

### 3.2 Add Firebase Configuration

From the Firebase configuration object you saved in Step 1.2, copy the values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3.3 Add Gemini API Key

Paste your Gemini API key from Step 2.1:

```env
GEMINI_API_KEY=AIza...
```

### 3.4 Save the File

Save your `.env` file. **Important**: Never commit this file to version control!

## Step 4: Verify Setup

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Start Development Server

```bash
npm run dev
```

### 4.3 Test the Application

1. Open your browser to `http://localhost:9002`
2. Click **"Sign in with Google"**
3. Create a test note
4. Verify that:
   - You can sign in with Google
   - Notes are saved and persist after refresh
   - AI summarization generates an excerpt (check the note card)

## Troubleshooting

### Firebase Authentication Not Working

- Check that Google is enabled in Firebase Authentication
- Verify your Firebase config values are correct
- Check browser console for specific error messages

### Firestore Permission Denied

- Verify your Firestore security rules are set correctly
- Ensure you're signed in with the correct account
- Check that `request.auth.uid` matches the `userId` in the path

### AI Summarization Fails

- Verify `GEMINI_API_KEY` is set correctly in `.env`
- Check that there are no extra spaces or quotes
- The app will fall back to a simple text excerpt if AI fails
- Check console for specific error messages

### Build Errors

- Run `npm run typecheck` to check for TypeScript errors
- Run `npm run lint` to check for ESLint issues
- Ensure all dependencies are installed: `npm install`

## Next Steps

- Customize the color palette in [`note-editor.tsx`](./src/components/notes/note-editor.tsx)
- Implement the tags system (currently defined in types but no UI)
- Add grid customization controls for `colSpan`/`rowSpan`

## Security Notes

- The `.env` file contains sensitive credentials - never commit it to git
- `.env.example` is safe to commit (contains no real credentials)
- Firebase API keys are safe to expose in client-side code (they identify your project)
- Gemini API keys should be kept secure - consider using environment variables in production
- Security is enforced through Firebase Security Rules and Authentication
