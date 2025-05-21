
export interface EventTimeRange {
  start: string;
  end: string;
}

export interface ErrorEvent {
  start: string;
  message: string;
}

export interface ParticipantEvents {
  mic?: EventTimeRange[];
  webcam?: EventTimeRange[];
  errors?: ErrorEvent[];
  screenShare?: EventTimeRange[];
  screenShareAudio?: EventTimeRange[];
}

export interface TimeLogEntry {
  start: string;
  end:string;
}

export interface Participant {
  participantId: string;
  name: string;
  events: ParticipantEvents;
  timelog: TimeLogEntry[];
}

export interface SessionData {
  meetingId: string;
  start: string;
  end: string;
  uniqueParticipantsCount: number;
  participantArray: Participant[];
}

export interface ProcessedEvent {
  id: string;
  type: 'mic_on' | 'mic_off' | 'webcam_on' | 'webcam_off' | 'error' | 'disconnect' | 'presence_start';
  start: Date;
  end?: Date;
  message?: string;
  participantId: string;
  positionStartPercent: number;
}
