// LeaveReviewList.tsx
import { useState } from 'react';
import { Check, Clock3, X } from 'lucide-react';
import { LeaveRequest } from '../leave/types';

interface LeaveReviewListProps {
  leaveRequests: LeaveRequest[];
  onStatusChange: (id: string, status: 'Approved' | 'Rejected', comment?: string) => void;
}

const LeaveReviewList = ({ leaveRequests, onStatusChange }: LeaveReviewListProps) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <Check size={14} className="mr-1" />;
      case 'Pending': return <Clock3 size={14} className="mr-1" />;
      case 'Rejected': return <X size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leaveRequests.map(request => (
              <tr key={request._id}>
                <td className="px-6 py-4 flex items-center gap-2  space-x-7">
                  <img  src={`${import.meta.env.VITE_API_BASE_URL}${request.employee?.avatar}`}
    alt={request.employee?.name}
    className="h-8 w-8 rounded-full object-cover"
  />
                  {request.employee?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{request.reason}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onStatusChange(request._id, 'Approved')}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectingId(request._id)}
                        className="text-red-600 hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {rejectingId === request._id && (
                    <div className="mt-2">
                      <textarea
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm dark:bg-gray-700 dark:text-white"
                        placeholder="Reason for rejection..."
                      />
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => {
                            onStatusChange(request._id, 'Rejected', rejectReason);
                            setRejectingId(null);
                            setRejectReason('');
                          }}
                          className="text-red-700 font-medium hover:underline"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason('');
                          }}
                          className="text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveReviewList;
