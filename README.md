# Hack the North Events

Displays workshops, tech talks, and activities with authentication-based access control for private events. Didn't have much time so its pretty bare bones :')

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Radix UI primitives

## Getting Started

Install dependencies:

```bash
npm install
# or
bun install
```

Run the development server:

```bash
npm run dev
# or
bun dev
```

## Features

- Event listing sorted by date and time
- Authentication system (username: `hacker`, password: `htn2026`)
- Private event access control
- Event detail modals with related events navigation
- URL hash-based event linking
- Responsive design for mobile and desktop

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - React components including shadcn/ui components
- `lib/` - Utility functions and API client
- `public/` - Static assets
