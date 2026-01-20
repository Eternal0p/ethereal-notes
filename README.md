# Premium 3D Notes Application

A modern, AI-powered notes application with a stunning 3D interface built with Next.js, Firebase, and Gemini AI.

## Features

✨ **Fully Implemented:**
- **Google Authentication** - Secure sign-in with Firebase Auth
- **3D Note Cards** - Beautiful grid layout with glassmorphism effects
- **Automatic Excerpts** - Notes show preview excerpts on cards
- **Color Customization** - Choose from 5 vibrant colors for your notes
- **Real-time Sync** - Notes automatically sync with Firebase Firestore
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Design** - Works beautifully on all screen sizes
- **Tags System** - Organize notes with tags and filter by tags
- **Grid Customization** - Adjust note card sizes (Small, Wide, Tall, Large)
- **Settings Panel** - Theme selection (Dark/Light), default color, and layout preferences


## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google account (for Firebase and Gemini API)

### Quick Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd Notes\ App
   npm install
   ```

2. **Configure Environment**
   
   Follow the detailed setup guide in [SETUP.md](./SETUP.md) to:
   - Create a Firebase project
   - Enable Google Authentication
   - Set up Firestore database
   - Get a Gemini API key
   - Configure environment variables

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with hot reload

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **AI:** Google Gemini AI via Genkit
- **State Management:** Zustand
- **Animations:** Framer Motion
- **3D Graphics:** Three.js, React Three Fiber

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── auth/        # Authentication components
│   ├── layout/      # Layout components (Sidebar, etc.)
│   ├── notes/       # Note-related components
│   ├── shared/      # Shared/reusable components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
├── store/           # Zustand state management
└── ai/              # Genkit AI flows and configuration
```

## Environment Variables

See [SETUP.md](./SETUP.md) for detailed instructions. Required variables:

- `GEMINI_API_KEY` - For AI summarization
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (6 variables)

Copy `.env.example` to `.env` and fill in your credentials.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For setup help and troubleshooting, see the [SETUP.md](./SETUP.md) guide.
