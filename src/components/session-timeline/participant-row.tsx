
"use client";

import type { Participant } from '@/lib/types';
import { TimelineTrack } from './timeline-track';
import { parseISO, formatDetailedDateTime, formatDurationInMinutes, getDurationInMilliseconds } from '@/lib/datetime-utils';
import { isValid } from 'date-fns';

interface ParticipantRowProps {
  participant: Participant;
  sessionStartTime: Date;
  sessionEndTime: Date;
  totalSessionDurationMs: number;
}

export function ParticipantRow({ participant, sessionStartTime, sessionEndTime, totalSessionDurationMs }: ParticipantRowProps) {

  let firstJoinTime = sessionStartTime;
  if (Array.isArray(participant.timelog) && participant.timelog.length > 0 && participant.timelog[0]) {
    const parsedFirstJoin = parseISO(participant.timelog[0].start);
    if (isValid(parsedFirstJoin)) {
      firstJoinTime = parsedFirstJoin;
    }
  }

  const participantTotalDurationMs = Array.isArray(participant.timelog)
    ? participant.timelog.reduce((total, log) => {
        if (log && typeof log.start === 'string' && typeof log.end === 'string') {
          const logStart = parseISO(log.start);
          const logEnd = parseISO(log.end);
          if (isValid(logStart) && isValid(logEnd)) {
            const duration = getDurationInMilliseconds(logStart, logEnd);
            return total + duration;
          }
        }
        return total;
      }, 0)
    : 0;

  return (
    <div className="flex flex-col py-3 border-b border-border last:border-b-0">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-foreground">
          {participant.name || 'Unknown Participant'} ({participant.participantId || 'N/A'})
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatDetailedDateTime(firstJoinTime)} | {formatDurationInMinutes(participantTotalDurationMs)}
        </p>
      </div>
      <div className="flex-grow">
        <TimelineTrack
          participant={participant}
          sessionStartTime={sessionStartTime}
          sessionEndTime={sessionEndTime}
          totalSessionDurationMs={totalSessionDurationMs}
        />
      </div>
    </div>
  );
}
