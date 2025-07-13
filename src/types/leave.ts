// src/types/leave.ts

export interface Leave {
    Leave_ID: number;
    Employee_ID: number;
    Leave_type_ID: number;
    From_date: string;
    To_date: string;
    Leave_days: number;
    Description: string;
    Approval_person: number;
    Status: string | null;
    employee_name?: string;
    leave_type_name?: string;
    approval_person_name?: string;
}

export interface AddLeave {
    Leave_type_ID: number;
    From_date: string;
    To_date: string;
    Leave_days: number;
    Description: string;
    Approval_person: number;
}

export interface Employee {
    Employee_ID: number;
    Name: string;
    Department_ID?: number;
    Role?: string;
}

export interface LeaveType {
    id: number;
    name: string;
    description?: string;
    max_days?: number;
}

// Interface for the detailed approval record (from your GET API response)
export interface LeaveApproval {
    Leave_ID: number;
    Employee_ID: number;
    Leave_type_ID: number;
    From_date: string;
    To_date: string;
    Leave_days: number;
    Description: string;
    Approval_person: number;
    Status: string | null;
    employee: {
        Name: string;
        Department_ID: number;
    };
    leave_type: {
        name: string;
    };
}

// Interface for the payload to send when approving/rejecting a leave
export interface UpdateLeaveApprovalPayload {
    leave_id: number;
    status: "approved" | "rejected";
    remark: string;
}

// Modal interfaces
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

export interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export interface LeaveEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Leave | null;
    onSave: (updatedLeave: Leave) => void;
}

// Interface for the ApprovalForm component props
export interface ApprovalFormProps {
    approval: LeaveApproval;
    onApprove: (payload: UpdateLeaveApprovalPayload) => void;
    onReject: (payload: UpdateLeaveApprovalPayload) => void;
    employees: Employee[];
    leaveTypes: LeaveType[];
}

// Interface for AddLeaveForm component props
export interface AddLeaveFormProps {
    onSubmit: (leaveData: AddLeave) => void;
    onCancel: () => void;
    employees: Employee[];
    leaveTypes: LeaveType[];
    loadingData: boolean;
    errorData: string | null;
    currentEmployeeId: number;
}


