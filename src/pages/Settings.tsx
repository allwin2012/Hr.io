import { useState } from 'react';
import { Bell, Eye, EyeOff, Key, LogOut, Moon, Save, Sun, User } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  
  const [accountForm, setAccountForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    leaveUpdates: true,
    taskReminders: true,
    documentExpiry: true,
    teamUpdates: false,
    salaryUpdates: true,
    holidays: true,
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  });
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const togglePasswordVisibility = () => {
    setAccountForm(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // This would normally update the app's theme state
    localStorage.setItem('theme', newTheme);
    
    // In a real app, this would trigger the theme change in App.tsx
    // For demo purposes, we're simulating the effect
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--color-primary', '#32CD32');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--color-primary', '#228B22');
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would validate and submit the password change
    alert('Password change functionality would be implemented here');
    setAccountForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
    });
  };
  
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save notification preferences
    alert('Notification preferences saved!');
  };
  
  const handleLogout = () => {
    // Here you would implement logout functionality
    alert('Logout functionality would be implemented here');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="card p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'account'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <User size={18} className="mr-3" />
                Account
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bell size={18} className="mr-3" />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'appearance'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Sun size={18} className="mr-3" />
                Appearance
              </button>
              
              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {activeTab === 'account' && (
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-6 text-gray-800 dark:text-white">Account Security</h2>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={accountForm.showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={accountForm.currentPassword}
                        onChange={handleAccountChange}
                        className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {accountForm.showPassword ? (
                          <EyeOff size={16} className="text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={accountForm.showPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={accountForm.newPassword}
                        onChange={handleAccountChange}
                        className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Password must be at least 8 characters and include a number and special character.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={accountForm.showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={accountForm.confirmPassword}
                        onChange={handleAccountChange}
                        className="w-full pl-10 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" className="btn btn-primary">
                      Change Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-6 text-gray-800 dark:text-white">Notification Preferences</h2>
              
              <form onSubmit={handleNotificationSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Delivery Methods</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="email"
                          checked={notifications.email}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Email Notifications</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="browser"
                          checked={notifications.browser}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Browser Notifications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Notification Types</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="leaveUpdates"
                          checked={notifications.leaveUpdates}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Leave Request Updates</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="taskReminders"
                          checked={notifications.taskReminders}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Task Reminders</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="documentExpiry"
                          checked={notifications.documentExpiry}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Document Expiry Alerts</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="teamUpdates"
                          checked={notifications.teamUpdates}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Team Updates</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="salaryUpdates"
                          checked={notifications.salaryUpdates}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Salary Updates</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="holidays"
                          checked={notifications.holidays}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Holiday Reminders</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" className="btn btn-primary flex items-center">
                      <Save size={16} className="mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-6 text-gray-800 dark:text-white">Appearance</h2>
              
              <div>
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">Theme</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      theme === 'light' 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Sun size={20} className="text-yellow-500 mr-2" />
                        <h4 className="font-medium text-gray-800 dark:text-white">Light Mode</h4>
                      </div>
                      <div className="h-4 w-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                        {theme === 'light' && (
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-md p-2 h-20 flex items-center justify-center">
                      <span className="text-gray-800 text-xs">Preview Light Mode</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      theme === 'dark' 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Moon size={20} className="text-indigo-400 mr-2" />
                        <h4 className="font-medium text-gray-800 dark:text-white">Dark Mode</h4>
                      </div>
                      <div className="h-4 w-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                        {theme === 'dark' && (
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-md p-2 h-20 flex items-center justify-center">
                      <span className="text-white text-xs">Preview Dark Mode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
