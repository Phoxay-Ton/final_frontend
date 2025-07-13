// src/types/attendanceTracking.ts

// The core attendance record structure (as per your backend data)
export interface AttendanceRecord {
    Attendance_ID: number;
    Employee_ID: number;
    Date: string; // "YYYY-MM-DD HH:MM:SS"
    Time_in: string; // "YYYY-MM-DD HH:MM:SS"
    Time_out: string | null; // "YYYY-MM-DD HH:MM:SS" or null
    Status: string;
    Notes: string | null;
    employee?: {
        Name: string;
    };
}

// Extended interface for admin view, typically joining employee info
export interface AdminAttendanceRecord extends AttendanceRecord {
    Employee_Name: string; // Assuming you'll get employee name
    Division_Name?: string; // Assuming division name can be joined
    Position_Name?: string; // Assuming position name can be joined
}


// --- Reusable Modal Props (similar to department types) ---

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

// If you plan to have an edit modal for admin to modify attendance:
export interface AttendanceEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: AdminAttendanceRecord | null;
    onSave: (updatedRecord: AdminAttendanceRecord) => void;
}

export interface Employee {
    Employee_ID: number;
    Name: string;
}