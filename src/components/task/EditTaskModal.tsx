import React, { useState, useEffect } from 'react';

type EditTaskModalProps = {
  isOpen: boolean;
  task: any | null;
  onClose: () => void;
  onSubmit: (payload: { title?: string; description?: string; priority?: string; dueDate?: string; status?: string }) => Promise<void> | void;
};

export default function EditTaskModal({ isOpen, task, onClose, onSubmit }: EditTaskModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'todo'
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
        status: task.status || 'todo'
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // prepare payload: convert dueDate back to ISO string if provided
    const payload: any = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status
    };
    if (form.dueDate) payload.dueDate = new Date(form.dueDate).toISOString();
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <button type="button" onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-700 
             text-gray-900 dark:text-white 
             focus:ring-2 focus:ring-green-500 focus:border-green-500"
             required />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-700 
             text-gray-900 dark:text-white 
             focus:ring-2 focus:ring-green-500 focus:border-green-500"
             rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-700 
             text-gray-900 dark:text-white 
             focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-700 
             text-gray-900 dark:text-white 
             focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
             bg-white dark:bg-gray-700 
             text-gray-900 dark:text-white 
             focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
