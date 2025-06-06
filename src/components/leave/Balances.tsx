import { CirclePlus } from 'lucide-react';

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  color: string;
}

interface LeaveBalancesProps {
  balances: LeaveBalance[];
}

const LeaveBalances = ({ balances }: LeaveBalancesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {balances.map((balance, index) => (
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
  );
};

export default LeaveBalances;