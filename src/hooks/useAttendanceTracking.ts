// src/hooks/useAttendanceTracking.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AdminAttendanceRecord } from "@/src/types/attendanceTracking"; // Using the admin specific type

interface UseAttendanceTrackingResult {
    attendanceRecords: AdminAttendanceRecord[];
    loading: boolean;
    error: string | null;
    fetchAttendanceRecords: () => Promise<void>;
    // Add update/delete functions here if admin can perform those actions
    // updateAttendanceRecord: (updatedRecord: AdminAttendanceRecord) => Promise<boolean>;
    // deleteAttendanceRecord: (attendanceId: number) => Promise<boolean>;
}

export const useAttendanceTracking = (showNotification: (title: string, message: string) => void): UseAttendanceTrackingResult => {
    const [attendanceRecords, setAttendanceRecords] = useState<AdminAttendanceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Endpoint for fetching all attendance (adjust if your API has a different endpoint for admin)
    const API_URL = "http://localhost:8080/api/v1/Attendance"; // Assuming this returns all or can be filtered by admin role

    const fetchAttendanceRecords = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const userString = typeof window !== "undefined" ? localStorage.getItem("user") : null;
            const user = userString ? JSON.parse(userString) : {};

            // เช็คให้รองรับทั้ง Admin และ Super_Admin (ไม่สนตัวพิมพ์)
            const allowedRoles = ["admin", "super_admin"];
            if (!user.role || !allowedRoles.includes(user.role.toLowerCase())) {
                setError("ທ່ານບໍ່ມີສິດເຂົ້າເຖິງຂໍ້ມູນນີ້.");
                setAttendanceRecords([]);
                setLoading(false);
                return;
            }

            const response = await axios.get(API_URL, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data?.data;
            if (Array.isArray(data)) {
                setAttendanceRecords(data as AdminAttendanceRecord[]);
            } else {
                setAttendanceRecords([]);
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຕິດຕາມການເຂົ້າ-ອອກວຽກໄດ້. ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ.");
            }
        } catch (err: any) {
            console.error("Error fetching attendance records for admin:", err);
            setError(err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນຕິດຕາມການເຂົ້າ-ອອກວຽກ.");
            setAttendanceRecords([]);
            showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນຕິດຕາມການເຂົ້າ-ອອກວຽກ.");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchAttendanceRecords();
    }, [fetchAttendanceRecords]);

    // Dependency array to refetch when function changes

    // Implement update/delete functions here if needed, similar to useDepartment
    // const updateAttendanceRecord = async (...) => { ... };
    // const deleteAttendanceRecord = async (...) => { ... };

    return { attendanceRecords, loading, error, fetchAttendanceRecords };
};