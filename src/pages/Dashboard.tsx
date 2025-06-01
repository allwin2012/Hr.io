import { Award, Bookmark, Calendar, SquareCheck } from 'lucide-react';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsCard from '../components/dashboard/StatsCard';
import LeaveChart from '../components/dashboard/LeaveChart';
import SalaryChart from '../components/dashboard/SalaryChart';
import TeamCard from '../components/dashboard/TeamCard';
import AlertsCard from '../components/dashboard/AlertsCard';
import KudosCard from '../components/dashboard/KudosCard';

const Dashboard = () => {
  // Mock data
  const leaveChartData = [
    { name: 'Used', value: 8, color: '#32CD32' },
    { name: 'Planned', value: 4, color: '#FFA500' },
    { name: 'Remaining', value: 12, color: '#1E90FF' },
  ];
  
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
  
  const manager = {
    id: 1,
    name: 'Jane Smith',
    role: 'HR Director'
  };
  
  const teamMembers = [
    { id: 2, name: 'Alex Johnson', role: 'UI Designer' },
    { id: 3, name: 'Sam Williams', role: 'Frontend Developer' },
    { id: 4, name: 'Taylor Brown', role: 'Product Manager' },
  ];
  
  const alerts = [
    { 
      id: 1, 
      title: 'ID Card Expiring Soon', 
      message: 'Your company ID card will expire in 30 days. Please renew it.',
      type: 'document',
      dueDate: 'June 30, 2025'
    },
    { 
      id: 2, 
      title: 'Performance Review', 
      message: 'Your quarterly performance review is scheduled for next week.',
      type: 'appraisal',
      dueDate: 'June 7, 2025'
    },
    { 
      id: 3, 
      title: 'Project Deadline', 
      message: 'The UI redesign project is due in 3 days.',
      type: 'task',
      dueDate: 'June 2, 2025'
    },
  ];

  const kudos = [
    {
      id: 1,
      message: 'Thanks for helping with the design review yesterday. Your insights were invaluable!',
      from: 'Alex Johnson',
      date: 'May 29, 2025',
      type: 'appreciation'
    },
    {
      id: 2,
      message: 'Outstanding work on the new dashboard UI. The clients loved it!',
      from: 'Jane Smith',
      date: 'May 20, 2025',
      type: 'excellence'
    },
    {
      id: 3,
      message: 'Great teamwork on the product launch. Couldn\'t have done it without you.',
      from: 'Taylor Brown',
      date: 'May 15, 2025',
      type: 'teamwork'
    }
  ];

  return (
    <div className="space-y-6">
      <WelcomeCard name="Michael" role="Senior UI Designer" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Pending Tasks" 
          value={5} 
          icon={<SquareCheck size={20} />} 
          trend={{ value: "2 more", positive: false }}
        />
        <StatsCard 
          title="Leave Balance" 
          value="12 days" 
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
        <TeamCard manager={manager} members={teamMembers} />
        <AlertsCard alerts={alerts} />
        <KudosCard kudos={kudos} />
      </div>
    </div>
  );
};

export default Dashboard;
