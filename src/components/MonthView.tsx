import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  isToday,
} from 'date-fns';
import { CalendarEvent } from '@/types';
import { cn } from '@/utils/cn';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  const getColorClasses = (color: CalendarEvent['color']) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'indigo': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow ring-1 ring-gray-200">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
        {weekDays.map((day) => (
          <div key={day} className="py-2 bg-white">
            {day}
          </div>
        ))}
      </div>
      <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            
            return (
              <div
                key={day.toString()}
                onClick={() => onDateClick(day)}
                className={cn(
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                  'relative px-3 py-2 min-h-[120px] hover:bg-gray-50 cursor-pointer transition-colors group'
                )}
              >
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={cn(
                    isToday(day)
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 font-semibold text-white'
                      : undefined
                  )}
                >
                  {format(day, 'd')}
                </time>
                <ol className="mt-2 space-y-1">
                  {dayEvents.map((event) => (
                    <li key={event.id}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={cn(
                          'w-full text-left truncate rounded px-1.5 py-0.5 text-xs font-medium border',
                          getColorClasses(event.color)
                        )}
                      >
                        {format(event.start, 'h:mma')} {event.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
        {/* Mobile View (simplified stack) */}
         <div className="w-full lg:hidden grid grid-cols-1 gap-px bg-gray-200">
            {calendarDays.map((day) => {
                 if (!isSameMonth(day, monthStart)) return null;
                 const dayEvents = getEventsForDay(day);
                 return (
                     <div key={day.toString()} className="bg-white px-4 py-4 min-h-[80px]" onClick={() => onDateClick(day)}>
                         <time
                             dateTime={format(day, 'yyyy-MM-dd')}
                             className={cn(
                                 "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                                 isToday(day) ? "bg-blue-600 text-white" : "text-gray-900"
                             )}
                         >
                             {format(day, 'd')}
                         </time>
                         <ol className="mt-2 space-y-2">
                             {dayEvents.map(event => (
                                 <li key={event.id} onClick={(e) => {
                                     e.stopPropagation();
                                     onEventClick(event);
                                 }}>
                                    <div className={cn("px-2 py-1 rounded border text-sm", getColorClasses(event.color))}>
                                        <span className="font-semibold">{format(event.start, 'h:mma')}</span> {event.title}
                                    </div>
                                 </li>
                             ))}
                         </ol>
                     </div>
                 )
            })}
         </div>
      </div>
    </div>
  );
};
