// src/services/departmentService.ts
import axios from 'axios';
import { AddDepartment, Department } from '@/src/types/department';

const API_BASE_URL = "http://localhost:8080/api/v1/Department"; // Adjust if your API is different

export const departmentService = {
    // Method to create a new department
    createDepartment: async (payload: AddDepartment): Promise<Department> => {
        const response = await axios.post<Department>(API_BASE_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                // Add authorization token if needed:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    },


};