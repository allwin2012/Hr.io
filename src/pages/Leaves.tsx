  import { useEffect, useState } from 'react';
  import { CalendarDays, Calendar, CirclePlus, Check } from 'lucide-react';
  import LeaveBalances from '../components/leave/Balances';
  import LeaveCalendar from '../components/leave/LeaveCalendar';
  import LeaveList from '../components/leave/LeaveList';
  import LeaveApplyForm from '../components/leave/ApplyForm';
  import { LeaveBalance, LeaveRequest, LeaveForm } from '../components/leave/types';
  import LeaveReviewList from '../components/leave/LeaveReviewList';
  import { useSnackbar } from '../contexts/SnackbarContext';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const Leaves = () => {
    const [activeTab, setActiveTab] = useState<'calendar' | 'review' | 'list'>('calendar');
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
    const { showSnackbar } = useSnackbar();
    //for calendar view
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-11
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    
    
    //handle month change
    const handleMonthChange = (newMonth: number, newYear: number) => {
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    };


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
    const [reviewRequests, setReviewRequests] = useState<LeaveRequest[]>([]);

    //fetch leaves
    const fetchLeaves = async () => {
      const res = await fetch(`${API_BASE_URL}/api/leave/my-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setLeaveRequests(data);
    };

    //fetch leave balances
    useEffect(() => {
      const fetchLeaveBalances = async () => {
        const res = await fetch(`${API_BASE_URL}/api/leave/balances`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
    
        // Transform Map to array with color for UI
        const mapped = Object.entries(data).map(([type, balance]) => ({
          type,
          ...(balance as { used: number; total: number }),
          color:
            type === 'Casual Leave' ? 'green' :
            type === 'Sick Leave' ? 'blue' :
            type === 'Earned Leave' ? 'purple' :
            'gray'
        }));
    
        setLeaveBalances(mapped);
      };
    
      fetchLeaveBalances();
    }, []);
    

    useEffect(() => {
      if (activeTab === 'review') {
        fetchReviewRequests();
      }
    }, [activeTab]);
    
    useEffect(() => {
      fetchLeaves();
    }, []);

    //fetch review requests
    const fetchReviewRequests = async () => {
      const res = await fetch(`${API_BASE_URL}/api/leave/requests-to-review`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setReviewRequests(data);
    };

    //handle status change
    const handleStatusChange = async (
      id: string,
      status: 'Approved' | 'Rejected',
      comment?: string
    ) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leave/update-status/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status, comment }),
        });
        if (!res.ok) throw new Error('Failed to update leave status');
        showSnackbar(`Leave ${status.toLowerCase()} successfully`, 'success');
        fetchReviewRequests(); // refresh
      } catch (err) {
        console.error(err);
        showSnackbar('Error updating leave status', 'error');
      }
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

        <LeaveBalances balances={leaveBalances} />

        <div className="mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'calendar'
                  ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              onClick={() => setActiveTab('calendar')}
            >
              <CalendarDays size={16} className="mr-2" />
              Calendar View
            </button>

            <button
              className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'review'
                  ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              onClick={() => setActiveTab('review')}
            >
              <Check size={16} className="mr-2" />
              Review Requests
            </button>

            <button
              className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'list'
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

        {activeTab === 'calendar' && <LeaveCalendar leaveRequests={leaveRequests} 
         month={selectedMonth} 
         year={selectedYear}
         onMonthChange={handleMonthChange}
        />}
        {activeTab === 'review' && <LeaveReviewList leaveRequests={reviewRequests} onStatusChange={handleStatusChange} />}
  {activeTab === 'list' && <LeaveList leaveRequests={leaveRequests} />}


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