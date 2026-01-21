# Ethereal Notes

A premium note-taking application with stunning glassmorphic design, rich text editing, and Firebase backend. Built with Next.js 14, TipTap, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Functionality

#### 📝 Rich Text Editing
- **TipTap Editor** with full WYSIWYG support
- **Formatting Options**:
  - Bold, Italic, Strikethrough
  - Inline code
  - Hyperlinks with URL input
  - Headings (H1, H2, H3)
  - Lists (ordered and unordered)
- **Dual Storage**: Saves both HTML (`contentHtml`) and plain text (`content`)
- **Auto-save**: Changes persist to Firestore in real-time

#### 📱 Note Management
- **Create Notes**: Floating action button (FAB) or bottom nav
- **View Notes**: Click to open in read-only mode
- **Edit Notes**: "Edit" button or three-dot menu → Edit
- **Delete Notes**: Soft delete (moves to trash, `isDeleted: true`)
- **Favorite Notes**: Star/unstar from note card menu
- **Search Notes**: Real-time filtering by title, content, or tags
- **Tag System**: Multi-tag support with color-coded pills

#### 🎨 Card Customization
- **5 Color Options**: Blue (#6262f3), Pink (#ec4899), Green (#22c55e), Orange (#f97316), Cyan (#06b6d4)
- **Visual Indicators**: Color dot with matching glow shadow
- **Masonry Layout**: Pinterest-style responsive grid (1/2/3 columns)
- **Card Menu** (three dots):
  - Edit
  - Add to Favorites / Remove from Favorites
  - Delete

### User Interface

#### 🎭 Design System - "Aether"
- **Glassmorphic Components**: Frosted glass panels with backdrop blur
- **Color Palette**:
  - Primary: `#6262f3` (Indigo)
  - Background Dark: `#09090b`
  - Glass Panel: `rgba(24, 24, 27, 0.4)` with 24px blur
  - Glass Card: Gradient from `rgba(39, 39, 42, 0.4)` to `rgba(24, 24, 27, 0.2)`
- **Typography**:
  - Display: Inter (with font features: cv02, cv03, cv04, cv11)
  - Monospace: JetBrains Mono (for timestamps, tags)
- **Animations**:
  - Floating shapes (20s loop, 3 colored blobs)
  - Card hover: Scale 1.02, lift 4px
  - Smooth transitions: cubic-bezier(0.25, 0.8, 0.25, 1)

#### 🌓 Theme Support
- **Dark Mode** (default): Deep void background with colored accents
- **Light Mode**: Clean white glassmorphism on gradient background
- **Toggle Location**: Settings page
- **Persistence**: Stored in localStorage via Zustand

#### 📐 Layout

**Desktop (≥768px)**:
- **80px Rail Sidebar**: Icon-only navigation with tooltips
  - Home, Favorites, Archive
  - 3 color tag dots
  - Settings (bottom)
  - Sign Out (bottom)
- **Main Content**: Max-width 5xl (1280px), centered
- **Header**: Dynamic greeting, date/time, search bar
- **FAB**: Bottom-right, glass pill button

**Mobile (<768px)**:
- **Top Header**: Avatar + "Ethereal" branding + hamburger menu
- **Hamburger Menu**: Slide-in sidebar drawer with full navigation
- **Bottom Navigation** (fixed):
  - Home (active state: blue)
  - Search
  - New Note (elevated FAB-style button)
  - Favorites
  - Settings
- **FAB**: Positioned above bottom nav (bottom: 80px)

### Pages

#### 🏠 Home (`/`)
- **Dashboard**: Notes grid with masonry layout
- **Dynamic Greeting**: "Good Morning/Afternoon/Evening, {Name}"
- **Live Clock**: "WEDNESDAY, JAN 21 • 11:42 PM"
- **Search Bar**: Full-width with ⌘K hint
- **Filter Chips**: "All Notes" + top 5 tags (excluding "enter")
- **Note Grid**: Responsive columns with stagger animations

#### 🔍 Search (`/search`)
- **Auto-focus**: Input field focused on page load
- **Real-time Filtering**: By title, content, or tags
- **Results Count**: "Found X notes"
- **Empty States**: 
  - "Start typing to search..." (no query)
  - "No notes found" (no results)

#### ⭐ Favorites (`/favorites`)
- **Starred Notes**: Currently shows all notes (favorite field to be added)
- **Empty State**: Star icon with "No favorites yet" message

#### ⚙️ Settings (`/settings`)
- **Appearance Section**:
  - Theme toggle (moon/sun icon)
  - Switch component (blue when dark mode)
- **Account Section**:
  - User avatar (48x48)
  - Display name + email
  - Sign Out button (red accent)
- **About Section**:
  - App name: "Ethereal Notes"
  - Version: 1.0.0

### Authentication

#### 🔐 Google Sign-In
- **Provider**: Firebase Authentication
- **UI**: Clean modal with Google button
- **Redirect**: Back to `/` after sign-in
- **Session**: Persistent via Firebase Auth

### Data Storage

#### 🗄️ Firestore Structure
```
users/{userId}/notes/{noteId}
  ├─ title: string
  ├─ content: string (plain text)
  ├─ contentHtml: string (rich HTML)
  ├─ excerpt: string (auto-generated, 150 chars)
  ├─ tags: string[]
  ├─ color: string (hex code)
  ├─ isFavorite: boolean (optional)
  ├─ isDeleted: boolean (default: false)
  ├─ createdAt: timestamp
  ├─ updatedAt: timestamp
  └─ userId: string
```

#### 📊 State Management (Zustand)
- **Notes Store**: Notes array, editor state, current note, read-only mode
- **Settings Store**: Grid layout, default note color
- **Theme Store**: Theme (light/dark), toggle function

### Features Breakdown

| Feature | Status | Description |
|---------|--------|-------------|
| Rich Text Editor | ✅ | TipTap with toolbar |
| Note CRUD | ✅ | Create, read, update, delete |
| Search | ✅ | Real-time filtering |
| Favorites | ✅ | Star/unstar notes |
| Tags | ✅ | Multi-tag support |
| Color Coding | ✅ | 5 color options |
| Masonry Grid | ✅ | Responsive layout |
| Dark Mode | ✅ | Default theme |
| Light Mode | ✅ | Toggle in settings |
| Mobile Nav | ✅ | Bottom bar + hamburger |
| Read-Only Mode | ✅ | View before edit |
| Glassmorphism | ✅ | Aether design system |
| Firebase Auth | ✅ | Google sign-in |
| Firestore Sync | ✅ | Real-time updates |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Eternal0p/ethereal-notes.git
cd ethereal-notes
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Firebase Setup**
   - Enable Google Authentication
   - Create Firestore database
   - Add security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

---

## 🎨 UI/UX Details

### Color System

#### Primary Palette
```css
--primary: #6262f3 (Indigo Blue)
--primary-hover: #5252e3
--background-dark: #09090b
--background-light: #f5f5f7
```

#### Note Colors
```css
Blue:   #6262f3
Pink:   #ec4899
Green:  #22c55e
Orange: #f97316
Cyan:   #06b6d4
```

#### Text Colors (Dark Mode)
```css
--text-primary: #ffffff
--text-secondary: #d4d4d8 (zinc-300)
--text-muted: #a1a1aa (zinc-400)
--text-subtle: #71717a (zinc-500)
--text-faint: #52525b (zinc-600)
```

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

### Typography Scale
- **Display**: 3xl (1.875rem/30px) - Greetings
- **Heading**: 2xl (1.5rem/24px) - Page titles
- **Title**: lg (1.125rem/18px) - Note titles
- **Body**: base (1rem/16px) - Content
- **Caption**: sm (0.875rem/14px) - Metadata
- **Micro**: xs (0.75rem/12px) - Tags, timestamps

### Border Radius
- **Small**: 0.5rem (8px) - Pills, tags
- **Medium**: 0.75rem (12px) - Buttons
- **Large**: 1rem (16px) - Cards
- **XL**: 1.5rem (24px) - Panels

### Shadows
```css
.glass-glow {
  box-shadow: 0 0 15px rgba(98, 98, 243, 0.2);
}

.card-elevated {
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-hover {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
}
```

### Animations

#### Floating Shapes
```css
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}
```

#### Card Stagger
```javascript
containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1, // 100ms delay between cards
    },
  },
};
```

### Responsive Breakpoints
```css
sm:  640px  /* Mobile landscape */
md:  768px  /* Tablet portrait */
lg:  1024px /* Tablet landscape */
xl:  1280px /* Desktop */
2xl: 1536px /* Large desktop */
```

---

## 🏗️ Architecture

### Tech Stack

**Frontend**:
- Next.js 14.2.35 (React 18)
- TypeScript 5.x
- Tailwind CSS 3.x
- Framer Motion 11.x (animations)
- TipTap 2.x (rich text)
- Zustand 4.x (state management)

**Backend**:
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting (optional)

**Dev Tools**:
- ESLint + Prettier
- Vercel (deployment)

### Folder Structure
```
src/
├── app/
│   ├── page.tsx              # Home/Dashboard
│   ├── search/page.tsx       # Search page
│   ├── favorites/page.tsx    # Favorites page
│   ├── settings/page.tsx     # Settings page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + light mode
├── components/
│   ├── layout/
│   │   ├── aether-background.tsx    # Animated background
│   │   ├── sidebar.tsx              # Desktop rail sidebar
│   │   ├── mobile-header.tsx        # Mobile header
│   │   ├── mobile-bottom-nav.tsx    # Mobile bottom nav
│   │   └── mobile-sidebar.tsx       # Hamburger menu drawer
│   ├── notes/
│   │   ├── notes-dashboard.tsx      # Main dashboard
│   │   ├── notes-grid.tsx           # Masonry grid
│   │   ├── note-card.tsx            # Individual card
│   │   ├── note-editor.tsx          # Full-screen editor
│   │   └── tag-input.tsx            # Tag input component
│   ├── editor/
│   │   ├── rich-text-editor.tsx     # TipTap wrapper
│   │   └── editor-toolbar.tsx       # Formatting toolbar
│   ├── providers/
│   │   └── theme-provider.tsx       # Theme context
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── firebase.ts          # Firebase config
│   └── types.ts             # TypeScript types
└── store/
    ├── notes.ts             # Notes Zustand store
    ├── settings.ts          # Settings store
    └── theme.ts             # Theme store
```

### Key Components

#### Notes Dashboard Flow
```
page.tsx (auth check)
  ↓
NotesDashboard (main container)
  ├─ AetherBackground (ambient shapes)
  ├─ Sidebar (desktop only)
  ├─ MobileHeader (mobile only)
  │   └─ Hamburger → MobileSidebar
  ├─ Header (greeting, search, filters)
  ├─ NotesGrid (masonry)
  │   └─ NoteCard[] (individual cards)
  │       └─ DropdownMenu (edit/fav/delete)
  ├─ MobileBottomNav (mobile only)
  └─ NoteEditor (modal)
      ├─ EditorToolbar
      └─ RichTextEditor (TipTap)
```

#### State Flow
```
User Action
  ↓
Component (useNotesStore)
  ↓
Zustand Store (state update)
  ↓
Firebase (if data change)
  ↓
Firestore Listener (real-time)
  ↓
Store Update (setNotes)
  ↓
Component Re-render
```

---

## 📖 Usage Guide

### Creating a Note
1. Click **"New Note"** FAB (bottom-right) or bottom nav button
2. Enter title in large input
3. Use toolbar to format text:
   - Click **B** for bold
   - Click **I** for italic
   - Click **Link** icon, enter URL, click "Add"
   - Click **Code** for inline code
4. Select color swatch
5. Add tags (press Enter after each)
6. Click **"Create Note"** button

### Viewing a Note
1. Click on any note card
2. Note opens in **read-only mode**
3. Content is rendered as formatted HTML
4. Click **"Edit"** button (top-right) to switch to edit mode

### Editing a Note
**Method 1**: Click "Edit" in read-only view
**Method 2**: Click three dots (⋮) → "Edit"

### Favoriting a Note
1. Click three dots (⋮) on note card
2. Click "Add to Favorites"
3. Star icon appears on card footer

### Deleting a Note
1. Click three dots (⋮) on note card
2. Click "Delete"
3. Note is soft-deleted (`isDeleted: true`)

### Searching Notes
1. Click **Search** in bottom nav (mobile) or open `/search`
2. Type in search bar
3. Results filter in real-time

### Changing Theme
1. Navigate to **Settings** page
2. Toggle switch under "Appearance"
3. Theme persists across sessions

---

## 🔒 Security Rules

### Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own notes
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null 
                        && request.auth.uid == userId;
    }
    
    // Prevent reading other users' data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Next.js Environment Variables
