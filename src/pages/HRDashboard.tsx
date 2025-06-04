// HRDashboard.tsx
import { useEffect, useState } from 'react';
import EditEmployeeModal from '../components/Hr/EditEmployeeModal';
import { User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Employee = {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  reportsTo?: {
    name: string;
  } | string;
};

const HRDashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const pageSize = 5;

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/hr/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const paginatedEmployees = employees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">Team Management</h1>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              [...Array(pageSize)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              paginatedEmployees.map(emp => (
                <tr key={emp._id} className="hover:bg-green-50 dark:hover:bg-green-800 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    {emp.avatar ? (
                      <img src={`${API_BASE_URL}${emp.avatar}`} alt={emp.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <span className="font-medium text-gray-800 dark:text-gray-100">{emp.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{emp.email}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{emp.role}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{emp.department}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{typeof emp.reportsTo === 'object' ? emp.reportsTo?.name : '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-green-600 dark:text-green-400 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-200 dark:bg-green-700 text-green-900 dark:text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage * pageSize >= employees.length}
          className="px-4 py-2 bg-green-200 dark:bg-green-700 text-green-900 dark:text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdate={fetchEmployees}
        />
      )}
    </div>
  );
};

export default HRDashboard;
