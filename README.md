# Project Name — UI

> Next.js frontend for [brief description of what the UI does].

## Tech Stack

- **Next.js** 16+ (App Router)
- **React** 19+
- **TypeScript**
- **Tailwind CSS** — styling
- **Zod** — Input Validation
- **Zustand** / Redux — state management (if applicable)

## Prerequisites

- [Node.js 21+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/14th-Gen-Basic-Course-Final-Project/HRD-Room-UI.git
cd HRD-Room-UI
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

Open [http://localhost:3000](http://localhost:3000) in your browser. Make sure the Spring Boot API is running for full functionality.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Connecting to the API

The UI expects the Spring Boot API to be running at the URL specified in `NEXT_PUBLIC_API_URL`. Make sure to:

1. Start the API server first (see [API README](./API-readme.md))
2. Ensure CORS is configured on the API to allow `http://localhost:3000`

## Production Build

```bash
npm run build
npm run start
```

For deployment, set all environment variables on your hosting platform (Vercel, Docker, etc.) and ensure `NEXT_PUBLIC_API_URL` points to your production API.
