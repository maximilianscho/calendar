import React, { useState, useEffect } from 'react';
import { CalendarEvent, EVENT_COLORS } from '@/types';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { FiX, FiClock, FiAlignLeft, FiTrash2 } from 'react-icons/fi';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  initialEvent?: Partial<CalendarEvent>;
  selectedDate?: Date;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialEvent,
  selectedDate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<CalendarEvent['color']>('blue');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (initialEvent) {
        setTitle(initialEvent.title || '');
        setDescription(initialEvent.description || '');
        setColor(initialEvent.color || 'blue');
        // Format for datetime-local input
        const s = initialEvent.start || selectedDate || new Date();
        const e = initialEvent.end || new Date(s.getTime() + 60 * 60 * 1000); // Default 1 hour
        setStart(format(s, "yyyy-MM-dd'T'HH:mm"));
        setEnd(format(e, "yyyy-MM-dd'T'HH:mm"));
      } else {
        // Defaults
        setTitle('');
        setDescription('');
        setColor('blue');
        const s = selectedDate || new Date();
        const e = new Date(s.getTime() + 60 * 60 * 1000);
        setStart(format(s, "yyyy-MM-dd'T'HH:mm"));
        setEnd(format(e, "yyyy-MM-dd'T'HH:mm"));
      }
    }
  }, [isOpen, initialEvent, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initialEvent as CalendarEvent),
      title,
      description,
      color,
      start: new Date(start),
      end: new Date(end),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl transition-all">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">
            {initialEvent?.id ? 'Edit Event' : 'Create Event'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 text-gray-500"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-semibold border-0 border-b-2 border-gray-200 px-0 py-2 focus:border-blue-500 focus:ring-0 placeholder:text-gray-400"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Start</label>
              <div className="flex items-center text-gray-700 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
                <FiClock className="mr-2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="bg-transparent border-0 p-0 focus:ring-0 w-full text-sm"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">End</label>
              <div className="flex items-center text-gray-700 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
                <FiClock className="mr-2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="bg-transparent border-0 p-0 focus:ring-0 w-full text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Description</label>
            <div className="flex items-start text-gray-700 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              <FiAlignLeft className="mr-2 mt-1 text-gray-400 shrink-0" />
              <textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent border-0 p-0 focus:ring-0 w-full text-sm resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500">Color</label>
            <div className="flex space-x-2">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-6 h-6 rounded-full focus:outline-none ring-2 ring-offset-2',
                    color === c ? 'ring-gray-400' : 'ring-transparent',
                    {
                      'bg-blue-500': c === 'blue',
                      'bg-red-500': c === 'red',
                      'bg-green-500': c === 'green',
                      'bg-yellow-500': c === 'yellow',
                      'bg-purple-500': c === 'purple',
                      'bg-indigo-500': c === 'indigo',
                      'bg-pink-500': c === 'pink',
                    }
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 mt-2">
             {initialEvent?.id && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this event?')) {
                    onDelete(initialEvent.id!);
                    onClose();
                  }
                }}
                className="mr-auto text-red-600 hover:bg-red-50 p-2 rounded-md"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
