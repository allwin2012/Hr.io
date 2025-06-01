import { useState } from 'react';
import { ArrowDownUp, Check, Circle, CirclePlus, Clock, Filter, MessageSquare, SquareSplitVertical, Users, X } from 'lucide-react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('todo');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDelegateForm, setShowDelegateForm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [viewMode, setViewMode] = useState('my'); // 'my' or 'team'
  const [selectedReportee, setSelectedReportee] = useState('all');
  
  // Mock data
  const tasks = [
    {
      id: 1,
      title: 'Complete UI design for dashboard',
      description: 'Finalize the visual design for the new analytics dashboard',
      dueDate: '2025-06-05',
      priority: 'High',
      status: 'todo',
      createdAt: '2025-05-28',
    },
    {
      id: 2,
      title: 'Review design specifications',
      description: 'Go through the latest design specifications and provide feedback',
      dueDate: '2025-06-10',
      priority: 'Medium',
      status: 'inprogress',
      createdAt: '2025-05-27',
    },
    {
      id: 3,
      title: 'Create user personas',
      description: 'Develop detailed user personas for the new product',
      dueDate: '2025-06-15',
      priority: 'Low',
      status: 'completed',
      createdAt: '2025-05-25',
    },
    {
      id: 4,
      title: 'Prepare presentation for client meeting',
      description: 'Create slides for the upcoming client presentation',
      dueDate: '2025-06-03',
      priority: 'High',
      status: 'todo',
      createdAt: '2025-05-29',
    },
    {
      id: 5,
      title: 'Collect user feedback',
      description: 'Gather and analyze user feedback on the latest prototype',
      dueDate: '2025-06-20',
      priority: 'Medium',
      status: 'inprogress',
      createdAt: '2025-05-26',
    },
  ];
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally submit the form data
    setShowCreateForm(false);
    // Reset form
    setTaskForm({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
    });
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle size={18} className="text-gray-400" />;
      case 'inprogress':
        return <Clock size={18} className="text-yellow-500" />;
      case 'completed':
        return <Check size={18} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  // Mock data for reportees
  const reportees = [
    { id: 1, name: 'Alex Johnson', role: 'UI Designer' },
    { id: 2, name: 'Sam Williams', role: 'UI Designer' },
    { id: 3, name: 'Taylor Brown', role: 'Junior Designer' },
  ];
  
  // Mock data for team tasks
  const teamTasks = [
    {
      id: 101,
      title: 'Review wireframes',
      description: 'Review the wireframes for the new landing page',
      dueDate: '2025-06-07',
      priority: 'High',
      status: 'todo',
      createdAt: '2025-05-28',
      assignee: 'Alex Johnson',
    },
    {
      id: 102,
      title: 'Create icons',
      description: 'Design new icons for the mobile app',
      dueDate: '2025-06-12',
      priority: 'Medium',
      status: 'inprogress',
      createdAt: '2025-05-26',
      assignee: 'Sam Williams',
    },
    {
      id: 103,
      title: 'UI component library',
      description: 'Build a component library for the new design system',
      dueDate: '2025-06-20',
      priority: 'Low',
      status: 'completed',
      createdAt: '2025-05-20',
      assignee: 'Taylor Brown',
    },
  ];
  
  const [delegateForm, setDelegateForm] = useState({
    taskId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignee: '',
    splitTask: false,
  });
  
  const handleDelegateTask = (task: any) => {
    setSelectedTask(task);
    setDelegateForm({
      taskId: task.id.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignee: '',
      splitTask: false,
    });
    setShowDelegateForm(true);
  };
  
  const handleDelegateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setDelegateForm(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleDelegateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally submit the form data
    alert(`Task delegated to ${delegateForm.assignee}`);
    setShowDelegateForm(false);
  };
  
  // Filter tasks based on view mode, status tab and priority filter
  const getFilteredTasks = () => {
    if (viewMode === 'my') {
      return tasks
        .filter(task => task.status === activeTab)
        .filter(task => selectedPriority === 'all' || task.priority === selectedPriority);
    } else {
      return teamTasks
        .filter(task => task.status === activeTab)
        .filter(task => selectedPriority === 'all' || task.priority === selectedPriority)
        .filter(task => selectedReportee === 'all' || task.assignee === selectedReportee);
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  // Sort tasks based on sort order
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === 'priority') {
      const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return (priorityValues as any)[b.priority] - (priorityValues as any)[a.priority];
    } else {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });
  
  const isTaskOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && activeTab !== 'completed';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <CirclePlus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              viewMode === 'my'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setViewMode('my')}
          >
            <Circle size={16} className="mr-2" />
            My Tasks
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              viewMode === 'team'
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
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'todo'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('todo')}
          >
            <Circle size={16} className="mr-2" />
            To Do
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
              {tasks.filter(t => t.status === 'todo').length}
            </span>
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'inprogress'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('inprogress')}
          >
            <Clock size={16} className="mr-2" />
            In Progress
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
              {tasks.filter(t => t.status === 'inprogress').length}
            </span>
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'completed'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            <Check size={16} className="mr-2" />
            Completed
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
              {tasks.filter(t => t.status === 'completed').length}
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
                {reportees.map(reportee => (
                  <option key={reportee.id} value={reportee.name}>{reportee.name}</option>
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
            onChange={(e) => setSortOrder(e.target.value)}
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
          sortedTasks.map((task) => (
            <div key={task.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    {getStatusIcon(task.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                    <div className="flex flex-wrap items-center mt-2 space-x-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs ${isTaskOverdue(task.dueDate) ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                        {isTaskOverdue(task.dueDate) && ' (Overdue)'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Start Task"
                  >
                    <Clock size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Mark Complete"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Add Comment"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Delegate Task"
                    onClick={() => handleDelegateTask(task)}
                  >
                    <Users size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 card">
            <Check size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No tasks found.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            >
              Create a new task
            </button>
          </div>
        )}
      </div>
      
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Create New Task</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={taskForm.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={taskForm.dueDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Task Delegation Modal */}
      {showDelegateForm && selectedTask && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Delegate Task</h2>
              <button 
                onClick={() => setShowDelegateForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleDelegateSubmit} className="p-4">
              <div className="mb-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-medium text-gray-800 dark:text-white">{selectedTask.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedTask.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                      Due: {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign To
                </label>
                <select
                  name="assignee"
                  value={delegateForm.assignee}
                  onChange={handleDelegateFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a team member</option>
                  {reportees.map(reportee => (
                    <option key={reportee.id} value={reportee.name}>{reportee.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="splitTask"
                    checked={delegateForm.splitTask}
                    onChange={handleDelegateFormChange}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
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
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subtask 1 Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="Subtask title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subtask 2 Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="Subtask title"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    + Add Another Subtask
                  </button>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDelegateForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
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
