import { useState, useEffect } from 'react';
import { Bell, Menu, Search, LogOut } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  onLogout: () => void;
  darkMode: boolean;
}

const Navbar = ({ toggleSidebar, onLogout }: NavbarProps) => {
  const [userName, setUserName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm h-16 flex items-center px-4">
      <button
        onClick={toggleSidebar}
        className="mr-4 md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <Menu size={20} />
      </button>

      <div className="text-xl font-bold text-green-600 dark:text-green-400 mr-6 hidden md:block">
        HR Portal
      </div>

      <div className="relative flex-1 max-w-md hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-green-500 dark:text-gray-300"
        />
      </div>

      <div className="flex items-center ml-auto space-x-4">
        <button
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative"
          onClick={toggleNotifications}
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* <button
          onClick={toggleTheme}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}

        <div className="relative group">
  <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300">
      <span className="text-sm font-medium">{getInitials(userName || 'U')}</span>
    </div>
  </button>

  {/* Tooltip */}
  <div className="absolute bottom-[-35px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
    {userName || 'User'}
  </div>
</div>


        <button
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          aria-label="Log out"
        >
          <LogOut size={18} className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
