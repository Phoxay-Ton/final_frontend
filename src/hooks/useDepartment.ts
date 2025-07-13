// src/hooks/useDepartment.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Department } from "@/src/types/department";

interface UseDepartmentResult {
    departments: Department[];
    loading: boolean;
    error: string | null;
    fetchDepartments: () => Promise<void>;
    updateDepartment: (updatedDepartment: Department) => Promise<boolean>;
    deleteDepartment: (departmentId: number) => Promise<boolean>;
}

export const useDepartment = (showNotification: (title: string, message: string) => void): UseDepartmentResult => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

            if (user.role !== "Super_Admin") {
                setDepartments([]);
                setLoading(false);
                return;
            }
            const response = await axios.get("http://localhost:8080/api/v1/Department", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setDepartments(response.data);
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setDepartments(data);
            } else {
                setDepartments([]);
                // console.error('Invalid data format received for departments:', data);
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນພະແນກໄດ້. ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ.");
            }
        } catch (err: any) {
            // console.error("Error fetching departments:", err);
            setError(err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນພະແນກ.");
            setDepartments([]);
            showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນພະແນກ.");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        if (!user || user.role !== "Super_Admin") {
            setDepartments([]);
            setLoading(false);
            return;
        }
        fetchDepartments();
    }, []);

    const updateDepartment = async (updatedDepartment: Department): Promise<boolean> => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Department/${updatedDepartment.Department_ID}`, updatedDepartment, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ບັນທຶກຂໍ້ມູນພະແນກສຳເລັດ!");
                fetchDepartments(); // Refresh data
                return true;
            } else {
                showNotification("ຜິດພາດ", `ບໍ່ສາມາດອັບເດດພະແນກໄດ້: ${response.data?.message || 'ມີບາງຢ່າງຜິດພາດ.'}`);
                return false;
            }
        } catch (err: any) {
            console.error("Failed to update department:", err);
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດອັບເດດພະແນກໄດ້: ${err.response?.data?.message || err.message || 'ກະລຸນາລອງໃໝ່.'}`);
            return false;
        }
    };

    const deleteDepartment = async (departmentId: number): Promise<boolean> => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/Department/${departmentId}`);

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ລຶບພະແນກສຳເລັດ!");
                fetchDepartments(); // Refresh data
                return true;
            } else {
                showNotification("ຜິດພາດ", `ບໍ່ສາມາດລຶບພະແນກໄດ້: ${response.data?.message || 'ມີບາງຢ່າງຜິດພາດ.'}`);
                return false;
            }
        } catch (err: any) {
            console.error("Failed to delete department:", err);
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດລຶບພະແນກໄດ້: ${err.response?.data?.message || err.message || 'ກະລຸນາລອງໃໝ່.'}`);
            return false;
        }
    };

    return { departments, loading, error, fetchDepartments, updateDepartment, deleteDepartment };
};