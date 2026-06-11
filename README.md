# EduTrace — UI

> EduTrace is a comprehensive Learning Management System designed to streamline the academic experience for students, educators, and administrators. It brings together real-time communication, intelligent assessment management, AI-powered insights, and detailed reporting — all in one cohesive platform built for modern educational institutions.

## Features

- **Communication Room** — Real-time collaborative spaces powered by WebSocket and PeerJS for live messaging and peer-to-peer interaction between students and instructors
- **Assessment Management** — Create, assign, and track assessments with deadline enforcement and structured submission workflows
- **Calendar** — Unified calendar view for custom events, assessment deadlines, and scheduled activities to keep students and staff aligned
- **Time Tracking** — Per-assessment time logging with daily recommended study targets, helping students pace themselves and meet deadlines effectively
- **Reports & Overview** — Class-wide and assessment-based performance dashboards with exportable reports generated via Puppeteer for clean, print-ready output
- **AI Integration** — Built-in AI analysis to proactively identify at-risk students, surface study pattern insights, and generate contextual questions for deeper academic evaluation

## Tech Stack

- **Next.js** 16+ (App Router)
- **React** 19+
- **TypeScript**
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible, composable UI components
- **HeroUI** — additional UI component library
- **MUI** — chart and data visualization components
- **PeerJS** — peer-to-peer communication for real-time collaboration
- **WebSocket** — low-latency real-time messaging and live updates
- **Puppeteer** — server-side report generation and PDF export
- **Zod** — schema-based input validation
- **Zustand** — lightweight global state management

## Prerequisites

- [Node.js 21+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/14th-Gen-Basic-Course-Final-Project/EduTrace-UI.git
cd EduTrace-UI
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will start at `http://localhost:3000`.

### 5. Verify

Open [http://localhost:3000](http://localhost:3000) in your browser. Make sure the backend API is running for full functionality.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Production Build

```bash
npm run build
npm run start
```

For deployment, set all environment variables on your hosting platform (Vercel, Docker, etc.) and ensure `NEXT_PUBLIC_API_BASE_URL` points to your production API.