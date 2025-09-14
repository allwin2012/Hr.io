import { Circle, Clock, Check, Users, Trash2, MessageSquare, Edit2 } from 'lucide-react';

export type TaskCardProps = {
    task: {
        id: string;
        title: string;
        description?: string;
        dueDate?: string;
        priority?: string;
        status?: string;
        assignee?: string | { _id?: string; name?: string };
        createdBy?: string | { _id?: string; name?: string };
        createdAt?: string;
    };
    onStart?: (task: any) => void;
    onComplete?: (task: any) => void;
    onDelegate?: (task: any) => void;
    onDelete?: (task: any) => void;
    onComment?: (task: any) => void;
    onEdit?: (task: any) => void;
    loading?: boolean;
};

const TaskCard = ({
    task,
    onStart,
    onComplete,
    onDelegate,
    onDelete,
     onEdit,    
    onComment,
    loading = false
}: TaskCardProps) => {
    const assigneeName = typeof task.assignee === 'string' ? task.assignee : (task.assignee as any)?.name;
    const dueText = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—';

    return (
        <div className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between">
                <div className="flex items-start">
                    <div className="mt-1 mr-3">
                        {task.status === 'todo' ? (
                            <Circle size={18} className="text-gray-400" />
                        ) : task.status === 'inprogress' ? (
                            <Clock size={18} className="text-yellow-500" />
                        ) : (
                            <Check size={18} className="text-green-500" />
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>

                        <div className="flex flex-wrap items-center mt-2 space-x-3 text-xs">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority || '')}`}>
                                {task.priority || '—'}
                            </span>

                            <span className={`${isTaskOverdue(task.dueDate, task.status) ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                Due: {dueText}
                                {isTaskOverdue(task.dueDate, task.status) && ' (Overdue)'}
                            </span>

                            {assigneeName && <span className="text-xs text-gray-500 dark:text-gray-400">• Assignee: {assigneeName}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2 items-center">
                    <button disabled={loading} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Start Task" onClick={() => onStart && onStart(task)}><Clock size={18} /></button>

                    <button disabled={loading} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Mark Complete" onClick={() => onComplete && onComplete(task)}><Check size={18} /></button>

                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Add Comment" onClick={() => onComment && onComment(task)}><MessageSquare size={18} /></button>

                    <button disabled={loading} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Delegate Task" onClick={() => onDelegate && onDelegate(task)}><Users size={18} /></button>
                    <button
                        disabled={loading}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit Task"
                         onClick={() => onEdit && onEdit(task)} 
                    >
                        <Edit2 size={18} />
                    </button>


                    <button disabled={loading} className="text-red-500 hover:text-red-700" title="Delete Task" onClick={() => onDelete && onDelete(task)}><Trash2 size={18} /></button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;

// helpers
function getPriorityColor(priority: string) {
    switch (priority) {
        case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
}

function isTaskOverdue(dueDate?: string, status?: string) {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && status !== 'completed';
}
