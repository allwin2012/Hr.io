import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => {
  return (
    <div className="stats-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="stats-card-header">{title}</p>
          <p className="stats-card-value">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-green-50 dark:bg-gray-700 text-green-600 dark:text-[#32CD32]">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="stats-card-footer">
          <span className={trend.positive ? 'text-green-500' : 'text-red-500'}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          {' '}<span>from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
