import React, { useEffect, useRef } from 'react';
import {
  format,
  isToday,
  isSameDay,
  differenceInMinutes,
  startOfDay,
  setHours,
  setMinutes,
} from 'date-fns';
import { CalendarEvent } from '@/types';
import { cn } from '@/utils/cn';

interface TimeGridProps {
  days: Date[];
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date) => void;
}

export const TimeGrid: React.FC<TimeGridProps> = ({
  days,
  events,
  onEventClick,
  onSlotClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 64; // px

  const [currentTime, setCurrentTime] = React.useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Scroll to 8 AM on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 8 * HOUR_HEIGHT;
    }
  }, []);

  const getCurrentTimePosition = () => {
    const minutes = differenceInMinutes(currentTime, startOfDay(currentTime));
    return (minutes / 60) * HOUR_HEIGHT;
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  const getEventStyle = (event: CalendarEvent) => {
    const startMinutes = differenceInMinutes(event.start, startOfDay(event.start));
    const durationMinutes = differenceInMinutes(event.end, event.start);
    
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = (durationMinutes / 60) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${Math.max(height, 20)}px`, // Minimum height for visibility
    };
  };

  const getColorClasses = (color: CalendarEvent['color']) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
      case 'red': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
      case 'green': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
      case 'indigo': return 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
    }
  };

  return (
    <div className="flex h-full flex-col bg-white rounded-lg shadow ring-1 ring-gray-200 overflow-hidden">
        {/* Header (Days) */}
      <div 
        className="flex flex-none border-b border-gray-200 bg-white shadow-sm overflow-hidden" 
        style={{ paddingLeft: '4rem' /* Match time column width */ }} 
      >
        <div className="flex w-full divide-x divide-gray-200">
            {days.map((day) => (
                <div key={day.toString()} className="flex-1 text-center py-3">
                    <span className="block text-xs uppercase text-gray-500 font-medium">
                        {format(day, 'EEE')}
                    </span>
                    <span
                        className={cn(
                            "mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                            isToday(day) ? "bg-blue-600 text-white" : "text-gray-900"
                        )}
                    >
                        {format(day, 'd')}
                    </span>
                </div>
            ))}
        </div>
      </div>

        {/* Scrollable Grid */}
      <div 
        ref={containerRef} 
        className="flex flex-auto overflow-y-auto"
      >
        <div className="w-full flex" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
            {/* Time Labels Column */}
            <div className="w-16 flex-none border-r border-gray-200 bg-white text-xs text-gray-500 text-right pr-2 pt-2 -mt-2.5">
                {hours.map((hour) => (
                    <div key={hour} style={{ height: `${HOUR_HEIGHT}px` }}>
                         <span className="sticky left-0 -mt-2.5">{hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}</span>
                    </div>
                ))}
            </div>

            {/* Days Columns */}
            <div className="flex w-full divide-x divide-gray-200">
                 {days.map((day) => (
                     <div key={day.toString()} className="relative flex-1 group">
                         {/* Background Grid Lines */}
                         {hours.map((hour) => (
                             <div 
                                key={hour} 
                                className="border-b border-gray-100" 
                                style={{ height: `${HOUR_HEIGHT}px` }}
                                onClick={() => {
                                    const date = setMinutes(setHours(day, hour), 0);
                                    onSlotClick(date);
                                }}
                             />
                         ))}
                         
                         {/* Events */}
                         {getEventsForDay(day).map((event) => (
                             <button
                                key={event.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick(event);
                                }}
                                className={cn(
                                    "absolute inset-x-1 overflow-hidden rounded border pl-1 text-xs leading-4 transition-colors z-10",
                                    getColorClasses(event.color)
                                )}
                                style={getEventStyle(event)}
                             >
                                 <p className="font-semibold text-left">{event.title}</p>
                                 <p className="text-left">{format(event.start, 'h:mm a')}</p>
                             </button>
                         ))}

                         {/* Current Time Indicator */}
                         {isSameDay(day, currentTime) && (
                            <div
                                className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                                style={{ top: `${getCurrentTimePosition()}px` }}
                            >
                                <div className="h-2.5 w-2.5 -ml-1.5 rounded-full bg-red-500" />
                                <div className="h-[2px] w-full bg-red-500 opacity-50" />
                            </div>
                         )}
                     </div>
                 ))}
            </div>
        </div>
      </div>
    </div>
  );
};
