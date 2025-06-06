import { X } from 'lucide-react';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface LeaveForm {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveApplyFormProps {
  show: boolean;
  form: LeaveForm;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const LeaveApplyForm = ({ show, form, onClose, onChange }: LeaveApplyFormProps) => {
  if (!show) return null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/leave/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to submit');

      showSnackbar('Leave submitted successfully', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      showSnackbar('Leave submission failed', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Apply for Leave</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Leave Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplyForm;
