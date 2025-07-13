// src/types/employee.ts

export interface Employee {
    Employee_ID: number;
    Name: string;
    Email: string;
    Phone: string;
    Username: string;
    Role: string;
    Department_ID: number | null;  // Allow null
    department?: {
        Department_Name: string;
    }
    Division_ID: number | null;   // Allow null
    Position_ID: number | null;   // Allow null
    Contact_Person?: string;
    Password?: string;            // Optional for responses
}

export interface AddEmployee {
    name: string;
    email: string;
    phone: string;
    username: string;
    role: string;
    department_ID: number | '';
    division_ID: number | '';
    position_ID: number | '';
    password: string;
}

// Add a specific interface for API requests
export interface AddEmployeeRequest {
    Name: string;
    Email: string;
    Phone: string;
    Username: string;
    Role: string;
    Department_ID: number | null;
    Division_ID: number | null;
    Position_ID: number | null;
    Password: string;
}

export interface Department {
    Department_ID: number;
    Department_Name: string;
    Phone?: string;
    Address?: string;
    Email?: string;
    Contact_Person?: string;
}

export interface Division {
    Division_ID: number;
    Division_Name: string;
    Department_ID?: number;
    Phone?: string;
    Address?: string;
    Email?: string;
    Contact_Person?: string;
}

export interface Position {
    Position_ID: number;
    Position_Name: string;
    Department_ID?: number;
    Division_ID?: number;
    Description?: string;
    Salary_Range?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
    data: T[];
    message?: string;
    statusCode?: number;
    success?: boolean;
}

export interface SingleApiResponse<T> {
    data: T;
    message?: string;
    statusCode?: number;
    success?: boolean;
}

// Modal Props interfaces
export interface EmployeeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Employee | null;
    onSave: (updatedEmployee: Employee) => void;
    departments: Department[];
    divisions: Division[];
    positions: Position[];
}

// Form validation interface
export interface EmployeeFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    password?: string;
    role?: string;
    department_ID?: string;
    division_ID?: string;
    position_ID?: string;
}

// Role options
export interface RoleOption {
    value: string;
    label: string;
}

export const ROLE_OPTIONS: RoleOption[] = [

    { value: 'Super_Admin', label: 'Super_Admin' },
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' }
];

// Status options (if needed)
export interface StatusOption {
    value: string;
    label: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
    { value: 'Active', label: 'ເຄື່ອນໄຫວ' },
    { value: 'Inactive', label: 'ບໍ່ເຄື່ອນໄຫວ' },
    { value: 'Suspended', label: 'ໂຈະ' }
];