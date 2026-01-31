import { addDays, addHours, startOfDay, startOfWeek, subDays } from 'date-fns';
import { CalendarEvent } from '@/types';

export const generateSampleEvents = (): CalendarEvent[] => {
  const today = startOfDay(new Date());
  const startOfCurrentWeek = startOfWeek(today);

  return [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly sync with the engineering team.',
      start: addHours(today, 10),
      end: addHours(today, 11),
      color: 'blue',
    },
    {
      id: '2',
      title: 'Lunch with Sarah',
      start: addHours(today, 12),
      end: addHours(today, 13),
      color: 'green',
    },
    {
      id: '3',
      title: 'Project Deadline',
      description: 'Final submission for the Q3 project.',
      start: addHours(addDays(today, 2), 17),
      end: addHours(addDays(today, 2), 18),
      color: 'red',
    },
    {
      id: '4',
      title: 'Code Review',
      start: addHours(subDays(today, 1), 14),
      end: addHours(subDays(today, 1), 15.5),
      color: 'purple',
    },
    {
      id: '5',
      title: 'Client Call',
      start: addHours(addDays(startOfCurrentWeek, 1), 9),
      end: addHours(addDays(startOfCurrentWeek, 1), 10.5),
      color: 'yellow',
    },
    {
      id: '6',
      title: 'Gym',
      start: addHours(today, 18),
      end: addHours(today, 19.5),
      color: 'indigo',
    },
    {
      id: '7',
      title: 'Dentist Appointment',
      start: addHours(addDays(today, 4), 8),
      end: addHours(addDays(today, 4), 9),
      color: 'pink',
    },
  ];
};
