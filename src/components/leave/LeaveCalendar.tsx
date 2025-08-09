import { Download, ChevronLeft, ChevronRight } from 'lucide-react'; // Added Chevron icons
import { LeaveRequest } from '../leave/types';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
  month: number; // 0-11 (JavaScript months)
  year: number;
  onMonthChange: (newMonth: number, newYear: number) => void; // Add this prop
}

const LeaveCalendar = ({ leaveRequests, month, year, onMonthChange }: LeaveCalendarProps) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePreviousMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    onMonthChange(newMonth, newYear);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    onMonthChange(newMonth, newYear);
  };

  const isSameDayOrInRange = (current: Date, start: Date, end: Date) => {
    const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return currentDate >= startDate && currentDate <= endDate;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePreviousMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-medium">
            {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
          </h3>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Rest of your calendar component remains the same */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const current = new Date(year, month, day);
          const matchingLeave = leaveRequests.find(leave =>
            isSameDayOrInRange(current, new Date(leave.startDate), new Date(leave.endDate))
          );

          return (
            <div
              key={day}
              data-tooltip-id="leave-tooltip"
              data-tooltip-content={matchingLeave?.reason || ''}
              className={`p-2 h-16 border border-gray-200 dark:border-gray-700 rounded-lg ${
                matchingLeave
                  ? matchingLeave.status === 'Approved'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : matchingLeave.status === 'Pending'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                  : ''
              }`}
            >
              <div className="text-sm">{day}</div>
              {matchingLeave && (
                <div className="mt-1">
                  <span className={`text-xs px-1 py-0.5 rounded ${getStatusColor(matchingLeave.status)}`}>
                    {matchingLeave.status}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Tooltip id="leave-tooltip" place="top" effect="solid" className="z-50 max-w-xs" />
    </div>
  );
};

export default LeaveCalendar;