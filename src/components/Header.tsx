import React from 'react';
import { format } from 'date-fns';
import { ViewMode } from '@/types';
import { cn } from '@/utils/cn';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

interface HeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onChangeView: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onChangeView,
}) => {
  const dateFormat = viewMode === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy';

  return (
    <header className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-blue-600">
          <FiCalendar className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
            Calendar
          </h1>
        </div>
        <div className="flex items-center rounded-md border border-gray-300 bg-white shadow-sm">
          <button
            onClick={onPrev}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-md border-r border-gray-300"
            aria-label="Previous"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-md border-l border-gray-300"
            aria-label="Next"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 min-w-[150px]">
          {format(currentDate, dateFormat)}
        </h2>
      </div>

      <div className="flex items-center rounded-md bg-gray-100 p-1">
        {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onChangeView(mode)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md capitalize transition-all',
              viewMode === mode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </header>
  );
};
