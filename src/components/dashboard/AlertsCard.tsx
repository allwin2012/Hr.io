import { Award, Clock, FileWarning } from 'lucide-react';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: 'document' | 'task' | 'appraisal';
  dueDate?: string;
}

interface AlertsCardProps {
  alerts: Alert[];
}

const AlertsCard = ({ alerts }: AlertsCardProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileWarning size={16} className="text-yellow-500" />;
      case 'task':
        return <Clock size={16} className="text-blue-500" />;
      case 'appraisal':
        return <Award size={16} className="text-purple-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'border-yellow-400 bg-yellow-50 dark:bg-gray-700';
      case 'task':
        return 'border-blue-400 bg-blue-50 dark:bg-gray-700';
      case 'appraisal':
        return 'border-purple-400 bg-purple-50 dark:bg-gray-700';
      default:
        return 'border-gray-400 bg-gray-50 dark:bg-gray-700';
    }
  };

  return (
    <div className="card animate-[fadeIn_0.6s_ease-in-out]">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Important Alerts</h3>
      
      {alerts.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p>No alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{alert.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                  {alert.dueDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Due: {alert.dueDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsCard;
