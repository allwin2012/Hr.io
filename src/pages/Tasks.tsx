import { useState, useEffect } from 'react';
import {
  ArrowDownUp,
  Check,
  Circle,
  CirclePlus,
  Clock,
  Filter,
  MessageSquare,
  SquareSplitVertical,
  Users,
  X,
  Trash2
} from 'lucide-react';
import { CreateTaskModal } from '../components/task/CreateTaskModal';
import TaskCard from '../components/task/TaskCard';
import EditTaskModal from '../components/task/EditTaskModal';


type Task = {
  id: string; // mapped from _id
  _id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low' | string;
  status?: 'todo' | 'inprogress' | 'completed' | string;
  createdAt?: string;
  assignee?: string | { _id?: string; name?: string };
  createdBy?: string | { _id?: string; name?: string };
};

type TeamMember = { _id: string; name: string; role?: string };

const Tasks = () => {
  const [activeTab, setActiveTab] = useState<'todo' | 'inprogress' | 'completed'>('todo');
  const [showDelegateForm, setShowDelegateForm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<'all' | string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'dueDate' | 'priority'>('newest');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'my' | 'team'>('my');
  const [selectedReportee, setSelectedReportee] = useState<'all' | string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showEditForm, setShowEditForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({}); // per-task action loader

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const currentUser = {
    id: localStorage.getItem('UserId') || '',
    name: localStorage.getItem('userName') || '',
    role: localStorage.getItem('userRole') || ''
  };

  // Example team members (you'll likely fetch these from API later)
  const teamMembers: TeamMember[] = [
    { _id: 'user-2', name: 'Alex Johnson', role: 'UI Designer' },
    { _id: 'user-3', name: 'Sam Williams', role: 'UI Designer' },
    { _id: 'user-4', name: 'Taylor Brown', role: 'Junior Designer' }
  ];

  // --- Fetch tasks from backend (abortable, maps _id -> id) ---
  useEffect(() => {
    const ac = new AbortController();
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); // if you use auth
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          signal: ac.signal
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch tasks: ${res.status} ${txt}`);
        }

        const data: any[] = await res.json();

        // Map backend _id → id and normalize assignee/createdBy
        const formatted = data.map((task) => ({
          ...task,
          id: task._id ?? task.id,
          assignee: task.assignee ?? null,
          createdBy: task.createdBy ?? null
        })) as Task[];

        setTasks(formatted);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching tasks:', err);
          setError(err.message || 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    return () => ac.abort();
  }, [API_BASE_URL, refreshTrigger]);

  // Called after CreateTaskModal creates a task
  const handleTaskCreated = () => {
    setRefreshTrigger((p) => p + 1);
  };

  // Helper: set per-task loading
  const setTaskLoading = (taskId: string, value: boolean) =>
    setActionLoading((prev) => ({ ...prev, [taskId]: value }));

  // --- API helpers ---

  // Update fields on task using PUT /api/tasks/:id
  const updateTaskApi = async (taskId: string, payload: Record<string, any>) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Update failed: ${res.status} ${txt}`);
    }
    return res.json();
  };

  // Edit task (from EditTaskModal)
  const handleEditSubmit = async (payload: Record<string, any>) => {
  if (!selectedTask) return;
  try {
    setTaskLoading(selectedTask.id, true);
    await updateTaskApi(selectedTask.id, payload);
    // reflect changes locally (optimistic) or re-fetch
    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, ...payload } : t)));
    // optionally refresh from backend: setRefreshTrigger(p => p+1);
  } catch (err) {
    console.error('Edit failed', err);
    alert('Failed to save changes. See console.');
  } finally {
    setTaskLoading(selectedTask.id, false);
    setShowEditForm(false);
  }
};


  // Delete task
  const deleteTaskApi = async (taskId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Delete failed: ${res.status} ${txt}`);
    }
    return res.json();
  };

  // --- UI actions ---

  const startTask = async (task: Task) => {
    setTaskLoading(task.id, true);
    try {
      await updateTaskApi(task.id, { status: 'inprogress' });
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to start task. See console.');
    } finally {
      setTaskLoading(task.id, false);
    }
  };

  const markComplete = async (task: Task) => {
    setTaskLoading(task.id, true);
    try {
      await updateTaskApi(task.id, { status: 'completed' });
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to mark complete. See console.');
    } finally {
      setTaskLoading(task.id, false);
    }
  };

  // Delegate: use the same PUT endpoint to update assignee (your backend's updatableFields includes 'assignee')
  const delegateTask = async (taskId: string, assigneeIdOrString: string, splitTask = false) => {
    setTaskLoading(taskId, true);
    try {
      // If backend expects an ObjectId string for assignee, pass that.
      await updateTaskApi(taskId, { assignee: assigneeIdOrString, splitTask });
      setShowDelegateForm(false);
      setRefreshTrigger((p) => p + 1);
      alert('Task delegated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delegate. See console.');
    } finally {
      setTaskLoading(taskId, false);
    }
  };

  // open edit modal for selected task
const handleEditTask = (task: Task) => {
  setSelectedTask(task);
  setShowEditForm(true);
};

  // Delete handler (confirm + delete)
  const handleDeleteTask = async (task: Task) => {
    // permission check on frontend (UX only) - backend enforces security
    const creatorId = (() => {
      if (!task.createdBy) return null;
      if (typeof task.createdBy === 'string') return task.createdBy;
      if ((task.createdBy as any)._id) return (task.createdBy as any)._id;
      return null;
    })();

    const canDelete = creatorId === currentUser.id || currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin';

    if (!canDelete) {
      alert('You are not authorized to delete this task.');
      return;
    }

    const ok = confirm('Are you sure you want to delete this task? This action cannot be undone.');
    if (!ok) return;

    setTaskLoading(task.id, true);
    try {
      await deleteTaskApi(task.id);
      // Optimistically remove from UI
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      // Alternatively you can refresh the list: setRefreshTrigger(p => p + 1);
    } catch (err) {
      console.error(err);
      alert('Delete failed. See console.');
    } finally {
      setTaskLoading(task.id, false);
    }
  };

  // Delegate modal wiring
  const [delegateForm, setDelegateForm] = useState({
    taskId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignee: '',
    splitTask: false
  });

  const handleDelegateTask = (task: Task) => {
    setSelectedTask(task);
     setShowEditForm(true);
    setDelegateForm({
      taskId: task.id.toString(),
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: (task.priority as string) || 'Medium',
      assignee: '', // user must pick
      splitTask: false
    });
    setShowDelegateForm(true);
  };

  const handleDelegateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setDelegateForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDelegateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateForm.assignee) {
      alert('Please select an assignee');
      return;
    }

    // NOTE: teamMembers currently uses 'name' as value. Ideally your UI should provide user._id here.
    // If you only have a name, confirm backend accepts assignee as string name or change to send ObjectId.
    await delegateTask(delegateForm.taskId, delegateForm.assignee, delegateForm.splitTask);
  };

  // Filtering & sorting same as before
  const getFilteredTasks = () => {
    if (viewMode === 'my') {
      return tasks
        .filter((task) => task.status === activeTab)
        .filter((task) => selectedPriority === 'all' || task.priority === selectedPriority);
    } else {
      return tasks
        .filter((task) => task.status === activeTab)
        .filter((task) => selectedPriority === 'all' || task.priority === selectedPriority)
        .filter((task) => selectedReportee === 'all' || (typeof task.assignee === 'string' ? task.assignee === selectedReportee : (task.assignee as any)?.name === selectedReportee));
    }
  };

  const filteredTasks = getFilteredTasks();

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    } else if (sortOrder === 'priority') {
      const priorityValues: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return (priorityValues[b.priority || ''] || 0) - (priorityValues[a.priority || ''] || 0);
    } else if (sortOrder === 'dueDate') {
      return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
    }
    return 0;
  });

  const isTaskOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && activeTab !== 'completed';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h1>
        <div className="flex space-x-2">
          <button onClick={() => setShowCreateForm(true)} className="btn btn-primary flex items-center gap-2">
            <CirclePlus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading tasks...</div>}
      {error && <div className="text-sm text-red-500">Error: {error}</div>}

      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${viewMode === 'my'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            onClick={() => setViewMode('my')}
          >
            <Circle size={16} className="mr-2" />
            My Tasks
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${viewMode === 'team'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            onClick={() => setViewMode('team')}
          >
            <Users size={16} className="mr-2" />
            My Team's Tasks
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'todo'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('todo')}
          >
            <Circle size={16} className="mr-2" />
            To Do
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
              {tasks.filter((t) => t.status === 'todo').length}
            </span>
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'inprogress'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('inprogress')}
          >
            <Clock size={16} className="mr-2" />
            In Progress
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
              {tasks.filter((t) => t.status === 'inprogress').length}
            </span>
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'completed'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('completed')}
          >
            <Check size={16} className="mr-2" />
            Completed
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
              {tasks.filter((t) => t.status === 'completed').length}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-3 md:space-y-0">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center">
            <Filter size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {viewMode === 'team' && (
            <div className="flex items-center">
              <Users size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Assignee:</span>
              <select
                value={selectedReportee}
                onChange={(e) => setSelectedReportee(e.target.value)}
                className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Team Members</option>
                {teamMembers.map((reportee) => (
                  <option key={reportee._id} value={reportee.name}>
                    {reportee.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <ArrowDownUp size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
  {sortedTasks.length > 0 ? (
    sortedTasks.map((task) => {
      const isLoading = !!actionLoading[task.id];
      const assigneeName = typeof task.assignee === 'string' ? task.assignee : (task.assignee as any)?.name;

      // optional front-end permission check used to show/hide delete button in TaskCard
      const creatorId = (() => {
        if (!task.createdBy) return null;
        if (typeof task.createdBy === 'string') return task.createdBy;
        return (task.createdBy as any)?._id ?? null;
      })();

      const canDelete = creatorId === currentUser.id || currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin';

      return (
        <TaskCard
          key={task.id}
          task={task}
          loading={isLoading}
          onStart={() => startTask(task)}
          onComplete={() => markComplete(task)}
          // this will open your delegate modal because handleDelegateTask sets selectedTask & showDelegateForm
          onDelegate={() => handleDelegateTask(task)}
          onDelete={() => handleDeleteTask(task)}
          onEdit={() => handleEditTask(task)}
          onComment={() => {/* implement later */}}
        />
      );
    })
  ) : (
    <div className="text-center py-10 card">
      <Check size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p className="text-gray-500 dark:text-gray-400">No tasks found.</p>
      <button onClick={() => setShowCreateForm(true)} className="mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
        Create a new task
      </button>
    </div>
  )}
</div>


      {showCreateForm && (
        <CreateTaskModal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} onTaskCreated={handleTaskCreated} currentUser={currentUser} teamMembers={teamMembers} />
      )}

      {showEditForm && selectedTask && (
  <EditTaskModal
    isOpen={showEditForm}
    task={selectedTask}
    onClose={() => setShowEditForm(false)}
    onSubmit={handleEditSubmit}
  />
)}


      {/* Task Delegation Modal */}
      {showDelegateForm && selectedTask && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Delegate Task</h2>
              <button onClick={() => setShowDelegateForm(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDelegateSubmit} className="p-4">
              <div className="mb-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-medium text-gray-800 dark:text-white">{selectedTask.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedTask.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(selectedTask.priority || '')}`}>{selectedTask.priority}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">Due: {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To</label>
                <select name="assignee" value={delegateForm.assignee} onChange={handleDelegateFormChange} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500" required>
                  <option value="">Select a team member</option>
                  {teamMembers.map((reportee) => (
                    <option key={reportee._id} value={reportee._id}>
                      {reportee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input type="checkbox" name="splitTask" checked={delegateForm.splitTask} onChange={handleDelegateFormChange} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Split into subtasks</span>
                </label>
              </div>

              {delegateForm.splitTask && (
                <div className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <SquareSplitVertical size={16} className="mr-2 text-green-500" />
                    <span>This task will be split into multiple subtasks</span>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subtask 1 Title</label>
                    <input type="text" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 text-sm" placeholder="Subtask title" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subtask 2 Title</label>
                    <input type="text" className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 text-sm" placeholder="Subtask title" />
                  </div>

                  <button type="button" className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                    + Add Another Subtask
                  </button>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowDelegateForm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

