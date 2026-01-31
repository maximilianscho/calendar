import { useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import { CalendarEvent, ViewMode } from '@/types';
import { generateSampleEvents } from '@/utils/calendar';
import { Header } from '@/components/Header';
import { MonthView } from '@/components/MonthView';
import { TimeGrid } from '@/components/TimeGrid';
import { EventModal } from '@/components/EventModal';

export function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handlePrev = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: CalendarEvent | Omit<CalendarEvent, 'id'>) => {
    if ('id' in eventData) {
      // Update existing
      setEvents((prev) =>
        prev.map((e) => (e.id === eventData.id ? (eventData as CalendarEvent) : e))
      );
    } else {
      // Create new
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Calculate days for TimeGrid (Week/Day views)
  const getDaysForView = () => {
    if (viewMode === 'day') {
      return [currentDate];
    }
    // week
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header
        currentDate={currentDate}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onChangeView={setViewMode}
      />
      
      <main className="flex-1 overflow-hidden p-4">
        {viewMode === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onDateClick={(date) => {
                // If clicking a date in month view, switch to day view or open modal?
                // Google Calendar switches to day view often, or creates event.
                // Let's create event for now to match requirement "drag-to-create" (simplified to click)
                handleDateClick(date);
            }}
          />
        ) : (
          <TimeGrid
            days={getDaysForView()}
            events={events}
            onEventClick={handleEventClick}
            onSlotClick={handleDateClick}
          />
        )}
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}
