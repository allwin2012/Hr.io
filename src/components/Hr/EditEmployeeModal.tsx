// EditEmployeeModal.tsx
import { useEffect, useState } from 'react';
import { Employee } from '../../pages/HRDashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  employee: Employee;
  onClose: () => void;
  onUpdate: () => void;
}

const EditEmployeeModal = ({ employee, onClose, onUpdate }: Props) => {
  const [role, setRole] = useState(employee.role);
  const [managerId, setManagerId] = useState(
    typeof employee.reportsTo === 'string' ? employee.reportsTo : 
    typeof employee.reportsTo === 'object' && employee.reportsTo ? employee.reportsTo.name : ''
  );
  const [users, setUsers] = useState<Employee[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hr/employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setUsers(data.filter((u: Employee) => u._id !== employee._id));
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    fetchUsers();
  }, [employee._id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${employee._id}/manager`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role, managerId }),
      });

      if (!res.ok) throw new Error('Failed to update');

      onUpdate();
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Edit Employee</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Role</label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Manager</label>
          <select
            value={managerId}
            onChange={e => setManagerId(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">None</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
