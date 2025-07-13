// src/types/department.ts

export interface Department {
    Department_ID: number;
    Department_Name: string;
    Address: string;
    Phone: string;
    Email: string;
    Contact_Person?: string;
}

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

export interface DepartmentEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Department | null;
    onSave: (updatedDepartment: Department) => void;
}

// Conceptually, AddDepartmentPayload will be:
// src/types/department.ts


export interface AddDepartment {
    // Department_ID: number;
    Department_Name: string;
    Phone: string;
    Address: string;
    Email: string;
    Contact_Person?: string;
}