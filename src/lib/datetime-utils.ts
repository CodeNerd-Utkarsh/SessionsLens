
import { format, differenceInMilliseconds, addMilliseconds as dateFnsAddMilliseconds, isValid } from 'date-fns';

export function parseISO(dateString: string): Date {
  return new Date(dateString);
}

export function getDurationInMilliseconds(start: Date, end: Date): number {
  if (!isValid(start) || !isValid(end)) {
    return 0;
  }
  const duration = differenceInMilliseconds(end, start);
  return isNaN(duration) ? 0 : duration;
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0 || isNaN(total) || isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, (value / total) * 100));
}

export function formatTime(date: Date, includeSeconds: boolean = true): string {
  if (!isValid(date)) {
    return "Invalid Time";
  }
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  if (includeSeconds) {
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
}

export function formatDurationForDisplay(ms: number): string {
  if (isNaN(ms) || typeof ms !== 'number') {
    return "Invalid Duration";
  }
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0 && seconds === 0 && ms > 0) {
    return "<1s";
  }
  return `${minutes}m ${seconds}s`;
}

export function addMilliseconds(date: Date, ms: number): Date {
  if (!isValid(date) || isNaN(ms) || typeof ms !== 'number') {
    return new Date(NaN);
  }
  return dateFnsAddMilliseconds(date, ms);
}

export function formatDetailedDateTime(date: Date): string {
  if (!isValid(date)) {
    return "Invalid Date";
  }
  return format(date, "dd MMMM yyyy, HH:mm");
}

export function formatDurationInMinutes(ms: number): string {
  if (isNaN(ms) || typeof ms !== 'number') {
    return "Invalid Duration";
  }
  const totalMinutes = Math.round(ms / (1000 * 60));
  return `Duration ${totalMinutes} Min${totalMinutes === 1 ? '' : 's'}`;
}
