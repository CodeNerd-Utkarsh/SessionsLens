
# SessionLens - Knowledge Transfer

## Wot is This Thing?

SessionLens is a little app to show a timeline of what happened in a video/audio call. You feed it some JSON data (see `src/lib/session-data.ts` for the format), and it draws out who was in the call, when they joined, when their mic or video was on, and if any errors or disconnects happened.

The main goal was to get a quick visual overview of a session, mostly for debugging or review purposes. It's built with Next.js and React.

## Tech Stack

- **Next.js:** For the framework, routing, server components etc.
- **React:** For building the UI componants.
- **Tailwind CSS:** For styling. Most styles are utility classes.
- **ShadCN UI:** Provides the basic UI elements like Cards, Tooltips. These are in `src/components/ui/` and are pretty much what you get out of the box from them.
- **date-fns:** Used in `datetime-utils.ts` for reliable date manipulations.

## Project Strucure

Here's a rundown of the main bits:

- **`src/app/`**: This is where the main app routes and global stuff lives.
    - **`page.tsx`**: This is the main page you see. It grabs the `sessionData`, calculates total session duration, and then maps over participants to render their rows. It sets up the main card and scroll area.
    - **`layout.tsx`**: The root layout for the app. Sets the `dark` theme by default on the `<html>` tag and includes the `Toaster` for any notifications (not really used much rite now).
    - **`globals.css`**: Contains all the Tailwind CSS setup and our custom CSS variables for theming (colors, radius, etc.). The dark theme colors are defined here under `.dark { ... }`.

- **`src/components/`**: All the React components.
    - **`session-timeline/`**: These are the custom components built specifically for the timeline vizualization.
        - **`TimelineHeader.tsx`**: Renders the time scale (0min, 5min, 10min, etc.) that appears above all participant timelines. It calculates tick positions based on the total session duration. The logic for generating ticks needed a bit of tweaking to make sure it looks okay, especially the last tick.
        - **`ParticipantRow.tsx`**: This componant is responsable for rendering a single participant's information (name, ID, join/duration details) and their `TimelineTrack`. It gets data for one participant and passes it down.
        - **`TimelineTrack.tsx`**: This is where the actual horizontal track for a participant is drawn. It renders the main blue presence bar(s) based on `timelog` data. Then, it processes all other events (mic, webcam, errors, disconnects) and maps them to `TimelineEventMarker` components, which are overlaid on this track.
        - **`TimelineEventMarker.tsx`**: This one renders the individual icons on the timeline (Monitor for joined, Video for webcam, Mic for mic on, AlertCircle for errors/disconnects). It calculates the horizontal position of each icon. The icons for errors/disconnects have a card-like background to make them look more like buttons.
        - **`EventTooltip.tsx`**: A simple wrapper around ShadCN's tooltip to show details when you hover over events.

    - **`ui/`**: These are the ShadCN UI components (Button, Card, Tooltip, etc.). We mostly use them as-is.

- **`src/lib/`**: Utility functions, type definitions, and mock data.
    - **`datetime-utils.ts`**: A critical file. Contains all helper functions for parsing ISO date strings into `Date` objects, calculating durations between dates (in milliseconds), calculating percentage positions for events on the timeline, and formatting dates/times for display (e.g., "HH:mm:ss", "10m 30s"). Corrrectness here is key for the timeline to make sense.
    - **`session-data.ts`**: This is just *mock data* for now. In a real app, this would come from an API. It defines the structure of a session, its participants, and their events.
    - **`types.ts`**: TypeScript interfaces defining the shape of our data (SessionData, Participant, EventTimeRange, ProcessedEvent etc.). Helps keep things consistent.
    - **`utils.ts`**: Contains the `cn` utility function from ShadCN for merging Tailwind classes.

- **`public/`**: For static assets. Not much here currently.

- **`docs/`**: You're reading it! For any kind of documentation.

## Data Flwo & Logic Highlihts

1.  **Data Source**: `sessionData` in `src/lib/session-data.ts` is the single source of truth for the timeline.
2.  **Page Load (`page.tsx`)**:
    - Fetches `sessionData`.
    - Parses global session `start` and `end` times.
    - Calculates `totalSessionDurationMs`. This is SUPEr important as all event positioning is relative to this.
    - Iterates through `participantArray`.
3.  **Participant Row (`ParticipantRow.tsx`)**:
    - Receives a single `participant` object.
    - Displays participant's name, ID.
    - Calculates and displays participant's first join time and total active duration (sum of their `timelog` entries).
    - Renders a `TimelineTrack` for this participant.
4.  **Timeline Track & Events (`TimelineTrack.tsx`, `TimelineEventMarker.tsx`)**:
    - `TimelineTrack` receives `participant` data, session start/end, and total duration.
    - It draws the main blue presence bars based on the participant's `timelog`. Each `timelog` entry is a period they were "present".
    - It then iterates over all other events (mic, webcam, errors, disconnects) for that participant.
    - For each event:
        - Its `start` time is converted to a millisecond offset from the `sessionStartTime`.
        - This offset is then converted to a percentage of `totalSessionDurationMs` usinng `calculatePercentage`.
        - This percentage is used as `positionStartPercent` to place the `TimelineEventMarker` (the icon) absolutely on the track.
    - Event icons are styled to be visually distinct.

## Themingg

The app defaults to a dark theme. This is set in `src/app/layout.tsx` by adding `className="dark"` to the `<html>` tag.
All colors are defined as HSL CSS variables in `src/app/globals.css`. There's a base set of variables and then overrides within the `.dark { ... }` block. This makes it easy to tweak the color scheme.

## Notes

-   The timeline is currently based on **mock data**. To make this useful, you'd need to hook it up to a real backend that provides session data in the expected JSON format.
-   Timezone handling: All times in the input JSON are expected to be UTC (ISO 8601 format). The `datetime-utils.ts` functions generally work with these Date objects, and formatting functions like `formatTime` use UTC methods to avoid local timezone issues in display, but always good to double-check if data sources change.
-   The participant presence (blue bars) is directly from `timelog`. Disconnects are inferred if a participant's `timelog` ends before the overall session ends, or if there's a gap before their next `timelog` entry.

This should give a decent overview. Lemme know if any part is unclear!
