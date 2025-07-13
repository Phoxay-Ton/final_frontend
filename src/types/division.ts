// src/types/division.ts

export interface Division {
    Division_ID: number;
    Division_Name: string;
    Phone: string;
    Email: string;
    Department_ID: number;
    department?: Department;
    Contact_Person?: string; // Optional field
}

// Payload for adding a new division - matches API requirements
export interface AddDivisionPayload {
    Division_Name: string;  // Note: lowercase with underscore to match API
    Phone: string;          // Note: lowercase to match API
    Email: string;          // Note: lowercase to match API
    Department_ID: number;
    Contact_Person?: string;
}

// For updating existing division
export interface UpdateDivisionPayload {
    Division_Name?: string;
    Phone?: string;
    Email?: string;
    Department_ID?: number;
    Contact_Person?: string;
}

export interface Department {
    Department_ID: number;
    Department_Name: string;
}

// Modal props
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

export interface DivisionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Division | null;
    onSave: (updatedDivision: Division) => void;
    departments: Department[];
}