- All Firebase config is in `NEXT_PUBLIC_*` variables
- Never commit `.env.local` to version control
- Use Vercel environment variables for deployment

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import GitHub repo to Vercel
   - Auto-detect Next.js

2. **Environment Variables**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Deploy**
   - Push to `main` branch
   - Vercel auto-deploys
   - Visit `your-app.vercel.app`

4. **Custom Domain** (optional)
   - Add domain in Vercel settings
   - Update DNS records
   - SSL auto-configured

### Firebase Hosting (Alternative)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

---

## 🐛 Known Issues

1. **Favorites**: Currently shows all notes. Need to filter by `isFavorite: true`
2. **Archive**: UI exists but not wired up (no filtering)
3. **Tag Filtering**: Filter chips are visual only (not functional)
4. **Sidebar Tag Dots**: Decorative, not linked to actual tags

---

## 🗺️ Roadmap

### v1.1
- [ ] Functional favorites filtering
- [ ] Archive page with soft-deleted notes
- [ ] Tag-based filtering (click chip → filter)
- [ ] Keyboard shortcuts (⌘K for search, ⌘N for new note)
- [ ] Note export (Markdown, PDF)

### v1.2
- [ ] Note sharing (public links)
- [ ] Collaborative editing (real-time)
- [ ] File attachments (images, PDFs)
- [ ] Voice notes (audio recording)
- [ ] Note templates

### v2.0
- [ ] Folders/notebooks
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)
- [ ] Calendar view
- [ ] Reminders/notifications

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

## 👨‍💻 Author

Created by **Vivek** ([@Eternal0p](https://github.com/Eternal0p))

---

## 🙏 Acknowledgments

- **TipTap** for the amazing rich text editor
- **shadcn/ui** for beautiful UI components
- **Framer Motion** for smooth animations
- **Firebase** for backend infrastructure
- **Vercel** for seamless deployment

---

## 📸 Screenshots

### Desktop View
![Desktop Dashboard](docs/screenshots/desktop-dashboard.png)
*Masonry grid with glassmorphic cards on Aether background*

### Mobile View
![Mobile Navigation](docs/screenshots/mobile-nav.png)
*Bottom navigation with elevated FAB button*

### Rich Text Editor
![Note Editor](docs/screenshots/editor.png)
*Full-screen editor with formatting toolbar*

### Light Mode
![Light Theme](docs/screenshots/light-mode.png)
*Clean light mode with white glassmorphism*

---

**Built with ❤️ using Next.js and Firebase**
