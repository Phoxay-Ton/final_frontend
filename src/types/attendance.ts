// src/types/attendance.ts

export interface Attendance {
    Attendance_ID: number;
    Employee_ID: number;
    Date: string; // Consider using Date object if preferred for client-side manipulation
    Time_in: string; // Consider using Date object if preferred for client-side manipulation
    Time_out: string | null; // Nullable as an employee might not have clocked out yet
    Status: string;
    Notes: string | null; // Nullable
}

export interface ClockActionPayload {
    Employee_ID: number;
    Date: string; // e.g., "YYYY-MM-DD"
    Time: string; // e.g., "HH:MM:SS"
    Status: string; // e.g., "ເຂົ້າວຽກ", "ເລີກວຽກ"
    Notes?: string | null; // Optional
}

// Props for the main AttendancePage component's modals
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    children?: React.ReactNode;
}

export interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}