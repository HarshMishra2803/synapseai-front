<div align="center">

# 🧠 SynapseAI — Frontend

**A modern Second Brain application built with React 18, TypeScript, and Vite.**
Capture tweets, YouTube videos, articles, documents, and notes — all in one beautiful dark workspace.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-synapseai--front.vercel.app-10b981?style=for-the-badge)](https://synapseai-front.vercel.app)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based login & signup with persistent sessions |
| 📚 **Content Types** | Save YouTube videos, tweets, links, documents, and notes |
| 🔍 **Search & Filter** | Real-time search + tag-based filtering |
| ✏️ **Edit Content** | Update title, note, and tags of any saved item |
| 📌 **Pin / Favourite** | Pin important items to always appear at the top |
| 📊 **Analytics Dashboard** | Visual bar chart showing content breakdown by type |
| ✨ **AI Summary** | One-click AI-generated summary using Groq (Llama 3.1) |
| 🔗 **Share Brain** | Generate a public read-only link to share your brain |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🌙 **Dark Theme** | Black + Emerald Green glassmorphism design |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI component library |
| **Language** | TypeScript 5 | Type safety |
| **Build Tool** | Vite 8 | Lightning-fast HMR & bundling |
| **Routing** | React Router v7 | Client-side navigation |
| **HTTP Client** | Axios | API requests with interceptors |
| **Styling** | Vanilla CSS + CSS Variables | Design tokens, glassmorphism |
| **Icons** | Lucide React | Consistent icon library |
| **Deployment** | Vercel | Zero-config CI/CD |

---

## 📁 Project Structure

```
src/
├── api.ts                    # Axios instance + all API functions
├── types.ts                  # TypeScript interfaces (Content, User, etc.)
├── main.tsx                  # React entry point
├── App.tsx                   # Router setup + auth guards
├── index.css                 # Global styles, design tokens, components
│
├── context/
│   └── AuthContext.tsx       # JWT auth state (login, logout, token)
│
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar with content type links
│   ├── Topbar.tsx            # Search bar, add button, share button
│   ├── ContentCard.tsx       # Card with pin/edit/AI summary/delete actions
│   ├── AddContentModal.tsx   # Modal to save new content
│   ├── EditContentModal.tsx  # Modal to edit existing content
│   ├── ShareBrainModal.tsx   # Generate/revoke share link
│   └── ui/
│       ├── Button.tsx        # Reusable button (primary/ghost/secondary)
│       ├── Input.tsx         # Reusable input with label + error
│       ├── Modal.tsx         # Animated modal wrapper
│       └── Toast.tsx         # Global toast notification system
│
├── pages/
│   ├── LoginPage.tsx         # Split-panel login UI
│   ├── SignupPage.tsx        # Split-panel signup UI
│   ├── DashboardPage.tsx     # Main app: analytics + content grid
│   └── SharedBrainPage.tsx   # Public read-only view of shared brain
│
└── utils/
    └── errors.ts             # Type-safe error message extractor
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/HarshMishra2803/synapseai-front.git
cd synapseai-front

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:3000

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://synapseai-backend-ocgv.onrender.com` |

### Build for Production

```bash
npm run build   # Creates optimized bundle in dist/
npm run preview # Preview the production build locally
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--green` | `#10b981` | Primary accent, buttons, highlights |
| `--green-dark` | `#059669` | Hover states |
| `--bg` | `#000000` | App background |
| `--surface` | `rgba(255,255,255,0.03)` | Card backgrounds |
| `--border` | `rgba(255,255,255,0.06)` | Card borders |
| `--text-primary` | `#f1f5f9` | Headings |
| `--text-secondary` | `#6b7280` | Subtext |

---

## 🔄 Authentication Flow

```
User enters credentials
        ↓
POST /api/v1/signin
        ↓
Server returns JWT token
        ↓
Token stored in localStorage
        ↓
Axios interceptor attaches token to every request header
        ↓
Protected routes check AuthContext
```

---

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^7.x",
  "axios": "^1.x",
  "lucide-react": "latest",
  "typescript": "^5.x",
  "vite": "^8.x"
}
```

---

## 🌐 Deployment

Hosted on **Vercel** with automatic deployments on every `git push` to `main`.

**vercel.json** — Handles SPA routing (prevents 404 on direct URL access):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📄 License

MIT © [Harsh Mishra](https://github.com/HarshMishra2803)
