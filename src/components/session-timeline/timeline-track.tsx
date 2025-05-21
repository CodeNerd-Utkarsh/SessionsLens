
"use client";

import type { Participant, ProcessedEvent } from '@/lib/types';
import { parseISO, getDurationInMilliseconds, calculatePercentage, formatTime } from '@/lib/datetime-utils';
import { TimelineEventMarker } from './timeline-event-marker';
import { isValid } from 'date-fns';

interface TimelineTrackProps {
  participant: Participant;
  sessionStartTime: Date;
  sessionEndTime: Date;
  totalSessionDurationMs: number;
}

export function TimelineTrack({ participant, sessionStartTime, sessionEndTime, totalSessionDurationMs }: TimelineTrackProps) {
  const processedEvents: ProcessedEvent[] = [];

  if (Array.isArray(participant.timelog)) {
    participant.timelog.forEach((log, index) => {
      if (!log || typeof log.start !== 'string') return;

      const start = parseISO(log.start);
      if (!isValid(start)) return;

      processedEvents.push({
        id: `${participant.participantId}-presence-${index}`,
        type: 'presence_start',
        start,
        participantId: participant.participantId,
        positionStartPercent: calculatePercentage(getDurationInMilliseconds(sessionStartTime, start), totalSessionDurationMs),
      });

      if (typeof log.end === 'string') {
        const logEnd = parseISO(log.end);
        if (!isValid(logEnd)) return;

        if (logEnd.getTime() < sessionEndTime.getTime()) {
            const isLastLogEntry = index === participant.timelog.length - 1;
            let hasSignificantGapBeforeNextLog = false;

            if (!isLastLogEntry && participant.timelog[index+1] && typeof participant.timelog[index+1].start === 'string') {
              const nextLogStart = parseISO(participant.timelog[index+1].start);
              if (isValid(nextLogStart)) {
                  hasSignificantGapBeforeNextLog = nextLogStart.getTime() > logEnd.getTime() + 1000;
              }
            }

            if (isLastLogEntry || hasSignificantGapBeforeNextLog) {
                processedEvents.push({
                    id: `${participant.participantId}-disconnect-${index}`,
                    type: 'disconnect',
                    start: logEnd,
                    participantId: participant.participantId,
                    positionStartPercent: calculatePercentage(getDurationInMilliseconds(sessionStartTime, logEnd), totalSessionDurationMs),
                });
            }
        }
      }
    });
  }


  if (participant.events && Array.isArray(participant.events.mic)) {
    participant.events.mic.forEach((micEvent, index) => {
      if (!micEvent || typeof micEvent.start !== 'string' || typeof micEvent.end !== 'string') return;
      const start = parseISO(micEvent.start);
      const end = parseISO(micEvent.end);
      if (!isValid(start) || !isValid(end)) return;

      processedEvents.push({
        id: `${participant.participantId}-mic-on-${index}`,
        type: 'mic_on',
        start,
        participantId: participant.participantId,
        positionStartPercent: calculatePercentage(getDurationInMilliseconds(sessionStartTime, start), totalSessionDurationMs),
      });
      processedEvents.push({
        id: `${participant.participantId}-mic-off-${index}`,
        type: 'mic_off',
        start: end,
        participantId: participant.participantId,
        positionStartPercent: calculatePercentage(getDurationInMilliseconds(sessionStartTime, end), totalSessionDurationMs),
      });
    });
  }

  if (participant.events && Array.isArray(participant.events.webcam)) {
    participant.events.webcam.forEach((webcamEvent, index) => {
      if (!webcamEvent || typeof webcamEvent.start !== 'string' || typeof webcamEvent.end !== 'string') return;
      const start = parseISO(webcamEvent.start);
      const end = parseISO(webcamEvent.end);
      if (!isValid(start) || !isValid(end)) return;

      processedEvents.push({
        id: `${participant.participantId}-webcam-on-${index}`,
        type: 'webcam_on',
        start,
        participantId: participant.participantId,
        positionStartPercent: calculatePercentage(getDurationInMilliseconds(sessionStartTime, start), totalSessionDurationMs),
      });
       processedEvents.push({
        id: `${participant.participantId}-webcam-off-${index}`,
        type: 'webcam_off',
        start: end,
        participantId: participant.participantId,
        positionStartPercent: calculatePercentage(getDurationInMilliseconds(sessionStartTime, end), totalSessionDurationMs),
      });
    });
  }

  if (participant.events && Array.isArray(participant.events.errors)) {
    participant.events.errors.forEach((errorEvent, index) => {
      if (!errorEvent || typeof errorEvent.start !== 'string') return;
      const start = parseISO(errorEvent.start);
      if (!isValid(start)) return;

      processedEvents.push({
        id: `${participant.participantId}-error-${index}`,
        type: 'error',
        start,
        message: errorEvent.message || "Unknown error",
        participantId: participant.participantId,
        positionStartPercent: calculatePercentage(getDurationInMilliseconds(sessionStartTime, start), totalSessionDurationMs),
      });
    });
  }

  processedEvents.sort((a, b) => {
    const timeDiff = a.start.getTime() - b.start.getTime();
    if (timeDiff !== 0) return timeDiff;
    if (a.type.endsWith('_off') && !b.type.endsWith('_off')) return 1;
    if (!a.type.endsWith('_off') && b.type.endsWith('_off')) return -1;
    return 0;
  });


  const sortedTimelogs = (Array.isArray(participant.timelog) ? participant.timelog.map(log => {
    if (!log || typeof log.start !== 'string' || typeof log.end !== 'string') return null;
    const logStart = parseISO(log.start);
    const logEnd = parseISO(log.end);
    if (!isValid(logStart) || !isValid(logEnd)) return null;
    return { start: logStart, end: logEnd };
  }).filter(log => log !== null) as {start: Date, end: Date}[] : [])
  .sort((a,b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="relative h-6 bg-[hsl(var(--participant-track-bg))] rounded-md my-0.5">
      {sortedTimelogs.map((log, index) => {
        const logStart = log.start;
        const logEnd = log.end;

        const offsetMs = getDurationInMilliseconds(sessionStartTime, logStart);
        const durationMs = getDurationInMilliseconds(logStart, logEnd);

        const safeDurationMs = Math.max(0, durationMs);

        const startPercent = calculatePercentage(offsetMs, totalSessionDurationMs);
        const widthPercent = calculatePercentage(safeDurationMs, totalSessionDurationMs);

        return (
          <div
            key={`${participant.participantId}-timelog-bar-${index}`}
            className="absolute h-[5px] bg-primary rounded"
            style={{
              left: `${startPercent}%`,
              width: `${widthPercent}%`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            title={`Active: ${formatTime(logStart)} - ${formatTime(logEnd)}`}
          >
          </div>
        );
      })}

      {processedEvents.map(event => (
          <TimelineEventMarker key={event.id} event={event} />
      ))}
    </div>
  );
}
