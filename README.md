
# SessionLens - Analytics Timeline

SessionLens is a Next.js app to visualize participant activities in a video/audio call session using an interactive timeline from JSON data.

## Key Features

*   Interactive timeline showing video, audio, errors, and connection status.
*   Hover for event details (timestamps, error messages).
*   Responsive, built with Tailwind CSS.

## Project Structure

sessionlens/
├── public/
├── src/
│   ├── app/                # Routes & global styles
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx        # Main timeline page
│   ├── components/
│   │   ├── session-timeline/ # Timeline specific components
│   │   └── ui/             # ShadCN UI
│   ├── lib/
│   │   ├── datetime-utils.ts # Date/time helpers
│   │   ├── session-data.ts   # Mock session data
│   │   └── types.ts          # TypeScript types
│   ├── hooks/              # Custom React hooks
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json

## Running the App

1.  `npm install`
2.  `npm run dev` (Usually runs on `http://localhost:9002`)

Uses mock data from `src/lib/session-data.ts`.
Disconnects are inferred if a participant's log ends before the session.
