// src/hooks/useLeave.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Leave, Employee, LeaveType } from "@/src/types/leave"; // Adjust import paths as needed

interface UseLeaveResult {
    leaves: Leave[];
    employees: Employee[]; // Assuming you'll need employee names for the table/modal
    leaveTypes: LeaveType[]; // Assuming you'll need leave type names
    loading: boolean;
    error: string | null;
    fetchLeaves: () => Promise<void>;
    updateLeave: (updatedLeave: Leave) => Promise<boolean>;
    deleteLeave: (leaveId: number) => Promise<boolean>;
    createLeave: (newLeave: Omit<Leave, "id">) => Promise<boolean>;
}

export const useLeave = (
    showNotification: (title: string, message: string) => void
): UseLeaveResult => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Memoized function to fetch leave requests
    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        try {
            const response = await axios.get("http://localhost:8080/api/v1/Leave", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setLeaves(data);
            } else {
                setLeaves([]);
                // console.error("Invalid data format received for leaves:", data);
                showNotification(
                    "ຜິດພາດ",
                    "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການລາພັກໄດ້. ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ."
                );
            }
        } catch (err: any) {
            // console.error("Error fetching leaves:", err);
            setError(
                err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນການລາພັກ."
            );
            setLeaves([]);
            showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນການລາພັກ.");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);
    useEffect(() => {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        const allowedRoles = ["Admin", "Super_Admin"];
        if (!user || !user.role || !allowedRoles.includes(user.role.toLowerCase())) {
            setLeaves([]);
            setLoading(false);
            return;
        }
        fetchLeaves();
    }, []);
    const createLeave = async (newLeave: Omit<Leave, "id">): Promise<boolean> => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        console.log("📤 Payload ที่จะส่งไป backend:", newLeave);

        try {
            const response = await axios.post("http://localhost:8080/api/v1/Leave", newLeave, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const created = response.data?.data;
            if (created) {
                // เพิ่ม leave ใหม่ลงใน state โดยไม่ต้อง fetch ใหม่ก็ได้ หรือจะ fetchLeaves() ก็ได้
                setLeaves(prev => [...prev, created]);
                showNotification("ສຳເລັດ", "ບັນທຶກການລາພັກໃໝ່ສຳເລັດ.");
                return true;
            } else {
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດສ້າງການລາພັກໄດ້.");
                return false;
            }
        } catch (err: any) {
            // console.error("Error creating leave:", err);
            console.log("🛑 Response Error:", err.response?.data);
            showNotification("ຜິດພາດ", err.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການສ້າງການລາພັກ.");
            return false;
        }
    };
    useEffect(() => {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        const allowedRoles = ["Admin", "Super_Sdmin"];
        if (!user || !user.role || !allowedRoles.includes(user.role.toLowerCase())) {
            setLeaves([]);
            setLoading(false);
            return;
        }
        fetchLeaves();
    }, []);

    // Memoized function to fetch employee data (for names in table/modal)
    const fetchEmployees = useCallback(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const userString = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        const user = userString ? JSON.parse(userString) : null;

        if (!token || !user) {
            console.warn("❌ No token or user found.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/v1/Employee/all-approval", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = response.data?.data;

            if (Array.isArray(data)) {
                // ✅ ไม่ต้อง filter เพิ่ม เพราะ backend จัดการตาม role แล้ว
                setEmployees(data);
                console.log("✅ Fetched employees for role:", user.role, data);
            } else {
                setEmployees([]);
                // console.error("⚠️ Invalid data format:", data);
            }
        } catch (err) {
            // console.error("❌ Error fetching employees:", err);
            setEmployees([]);
        }
    }, []);



    // Memoized function to fetch leave types
    const fetchLeaveTypes = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/Leave_Type", {
                headers: { "Content-Type": "application/json" },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setLeaveTypes(data);
            } else {
                setLeaveTypes([]);
                // console.error("Invalid data format received for leave tຝypes:", data);
            }
        } catch (err) {
            // console.error("Error fetching leave types:", err);
            setLeaveTypes([]);
        }
    }, []);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchLeaves();
        fetchEmployees(); // Fetch employees on mount
        fetchLeaveTypes(); // Fetch leave types on mount
    }, [fetchLeaves, fetchEmployees, fetchLeaveTypes]);

    // Function to update a leave request
    const updateLeave = async (updatedLeave: Leave): Promise<boolean> => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/Leave/${updatedLeave.Leave_ID}`, // แก้ไขจาก Leave_type_ID เป็น Leave_ID
                updatedLeave,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ບັນທຶກຂໍ້ມູນການລາພັກສຳເລັດ!");
                fetchLeaves(); // Refresh data after successful update
                return true;
            } else {
                showNotification(
                    "ຜິດພາດ",
                    `ບໍ່ສາມາດອັບເດດການລາພັກໄດ້: ${response.data?.message || "ມີບາງຢ່າງຜິດພາດ."}`
                );
                return false;
            }
        } catch (err: any) {
            // console.error("Failed to update leave:", err);
            showNotification(
                "ຜິດພາດ",
                `ບໍ່ສາມາດອັບເດດການລາພັກໄດ້: ${err.response?.data?.message || err.message || "ກະລຸນາລອງໃໝ່."}`
            );
            return false;
        }
    };
    // Function to delete a leave request
    const deleteLeave = async (leaveId: number): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token"); // ดึง token มาใช้
            const response = await axios.delete(
                `http://localhost:8080/api/v1/Leave/${leaveId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ລຶບການລາພັກສຳເລັດ!");
                fetchLeaves(); // Refresh data
                return true;
            } else {
                showNotification(
                    "ຜິດພາດ",
                    `ບໍ່ສາມາດລຶບການລາພັກໄດ້: ${response.data?.message || "ມີບາງຢ່າງຜິດພາດ."}`
                );
                return false;
            }
        } catch (err: any) {
            showNotification(
                "ຜິດພາດ",
                `ບໍ່ສາມາດລຶບການລາພັກໄດ້: ${err.response?.data?.message || err.message || "ກະລຸນາລອງໃໝ່."}`
            );
            return false;
        }
    };


    return {
        leaves,
        employees,
        leaveTypes,
        loading,
        error,
        fetchLeaves,
        updateLeave,
        deleteLeave,
        createLeave,
    };
};