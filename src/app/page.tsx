
import { sessionData } from '@/lib/session-data';
import type { SessionData } from '@/lib/types';
import { parseISO, getDurationInMilliseconds } from '@/lib/datetime-utils';
import { TimelineHeader } from '@/components/session-timeline/timeline-header';
import { ParticipantRow } from '@/components/session-timeline/participant-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FooterContent } from '@/components/layout/footer-content';

export default function SessionTimelinePage() {
  const data: SessionData = sessionData;

  if (!data || !data.participantArray) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Session data loading or unavailable.</p>
      </div>
    );
  }

  const sessionStartTime = parseISO(data.start);
  const sessionEndTime = parseISO(data.end);

  if (isNaN(sessionStartTime.getTime()) || isNaN(sessionEndTime.getTime())) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <p className="text-xl text-destructive">Error: Invalid session start or end time found in data.</p>
      </div>
    );
  }

  const totalSessionDurationMs = getDurationInMilliseconds(sessionStartTime, sessionEndTime);

  if (isNaN(totalSessionDurationMs) || totalSessionDurationMs <= 0) {
     return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <p className="text-xl text-destructive">Error: Could not calculate a valid session duration. Please check session start/end times.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 w-full">
      <header className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary">SessionLens</h1>
        <p className="text-muted-foreground mt-1">Meeting ID: {data.meetingId}</p>
      </header>

      <Card className="shadow-xl w-full max-w-full">
        <CardHeader className="py-4 px-4 md:px-6 sticky top-0 bg-card/95 backdrop-blur-sm z-30 border-b">
          <div className="max-w-7xl mx-auto">
            <CardTitle className="text-xl">Session Timeline</CardTitle>
          </div>
          <TimelineHeader
            sessionStartTime={sessionStartTime}
            sessionEndTime={sessionEndTime}
            totalSessionDurationMs={totalSessionDurationMs}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-220px)] md:h-[calc(100vh-240px)] w-full">
            <div className="px-4 md:px-6 pb-4">
              {data.participantArray.map((participant) => (
                <ParticipantRow
                  key={participant.participantId}
                  participant={participant}
                  sessionStartTime={sessionStartTime}
                  sessionEndTime={sessionEndTime}
                  totalSessionDurationMs={totalSessionDurationMs}
                />
              ))}
              {data.participantArray.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  No participants.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-sm text-muted-foreground max-w-7xl mx-auto">
        <FooterContent />
      </footer>
    </div>
  );
}
