<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=for-the-badge" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" />

# 🧠 SynapseAI — Frontend

**A modern, full-featured Second Brain application UI built with React 18, TypeScript, and Vite.**  
Capture tweets, YouTube videos, articles, documents, and notes — all in one beautiful dark workspace.

[🌐 Live Demo](https://synapseai-front.vercel.app) · [Backend Repo](https://github.com/HarshMishra2803/synapseai) · [Frontend Repo](https://github.com/HarshMishra2803/synapseai-front)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/signin with token-based sessions
- 📚 **Content Library** — Save links, YouTube videos, tweets, documents, and notes
- 🔍 **Real-time Search** — Filter content by title, URL, notes, or tags instantly
- 🏷️ **Tag System** — Organise content with custom tags and filter by them
- 🌐 **Brain Sharing** — Generate a public read-only link to share your entire brain
- 📱 **Fully Responsive** — Mobile-first design with a collapsible sidebar
- 🎨 **Premium Dark UI** — Black + Emerald Green theme with glassmorphism and micro-animations
- ♿ **Accessible** — Semantic HTML, keyboard navigation, unique element IDs

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [React 18](https://react.dev/) with Hooks |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) — strict mode |
| **Build Tool** | [Vite 8](https://vitejs.dev/) — HMR, instant cold start |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS design system |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) with request interceptors |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| **Linting** | ESLint + TypeScript ESLint + React Hooks plugin |

---

## 📁 Project Structure

```
src/
├── api.ts                    # Axios client + all API calls
├── types/index.ts            # Shared TypeScript types (Content, User, etc.)
├── utils/errors.ts           # Type-safe Axios error extractor
│
├── context/
│   └── AuthContext.tsx       # JWT auth state (token, user, login, logout)
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx        # Reusable button (primary/secondary/ghost/danger)
│   │   ├── Input.tsx         # Labelled input with icon + error state
│   │   ├── Modal.tsx         # Accessible modal (Escape key, scroll lock)
│   │   └── Toast.tsx         # Global toast notification system
│   │
│   ├── Sidebar.tsx           # Navigation sidebar (desktop always-on, mobile drawer)
│   ├── Topbar.tsx            # Sticky search bar + action buttons
│   ├── ContentCard.tsx       # Content card (YouTube embed, tweet link, tags)
│   ├── AddContentModal.tsx   # Modal form to add new content
│   └── ShareBrainModal.tsx   # Share brain with public hash link
│
└── pages/
    ├── LoginPage.tsx         # Split-panel login UI
    ├── SignupPage.tsx        # Split-panel signup UI
    ├── DashboardPage.tsx     # Main content grid with filters
    └── SharedBrainPage.tsx   # Public read-only view of a shared brain
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend running at `http://localhost:3000`

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/synapseai-frontend.git
cd synapseai-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev       # Start development server with HMR
npm run build     # Production build (output: dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint across all TypeScript files
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Set the environment variable `VITE_API_URL` to your deployed backend URL in the Vercel dashboard.

### Netlify

```bash
npm run build
# Deploy the dist/ folder to Netlify
```

Add a `_redirects` file in `public/`:
```
/*  /index.html  200
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:3000` |

---

## 🎨 Design System

The UI is built on a custom CSS design system defined in `src/index.css`:

| Token | Value |
|-------|-------|
| Background | `#000000` |
| Primary Green | `#10b981` (Emerald 500) |
| Dark Green | `#059669` (Emerald 600) |
| Light Green | `#34d399` (Emerald 400) |
| Text Primary | `#f1f5f9` |
| Text Muted | `#6b7280` |
| Border | `rgba(255,255,255,0.06)` |

---

## 🔒 Auth Flow

```
User → /login or /signup
  ↓
POST /api/v1/signin → receives JWT token
  ↓
Token stored in localStorage as 'synapse_token'
  ↓
AuthContext provides token to all components
  ↓
Axios interceptor attaches token to every request header
  ↓
Protected routes check isAuthenticated → redirect to /login if false
```

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Built with ❤️ and lots of ☕ by <a href="https://github.com/HarshMishra2803">Harsh Mishra</a>
</div>
