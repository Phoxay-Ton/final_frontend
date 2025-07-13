'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Employee, Department, Division, Position } from '@/src/types/employee';

interface UseEmployeeResult {
    employees: Employee[];
    departments: Department[];
    divisions: Division[];
    positions: Position[];
    loading: boolean;
    error: string | null;
    fetchEmployees: () => Promise<void>;
    // fetchDepartments: () => Promise<void>;
    fetchDivisions: () => Promise<void>;
    fetchPositions: () => Promise<void>;
    updateEmployee: (updatedEmployee: Employee) => Promise<boolean>;
    deleteEmployee: (employeeId: number) => Promise<boolean>;
    addEmployee: (newEmployee: Omit<Employee, 'Employee_ID'>) => Promise<boolean>;
}

export const useEmployee = (showNotification: (title: string, message: string) => void): UseEmployeeResult => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        try {
            const response = await axios.get("http://localhost:8080/api/v1/Employee", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setEmployees(data);
            } else {
                setEmployees([]);
                console.error('Invalid data format received for employees:', data);
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນພະນັກງານໄດ້. ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ.");
            }
        } catch (err: any) {
            console.error("Error fetching employees:", err);
            setError(err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນພະນັກງານ.");
            setEmployees([]);
            showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນພະນັກງານ.");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    const fetchDepartments = useCallback(async () => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        try {
            const response = await axios.get("http://localhost:8080/api/v1/department", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Assuming Leave endpoint requires auth
                },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setDepartments(data);
            } else {
                setDepartments([]);
                // console.error('Invalid data format received for departments:', data);
            }
        } catch (err: any) {
            console.error("Error fetching departments:", err);
            setDepartments([]);
        }
    }, []);

    const fetchDivisions = useCallback(async () => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        try {
            const response = await axios.get("http://localhost:8080/api/v1/Division", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setDivisions(data);
            } else {
                setDivisions([]);
                console.error('Invalid data format received for divisions:', data);
            }
        } catch (err: any) {
            console.error("Error fetching divisions:", err);
            setDivisions([]);
        }
    }, []);

    const fetchPositions = useCallback(async () => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        try {
            const response = await axios.get("http://localhost:8080/api/v1/Position", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Assuming Leave endpoint requires auth
                },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setPositions(data);
            } else {
                setPositions([]);
                console.error('Invalid data format received for positions:', data);
            }
        } catch (err: any) {
            console.error("Error fetching positions:", err);
            setPositions([]);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
        fetchDivisions();
        fetchPositions();
    }, [fetchEmployees, fetchDivisions, fetchPositions]);

    // ในไฟล์ useEmployeeData hook หรือ employeeService
    const addEmployee = async (newEmployee: Omit<Employee, 'Employee_ID'>): Promise<boolean> => {
        try {
            console.log('Adding employee with data:', newEmployee); // Debug log

            const response = await axios.post("http://localhost:8080/api/v1/Employee", newEmployee, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}` // เพิ่ม token ถ้าจำเป็น
                },
            });

            console.log('Response from server:', response); // Debug log

            if (response.status === 201 || response.status === 200) {
                // ไม่ต้องแสดง notification ที่นี่ เนื่องจากจะจัดการที่ component
                fetchEmployees(); // Refresh data
                return true;
            } else {
                console.error('Unexpected response status:', response.status);
                return false;
            }
        } catch (err: any) {
            console.error("Failed to add employee:", err);

            // ให้ throw error เพื่อให้ component จัดการ
            if (err.response) {
                // Server responded with error status
                throw new Error(err.response.data?.message || `Server error: ${err.response.status}`);
            } else if (err.request) {
                // Request was made but no response received
                throw new Error('ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້');
            } else {
                // Something else happened
                throw new Error(err.message || 'ເກີດຄວາມຜິດພາດທີ່ບໍ່ຄາດຄິດ');
            }
        }
    };

    const updateEmployee = async (updatedEmployee: Employee): Promise<boolean> => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Employee/${updatedEmployee.Employee_ID}`, updatedEmployee, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ບັນທຶກຂໍ້ມູນພະນັກງານສຳເລັດ!");
                fetchEmployees(); // Refresh data
                return true;
            } else {
                showNotification("ຜິດພາດ", `ບໍ່ສາມາດອັບເດດພະນັກງານໄດ້: ${response.data?.message || 'ມີບາງຢ່າງຜິດພາດ.'}`);
                return false;
            }
        } catch (err: any) {
            console.error("Failed to update employee:", err);
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດອັບເດດພະນັກງານໄດ້: ${err.response?.data?.message || err.message || 'ກະລຸນາລອງໃໝ່.'}`);
            return false;
        }
    };

    const deleteEmployee = async (Id: number): Promise<boolean> => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/Employee/${Id}`);

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ລຶບພະນັກງານສຳເລັດ!");
                fetchEmployees(); // Refresh data
                return true;
            } else {
                showNotification("ຜິດພາດ", `ບໍ່ສາມາດລຶບພະນັກງານໄດ້: ${response.data?.message || 'ມີບາງຢ່າງຜິດພາດ.'}`);
                return false;
            }
        } catch (err: any) {
            console.error("Failed to delete employee:", err);
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດລຶບພະນັກງານໄດ້: ${err.response?.data?.message || err.message || 'ກະລຸນາລອງໃໝ່.'}`);
            return false;
        }
    };

    return {
        employees,
        departments,
        divisions,
        positions,
        loading,
        error,
        fetchEmployees,
        // fetchDepartments,
        fetchDivisions,
        fetchPositions,
        updateEmployee,
        deleteEmployee,
        addEmployee
    };
};
