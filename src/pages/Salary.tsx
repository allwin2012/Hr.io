import { useState } from 'react';
import { ArrowRight, Calendar, ChevronDown, ChevronUp, Download, LineChart, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Salary = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [showSalaryDetails, setShowSalaryDetails] = useState(false);
  
  // Mock data
  const currentSalary = {
    month: 'May 2025',
    basicPay: 5500,
    houseRentAllowance: 2200,
    conveyanceAllowance: 800,
    medicalAllowance: 1500,
    specialAllowance: 1000,
    grossSalary: 11000,
    incomeTax: 1650,
    professionalTax: 200,
    providentFund: 660,
    totalDeductions: 2510,
    netSalary: 8490,
    paymentDate: '2025-05-31',
    accountNumber: 'XXXX-XXXX-7890'
  };
  
  const hikeHistory = [
    { date: 'January 2025', percentage: 12, oldSalary: 7580, newSalary: 8490 },
    { date: 'July 2024', percentage: 8, oldSalary: 7020, newSalary: 7580 },
    { date: 'January 2024', percentage: 5, oldSalary: 6685, newSalary: 7020 },
    { date: 'July 2023', percentage: 10, oldSalary: 6080, newSalary: 6685 },
  ];
  
  const salaryTrend = [
    { month: 'Jun 2024', salary: 7580 },
    { month: 'Jul 2024', salary: 7580 },
    { month: 'Aug 2024', salary: 7580 },
    { month: 'Sep 2024', salary: 7580 },
    { month: 'Oct 2024', salary: 7580 },
    { month: 'Nov 2024', salary: 7580 },
    { month: 'Dec 2024', salary: 7580 },
    { month: 'Jan 2025', salary: 8490 },
    { month: 'Feb 2025', salary: 8490 },
    { month: 'Mar 2025', salary: 8490 },
    { month: 'Apr 2025', salary: 8490 },
    { month: 'May 2025', salary: 8490 },
  ];
  
  const appraisalInfo = {
    nextDate: '2025-07-15',
    lastScore: 4.2,
    lastAppraisal: '2025-01-15',
    daysRemaining: 46
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Salary Information</h1>
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'current'
                ? 'bg-green-600 dark:bg-green-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('current')}
          >
            Current
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'history'
                ? 'bg-green-600 dark:bg-green-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'appraisal'
                ? 'bg-green-600 dark:bg-green-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('appraisal')}
          >
            Appraisal
          </button>
        </div>
      </div>
      
      {activeTab === 'current' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Salary Slip: {currentSalary.month}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment Date: {new Date(currentSalary.paymentDate).toLocaleDateString()}
                </p>
              </div>
              <button className="btn btn-outline flex items-center gap-2">
                <Download size={16} />
                <span>Download PDF</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Net Salary</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">${currentSalary.netSalary}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Credited to account ending {currentSalary.accountNumber.split('-').pop()}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Gross Salary</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">${currentSalary.grossSalary}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Before deductions
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Deductions</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">${currentSalary.totalDeductions}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Taxes and contributions
                </p>
              </div>
            </div>
            
            <button 
              className="w-full py-3 flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mb-4"
              onClick={() => setShowSalaryDetails(!showSalaryDetails)}
            >
              {showSalaryDetails ? 'Hide Details' : 'Show Detailed Breakdown'}
              {showSalaryDetails ? <ChevronUp className="ml-2" size={16} /> : <ChevronDown className="ml-2" size={16} />}
            </button>
            
            {showSalaryDetails && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 animate-[fadeIn_0.3s_ease-in-out]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Earnings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Basic Pay</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.basicPay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">House Rent Allowance</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.houseRentAllowance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Conveyance Allowance</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.conveyanceAllowance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Medical Allowance</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.medicalAllowance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Special Allowance</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.specialAllowance}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-800 dark:text-white">Total Earnings</span>
                        <span className="font-bold text-gray-800 dark:text-white">${currentSalary.grossSalary}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Deductions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Income Tax</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.incomeTax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Professional Tax</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.professionalTax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Provident Fund</span>
                        <span className="font-medium text-gray-800 dark:text-white">${currentSalary.providentFund}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-800 dark:text-white">Total Deductions</span>
                        <span className="font-bold text-gray-800 dark:text-white">${currentSalary.totalDeductions}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-800 dark:text-white">Net Salary</span>
                        <span className="font-bold text-lg text-green-600 dark:text-green-400">${currentSalary.netSalary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="card p-6">
            <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Salary Trend (Last 12 Months)</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salaryTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Salary']} />
                  <Bar dataKey="salary" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'history' && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Salary Hike History</h2>
          </div>
          
          <div className="relative pl-8 border-l-2 border-green-400 dark:border-green-600 pb-4">
            {hikeHistory.map((hike, index) => (
              <div key={index} className="mb-10 relative">
                <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center border-4 border-white dark:border-gray-800 text-green-600 dark:text-green-400">
                  <TrendingUp size={16} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{hike.date}</h3>
                      <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {hike.percentage}% Increase
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center text-gray-600 dark:text-gray-300">
                      <span className="text-sm">${hike.oldSalary}</span>
                      <ArrowRight size={16} className="mx-2 text-gray-400" />
                      <span className="text-base font-bold text-green-600 dark:text-green-400">${hike.newSalary}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'appraisal' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Appraisal</h2>
              <div className="flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm font-medium">{appraisalInfo.daysRemaining} days remaining</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Next Appraisal Date</h3>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {new Date(appraisalInfo.nextDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Appraisal</h3>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {new Date(appraisalInfo.lastAppraisal).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Performance Score</h3>
                <div className="flex items-end">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{appraisalInfo.lastScore}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-1 mb-1">/5</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Preparing for Your Appraisal</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                Remember to update your accomplishments, collect feedback from peers, and prepare
                your self-assessment before the appraisal meeting.
              </p>
            </div>
          </div>
          
          <div className="card p-6">
            <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Performance History</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">2025 Q1 Review</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">January 15, 2025</p>
                </div>
                <div className="flex items-center">
                  <div className="px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium">
                    Score: 4.2/5
                  </div>
                  <button className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <LineChart size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">2024 Q4 Review</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">October 10, 2024</p>
                </div>
                <div className="flex items-center">
                  <div className="px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium">
                    Score: 4.0/5
                  </div>
                  <button className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <LineChart size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">2024 Q3 Review</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">July 12, 2024</p>
                </div>
                <div className="flex items-center">
                  <div className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                    Score: 3.8/5
                  </div>
                  <button className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <LineChart size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;
