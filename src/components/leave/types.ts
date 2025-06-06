export interface LeaveBalance {
    type: string;
    used: number;
    total: number;
    color: string;
  }
  
  export interface LeaveRequest {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'Approved' | 'Pending' | 'Rejected';
  }
  
  export interface LeaveForm {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }