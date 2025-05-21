
"use client";

import { AlertCircle, Monitor, Video, Mic, XCircle, VideoOff, MicOff, LogOut } from 'lucide-react';
import { EventTooltip } from './event-tooltip';
import type { ProcessedEvent } from '@/lib/types';
import { formatTime } from '@/lib/datetime-utils';
import { cn } from '@/lib/utils';

interface TimelineEventMarkerProps {
  event: ProcessedEvent;
}

const ICON_SIZE = 18;

export function TimelineEventMarker({ event }: TimelineEventMarkerProps) {
  let iconElement: React.ReactNode = null;
  let iconBgColor = 'bg-card';
  let iconFgColor = 'text-card-foreground';
  let tooltipContent = `${formatTime(event.start)}`;
  let specificBorder = '';

  switch (event.type) {
    case 'presence_start':
      iconElement = <Monitor size={ICON_SIZE} />;
      iconBgColor = 'bg-muted';
      iconFgColor = 'text-muted-foreground';
      tooltipContent = `Joined: ${formatTime(event.start)}`;
      break;
    case 'webcam_on':
      iconElement = <Video size={ICON_SIZE} />;
      iconBgColor = 'bg-primary';
      iconFgColor = 'text-primary-foreground';
      specificBorder = 'border border-blue-400 dark:border-blue-700';
      tooltipContent = `Video On: ${formatTime(event.start)}`;
      break;
    case 'webcam_off':
      iconElement = <VideoOff size={ICON_SIZE} />;
      iconBgColor = 'bg-muted';
      iconFgColor = 'text-muted-foreground';
      tooltipContent = `Video Off: ${formatTime(event.start)}`;
      break;
    case 'mic_on':
      iconElement = <Mic size={ICON_SIZE} />;
      iconBgColor = 'bg-[hsl(var(--event-mic-icon-bg))]';
      iconFgColor = 'text-[hsl(var(--event-mic-icon-foreground))]';
      tooltipContent = `Mic On: ${formatTime(event.start)}`;
      break;
    case 'mic_off':
      iconElement = <MicOff size={ICON_SIZE} />;
      iconBgColor = 'bg-muted';
      iconFgColor = 'text-muted-foreground';
      tooltipContent = `Mic Off: ${formatTime(event.start)}`;
      break;
    case 'error':
      iconElement = <AlertCircle size={ICON_SIZE} />;
      iconBgColor = 'bg-destructive';
      iconFgColor = 'text-destructive-foreground';
      tooltipContent = `Error: ${event.message || 'Unknown error'} at ${formatTime(event.start)}`;
      break;
    case 'disconnect':
      iconElement = <LogOut size={ICON_SIZE} />;
      iconBgColor = 'bg-muted';
      iconFgColor = 'text-muted-foreground';
      tooltipContent = `Disconnected: ${formatTime(event.start)}`;
      break;
    default:
      return null;
  }

  return (
    <EventTooltip
      trigger={
        <div
          className={cn(
            "absolute top-1/2 z-20 p-1 rounded-full shadow-md flex items-center justify-center",
            "hover:z-30 hover:scale-125 hover:-translate-y-1 transition-transform duration-150 ease-in-out",
            iconBgColor,
            iconFgColor,
            specificBorder
          )}
          style={{
            left: `${event.positionStartPercent}%`,
            transform: 'translate(-50%, -50%)'
          }}
          aria-label={tooltipContent}
        >
          {iconElement}
        </div>
      }
      content={<p className="text-xs">{tooltipContent}</p>}
    />
  );
}
