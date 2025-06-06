import { Download } from 'lucide-react';
import { LeaveRequest } from '../leave/types';

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
}

const LeaveCalendar = ({ leaveRequests }: LeaveCalendarProps) => {
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
        <h3 className="text-lg font-medium">June 2025</h3>
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Download size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 30 }).map((_, index) => {
          const day = index + 1;
          const isLeaveDay = leaveRequests.some(
            leave => {
              const start = new Date(leave.startDate);
              const end = new Date(leave.endDate);
              const current = new Date(`2025-06-${day}`);
              return current >= start && current <= end;
            }
          );
          
          const getLeaveStatus = () => {
            const leave = leaveRequests.find(
              leave => {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                const current = new Date(`2025-06-${day}`);
                return current >= start && current <= end;
              }
            );
            return leave ? leave.status : null;
          };
          
          const leaveStatus = getLeaveStatus();
          
          return (
            <div 
              key={day}
              className={`p-2 h-16 border border-gray-200 dark:border-gray-700 rounded-lg ${isLeaveDay ? 
                leaveStatus === 'Approved' ? 'bg-green-50 dark:bg-green-900/20' : 
                leaveStatus === 'Pending' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                'bg-red-50 dark:bg-red-900/20' : ''}`}
            >
              <div className="text-sm">{day}</div>
              {isLeaveDay && (
                <div className="mt-1">
                  <span className={`text-xs px-1 py-0.5 rounded ${getStatusColor(leaveStatus || '')}`}>
                    {leaveStatus}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveCalendar;