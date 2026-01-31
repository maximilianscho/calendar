export type ViewMode = 'month' | 'week' | 'day';

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'indigo' | 'pink';
};

export const EVENT_COLORS: CalendarEvent['color'][] = ['blue', 'red', 'green', 'yellow', 'purple', 'indigo', 'pink'];
