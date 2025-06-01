import { useState } from 'react';
import { Calendar, CalendarDays, Check, Clock, Clock3, Download, CirclePlus, X } from 'lucide-react';

const Leaves = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Mock data
  const leaveBalances = [
    { type: 'Casual Leave', used: 3, total: 12, color: 'green' },
    { type: 'Sick Leave', used: 2, total: 10, color: 'blue' },
    { type: 'Earned Leave', used: 5, total: 15, color: 'purple' },
  ];
  
  const leaveRequests = [
    { id: 1, type: 'Casual Leave', startDate: '2025-06-05', endDate: '2025-06-06', reason: 'Personal work', status: 'Approved' },
    { id: 2, type: 'Sick Leave', startDate: '2025-06-15', endDate: '2025-06-15', reason: 'Doctor appointment', status: 'Pending' },
    { id: 3, type: 'Earned Leave', startDate: '2025-07-10', endDate: '2025-07-14', reason: 'Vacation', status: 'Rejected' },
  ];
  
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeaveForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally submit the form data
    setShowApplyForm(false);
    // Reset form
    setLeaveForm({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    });
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Check size={14} className="mr-1" />;
      case 'Pending':
        return <Clock3 size={14} className="mr-1" />;
      case 'Rejected':
        return <X size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // Simplified calendar view (in a real app, you'd use a proper calendar library)
  const renderCalendar = () => {
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Leave Management</h1>
        <button
          onClick={() => setShowApplyForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <CirclePlus size={16} />
          <span>Apply for Leave</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {leaveBalances.map((balance, index) => (
          <div 
            key={index} 
            className="card p-4 flex flex-col items-center"
          >
            <h3 className="text-lg font-medium mb-2">{balance.type}</h3>
            <div className="flex items-end">
              <span className="text-3xl font-bold mr-1">{balance.used}</span>
              <span className="text-gray-500 dark:text-gray-400">/ {balance.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className={`bg-${balance.color}-500 h-2 rounded-full`} 
                style={{ width: `${(balance.used / balance.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {balance.total - balance.used} days remaining
            </p>
          </div>
        ))}
        
        <div className="card p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-center mb-2">Need more leaves?</p>
          <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
            Request Special Leave
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'calendar'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarDays size={16} className="mr-2" />
            Calendar View
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'list'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('list')}
          >
            <Calendar size={16} className="mr-2" />
            Leave Requests
          </button>
        </div>
      </div>
      
      {activeTab === 'calendar' ? (
        renderCalendar()
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {request.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {showApplyForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Apply for Leave</h2>
              <button 
                onClick={() => setShowApplyForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Leave Type
                </label>
                <select
                  name="type"
                  value={leaveForm.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={leaveForm.startDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={leaveForm.endDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={leaveForm.reason}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;
