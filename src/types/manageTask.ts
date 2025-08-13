// src/types/manageTask.ts

export interface ManageTaskDetail {
    Detail_ID: number;
    Task_ID: number;
    Start_Date: string; // Consider using Date objects if you parse them, otherwise string is fine for raw API
    End_date: string;   // Consider using Date objects if you parse them, otherwise string is fine for raw API
    Status: string;
}

export interface ManageTask {
    Task_ID: number;
    Task_name: string;
    Description: string;
    Attachment?: string; // Optional field, URL or filename
    Employee_ID: number;
    Division_ID: number;
    manage_tasks_details: ManageTaskDetail[];
    employee?: {
        Name: string;
    }
    // Name: string; // Assuming these might be joined data for display
    division?: {
        Division_Name: string;
    }; // Assuming these might be joined data for display
    Phone?: string; // Assuming employee phone might be needed for display
    Email?: string; // Assuming employee email might be needed for display
    Position_Name?: string; // Assuming employee position might be needed for display
}

// Payload for creating a new task
// This matches the format expected by the `addManageTask` function in useManageTask hook
export interface AddManageTaskPayload {
    task_name: string;
    description: string;
    attachment: string;
    employee_id: number;
    division_id: number;
    start_date: string;
    end_date: string; // Fixed: Changed from End_date to End_Date
    status: string;
}

export interface BackendManageTaskPayload {
    task_name: string;
    description: string;
    attachment: string;
    employee_id: number;
    division_id: number;
    start_date: string;
    end_date: string;
    status: string;
}

// Props for the edit modal, similar to DepartmentEditModalProps
export interface ManageTaskEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: ManageTask | null;
    onSave: (updatedTask: ManageTask) => Promise<boolean>; // Asynchronous save
}

// Assuming a generic modal for confirmation/notification
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


export interface Division {
    Division_ID: number;
    Division_Name: string;
    Address: string; // Ensure this is always present if it's a required field for a division
    Phone: string;
    Email: string;
    Department_ID: number;
    department?: string; // Optional Department object for display purposes
    Contact_Person?: string; // Optional field, make sure it's handled in the form if needed
}

// This interface now correctly reflects the payload for adding a new division.
export interface AddDivisionPayload {
    Division_Name: string;
    Address: string; // <--- ADDED THIS FIELD
    Phone: string;
    Email: string;
    Department_ID: number;
    Contact_Person?: string; // <--- ADDED THIS FIELD (as optional)
}