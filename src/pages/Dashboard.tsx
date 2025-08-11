import { useEffect, useState } from 'react';
import { Award, Bookmark, Calendar, SquareCheck } from 'lucide-react';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsCard from '../components/dashboard/StatsCard';
import LeaveChart from '../components/dashboard/LeaveChart';
import SalaryChart from '../components/dashboard/SalaryChart';
import TeamCard from '../components/dashboard/TeamCard';
import AlertsCard from '../components/dashboard/AlertsCard';
import KudosCard from '../components/dashboard/KudosCard';
import { useSnackbar } from '../contexts/SnackbarContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const { showSnackbar } = useSnackbar(); 
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveChartData, setLeaveChartData] = useState([]);

  const userName = localStorage.getItem('userName') || 'User';
  const role = localStorage.getItem('userRole') || 'Employee';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leave requests
        const resRequests = await fetch(`${API_BASE_URL}/api/leave/my-requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const requestsData = await resRequests.json();
        setLeaveRequests(requestsData);
  
        // Fetch leave balances
        const resBalances = await fetch(`${API_BASE_URL}/api/leave/balances`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const balancesData = await resBalances.json();
        setLeaveBalances(balancesData);
  
        // Calculate chart values
        const today = new Date();
  
        // Approved leaves already taken (past or today)
        const used = requestsData.filter(
          l => new Date(l.startDate) <= today && l.status === 'Approved'
        ).length;
  
        // Leaves that are still pending approval
        const pending = requestsData.filter(
          l => l.status === 'Pending'
        ).length;
  
        // Handle both array & object responses for balances
        const totalAllocated = (Array.isArray(balancesData) ? balancesData : Object.values(balancesData))
          .reduce((sum, b: any) => sum + (b.total || 0), 0);
  
        const totalUsedFromBalances = (Array.isArray(balancesData) ? balancesData : Object.values(balancesData))
          .reduce((sum, b: any) => sum + (b.used || 0), 0);
  
        const remaining = totalAllocated - totalUsedFromBalances;
  
        setLeaveChartData([
          { name: 'Used', value: used, color: '#32CD32' },
          { name: 'Pending', value: pending, color: '#FFA500' },
          { name: 'Remaining', value: remaining, color: '#1E90FF' },
        ]);
      } catch (err) {
        showSnackbar('Error fetching leave data', err);
        console.error('Error fetching leave data:', err);
      }
    };
  
    fetchData();
  }, []);
  

  const salaryChartData = [
    { month: 'Jan', salary: 5000 },
    { month: 'Feb', salary: 5000 },
    { month: 'Mar', salary: 5000 },
    { month: 'Apr', salary: 5200 },
    { month: 'May', salary: 5200 },
    { month: 'Jun', salary: 5200 },
    { month: 'Jul', salary: 5500 },
    { month: 'Aug', salary: 5500 },
  ];

  const alerts = [
    { id: 1, title: 'ID Card Expiring Soon', message: 'Your company ID card will expire in 30 days. Please renew it.', type: 'document', dueDate: 'June 30, 2025' },
    { id: 2, title: 'Performance Review', message: 'Your quarterly performance review is scheduled for next week.', type: 'appraisal', dueDate: 'June 7, 2025' },
    { id: 3, title: 'Project Deadline', message: 'The UI redesign project is due in 3 days.', type: 'task', dueDate: 'June 2, 2025' },
  ];

  const kudos = [
    { id: 1, message: 'Thanks for helping with the design review yesterday. Your insights were invaluable!', from: 'Alex Johnson', date: 'May 29, 2025', type: 'appreciation' },
    { id: 2, message: 'Outstanding work on the new dashboard UI. The clients loved it!', from: 'Jane Smith', date: 'May 20, 2025', type: 'excellence' },
    { id: 3, message: 'Great teamwork on the product launch. Couldn\'t have done it without you.', from: 'Taylor Brown', date: 'May 15, 2025', type: 'teamwork' },
  ];

  return (
    <div className="space-y-6">
      <WelcomeCard name={userName} role={role} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Pending Tasks" 
          value={5} 
          icon={<SquareCheck size={20} />} 
          trend={{ value: "2 more", positive: false }}
        />
        <StatsCard 
          title="Leave Balance" 
          value={`${leaveBalances.reduce((total, balance: any) => total + (balance.total - balance.used), 0)} days`}
          icon={<Calendar size={20} />} 
          trend={{ value: "3 days", positive: true }}
        />
        <StatsCard 
          title="Kudos Received" 
          value={8} 
          icon={<Award size={20} />}
          trend={{ value: "40%", positive: true }}
        />
        <StatsCard 
          title="Upcoming Holidays" 
          value={2} 
          icon={<Bookmark size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeaveChart data={leaveChartData} />
        <SalaryChart data={salaryChartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TeamCard />
        <AlertsCard alerts={alerts} />
        <KudosCard kudos={kudos} />
      </div>
    </div>
  );
};

export default Dashboard;
