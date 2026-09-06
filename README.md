# Code Vault Max

A developer workspace where you write code and an AI assistant helps you build,
understand, and fix it — writing new code from a prompt, explaining existing code,
spotting likely bugs, and proposing fixes you can apply directly. Deploys entirely on
Vercel with zero backend infrastructure — no database, no server to manage.
Live demo:https://code-vault-max.vercel.app/

---

## Features

- **Write with AI** — describe what you want built, get real, complete code back.
- **Real code editor** — Monaco (VS Code's own editor), self-hosted, with real syntax highlighting for Python, JavaScript, TypeScript, Java, C, C++, C#, Go, PHP, Ruby, SQL, and Bash.
- **AI-powered code review (optional)** — powered by Groq: explains code, finds likely bugs, proposes fixes, improves code quality, generates documentation, and answers programming questions.
  - **Honest note on how this works:** the AI analyzes code by reading it — there is no code execution engine in this build. "Find Errors" and "Fix" are the AI's best judgment, not a confirmed compiler/runtime result. This is stated in the UI, not hidden.
- **Snippet vault** — save, tag, categorize, favorite, and duplicate code snippets.
- **Project management** — group snippets under real projects with tech stack and status tracking.
- **Instant search** — across your snippets and projects.
- **Dashboard analytics** — real activity charts and language usage, computed from your actual saved snippets.
- **Dark/light themes**, fully responsive, WCAG AA contrast-audited.

## Architecture — read this before you're surprised by anything

**There is no backend server or database.** This is a deliberate choice, not an
oversight. Accounts, snippets, and projects all live in **your browser's
localStorage**. This means:

- ✅ No server costs, no database to manage, no deployment complexity
- ✅ Genuinely instant — every save, load, and search is a local read, not a network round trip
- ✅ Deploys as a single Vercel project, same simple pattern as any AI-powered tool with no user accounts
- ⚠️ **Your account only exists in the browser it was created in.** No cross-device sync. Clearing your browser data removes your account and everything saved.
- ⚠️ There's no password recovery — there's no server to send a reset email from. Keep your password somewhere safe.
- ⚠️ Public snippet sharing via link isn't available — there's no server to host a shared link for someone else to open.

The only real backend involved is a handful of small, stateless serverless functions
(`/api/ai/*`) that forward your code/prompt to Groq's AI API and return the result —
nothing else touches a server.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Monaco Editor (self-hosted), Recharts |
| Storage | Browser localStorage (accounts, snippets, projects) |
| AI backend | Vercel serverless functions (Node.js/TypeScript), stateless |
| AI | Groq API (OpenAI-compatible) |
| Password hashing | Web Crypto API (SHA-256, salted) — client-side, since there's no server |

## Project structure

```
code-vault-max/
  src/
    lib/auth/           Client-side auth: password hashing, localStorage user storage
    lib/snippets/        Client-side snippet storage
    lib/projects/         Client-side project storage
    store/authStore.ts    Zustand store wrapping the auth storage layer
  api/ai/                8 small serverless functions — the only backend, all AI-only
  server/
    lib/                 Shared AI logic (Groq client, prompt engineering)
    index.ts              Local dev server only — wires the same api/ai/*.ts files to
                           Express routes so `npm run dev` works locally. Never deployed;
                           production uses the api/ files directly.
```

## Local development

### Prerequisites

- Node.js 20+

### 1. Clone and install

```bash
git clone <your-repo-url>
cd code-vault-max
npm install
```

### 2. Configure environment variables (optional)

```bash
cp .env.example .env
```

Add a free Groq key if you want AI features locally: https://console.groq.com/keys
(everything else works fully without one — AI buttons just report as unavailable).

### 3. Start the app

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Deployment

1. Push this repo to GitHub
2. Import it on Vercel (vercel.com → Add New Project → your repo) — auto-detected, no config needed
3. Add `GROQ_API_KEY` as an environment variable in Vercel's project settings (optional)
4. Deploy

That's the whole deployment — no database to provision, no migrations to run.

## Testing

There's no separate automated test-suite framework configured (no vitest/jest). Every
feature was verified through real integration testing during development, including
the full signup → save → AI review flow through an actual browser.

## License

All rights reserved. This project was built as a portfolio piece.
