
"use client";

import { formatDurationForDisplay, addMilliseconds, calculatePercentage } from '@/lib/datetime-utils';

interface TimelineHeaderProps {
  sessionStartTime: Date;
  sessionEndTime: Date;
  totalSessionDurationMs: number;
}

const TICK_INTERVAL_MINUTES = 5;

export function TimelineHeader({ sessionStartTime, sessionEndTime, totalSessionDurationMs }: TimelineHeaderProps) {
  const generatedTicks: { time: Date; label: string; position: number }[] = [];
  const tickIntervalMs = TICK_INTERVAL_MINUTES * 60 * 1000;

  generatedTicks.push({
    time: sessionStartTime,
    label: '0min',
    position: 0,
  });

  if (totalSessionDurationMs > 0 && tickIntervalMs > 0) {
    for (let currentTimeMs = tickIntervalMs; currentTimeMs < totalSessionDurationMs; currentTimeMs += tickIntervalMs) {
      const tickTime = addMilliseconds(sessionStartTime, currentTimeMs);
      generatedTicks.push({
        time: tickTime,
        label: `${Math.floor(currentTimeMs / (60 * 1000))}min`,
        position: calculatePercentage(currentTimeMs, totalSessionDurationMs),
      });
    }
  }

  if (totalSessionDurationMs > 0) {
    generatedTicks.push({
      time: sessionEndTime,
      label: formatDurationForDisplay(totalSessionDurationMs).replace(/\s\d+s$/, ''),
      position: 100,
    });
  }

  const uniqueTicksByPosition = Array.from(
    new Map(generatedTicks.map(tick => [tick.position, tick])).values()
  );

  uniqueTicksByPosition.sort((a,b) => a.position - b.position);

  const ticks = uniqueTicksByPosition;

  return (
    <div className="flex-grow relative h-6 mt-3 mb-1">
      {ticks.map((tick, index) => (
        <div
          key={`${tick.label}-${index}-${tick.position}`}
          className="absolute top-0 h-full flex flex-col items-center"
          style={{
            left: `${tick.position}%`,
            transform: tick.position === 100 ? 'translateX(-100%)' : tick.position === 0 ? 'translateX(0%)' : 'translateX(-50%)'
          }}
        >
          <span className="text-xs text-muted-foreground whitespace-nowrap">{tick.label}</span>
          <div className="w-px h-1.5 bg-[hsl(var(--timeline-grid))] mt-0.5"></div>
        </div>
      ))}
       <div className="absolute bottom-0 left-0 w-full h-px bg-[hsl(var(--timeline-grid))]"></div>
    </div>
  );
}
