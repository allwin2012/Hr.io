import type { Employee } from '../../pages/HRDashboard';

export interface LeaveBalance {
    type: string;
    used: number;
    total: number;
    color: string;
  }
  
  export interface LeaveRequest {
    _id: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    employee?: Employee;
  }
  
  export interface LeaveForm {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }