import { Link, useLocation } from 'react-router-dom';
import { Award, Calendar, DollarSign, FileText, LayoutDashboard, Settings, SquareCheck, User } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'My Profile' },
    { path: '/leaves', icon: Calendar, label: 'Leaves' },
    { path: '/tasks', icon: SquareCheck, label: 'Tasks' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/salary', icon: DollarSign, label: 'Salary' },
    { path: '/kudos', icon: Award, label: 'Kudos' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/hr-dashboard', icon: LayoutDashboard, label: 'HR Dashboard' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div className={`font-bold text-green-600 dark:text-green-400 ${collapsed ? 'text-xl' : 'text-2xl'}`}>
          {collapsed ? 'HR' : 'HR Portal'}
        </div>
      </div>
      
      <nav className="mt-4 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
