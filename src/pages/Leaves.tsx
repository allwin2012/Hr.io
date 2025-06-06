import { useEffect, useState } from 'react';
import { CalendarDays, Calendar, CirclePlus } from 'lucide-react';
import LeaveBalances from '../components/leave/Balances';
import LeaveCalendar from '../components/leave/LeaveCalendar';
import LeaveList from '../components/leave/LeaveList';
import LeaveApplyForm from '../components/leave/ApplyForm';
import { LeaveBalance, LeaveRequest, LeaveForm } from '../components/leave/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Leaves = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Mock data
  const leaveBalances: LeaveBalance[] = [
    { type: 'Casual Leave', used: 3, total: 12, color: 'green' },
    { type: 'Sick Leave', used: 2, total: 10, color: 'blue' },
    { type: 'Earned Leave', used: 5, total: 15, color: 'purple' },
  ];
  
 
  const [leaveForm, setLeaveForm] = useState<LeaveForm>({
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
  
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const fetchLeaves = async () => {
    const res = await fetch(`${API_BASE_URL}/api/leave/my-requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    setLeaveRequests(data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  
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
      
      <LeaveBalances balances={leaveBalances} />
      
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
        <LeaveCalendar leaveRequests={leaveRequests} />
      ) : (
        <LeaveList leaveRequests={leaveRequests} />
      )}
      
      <LeaveApplyForm 
        show={showApplyForm} 
        form={leaveForm}
        onClose={() => setShowApplyForm(false)}
        onChange={handleFormChange}
        refreshLeaves={fetchLeaves}
      />
    </div>
  );
};

export default Leaves;