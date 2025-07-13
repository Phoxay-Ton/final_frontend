// src/hooks/useAttendance.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Attendance, ClockActionPayload } from "@/src/types/attendance";

interface UseAttendanceResult {
    attendances: Attendance[];
    loading: boolean;
    error: string | null;
    fetchAttendances: () => Promise<void>;
    clockIn: (payload: ClockActionPayload) => Promise<boolean>;
    clockOut: (payload: ClockActionPayload) => Promise<boolean>;
    downloadAttendanceReport: (payload: {
        employeeIds: number[];
        fromDate: string;
        toDate: string;
    }) => Promise<void>;
}

export const useAttendance = (
    showNotification: (title: string, message: string) => void
): UseAttendanceResult => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const API_CLOCK_IN_URL = "http://192.168.213.194:8080/api/v1/Attendance/clock-in";

    // แก้ไข API URL ให้ถูกต้อง
    const API_BASE_URL = "http://localhost:8080/api/v1/Attendance";
    const API_CLOCK_IN_URL = "http://localhost:8080/api/v1/Attendance/clock-in";
    const API_CLOCK_OUT_URL = "http://localhost:8080/api/v1/Attendance/clock-out";
    const API_CLOCK_IN_OUT_URL = "http://localhost:8080/api/v1/Attendance/report";

    const fetchAttendances = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const userString =
                typeof window !== "undefined" ? localStorage.getItem("user") : null;
            const user = userString ? JSON.parse(userString) : null;

            if (!user) {
                setError("ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້.");
                setLoading(false);
                return;
            }

            // ใช้ endpoint เดียวกันสำหรับทุกคน โดยไม่แยก role
            const endpoint = `${API_BASE_URL}/all`;

            const response = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Fetch attendances response:", response.data); // Debug log

            const data = response.data?.data || response.data;
            if (Array.isArray(data)) {
                setAttendances(data);
            } else {
                setAttendances([]);
                console.log("Response data is not an array:", data);
            }
        } catch (err: any) {
            console.error("Error fetching attendances:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ."
            );
            setAttendances([]);
            showNotification("ຜິດພາດ", "ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ.");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchAttendances();
    }, [fetchAttendances]);

    const clockIn = async (payload: ClockActionPayload): Promise<boolean> => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            console.log("Clock in payload:", payload); // Debug log
            console.log("Clock in URL:", API_CLOCK_IN_URL); // Debug log

            const response = await axios.post(
                API_CLOCK_IN_URL, // แก้ไข URL ให้ถูกต้อง
                payload,

                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // console.log("Clock in response:", response.data); // Debug log

            if (response.status === 201 || response.status === 200) {
                showNotification("ສຳເລັດ", "ເຂົ້າວຽກສຳເລັດ!");
                await fetchAttendances(); // รอให้ fetch เสร็จก่อน
                return true;
            } else {
                showNotification(
                    "ຜິດພາດ",
                    response.data?.message || "ເຂົ້າວຽກບໍ່ສຳເລັດ."
                );
                return false;
            }
        } catch (err: any) {
            // console.error("Failed to clock in:", err);
            // console.error("Error response:", err.response?.data); // Debug log

            let errorMessage = "ກະລຸນາລອງໃໝ່.";
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            showNotification("ຜິດພາດ", errorMessage);
            return false;
        }
    };

    const clockOut = async (payload: ClockActionPayload): Promise<boolean> => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            // console.log("Clock out payload:", payload); // Debug log
            console.log("Clock out URL:", API_CLOCK_OUT_URL); // Debug log

            const response = await axios.post(
                API_CLOCK_OUT_URL, // แก้ไข URL ให้ถูกต้อง
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // console.log("Clock out response:", response.data); // Debug log

            if (response.status === 200 || response.status === 201) {
                showNotification("ສຳເລັດ", "ອອກວຽกສຳເລັດ!");
                await fetchAttendances(); // รอให้ fetch เสร็จก่อน
                return true;
            } else {
                showNotification(
                    "ຜິດພາດ",
                    response.data?.message || "ອອກວຽກບໍ່ສຳເລັດ."
                );
                return false;
            }
        } catch (err: any) {
            // console.error("Failed to clock out:", err);
            // console.error("Error response:", err.response?.data); // Debug log

            let errorMessage = "ກະລຸນາລອງໃໝ່.";
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            showNotification("ຜິດພາດ", errorMessage);
            return false;
        }
    };
    const downloadAttendanceReport = async (
        payload: {
            employeeIds: number[];
            fromDate: string;
            toDate: string;
        }
    ): Promise<void> => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await axios.post(`${API_CLOCK_IN_OUT_URL}/report`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                responseType: "blob", // สำคัญสำหรับไฟล์ PDF
            });

            // สร้างลิงก์ให้ดาวน์โหลด
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "attendance-report.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error("Error downloading report:", err);
            showNotification("ຜິດພາດ", "ດາວໂຫຼດລາຍງານບໍ່ສຳເລັດ");
        }
    };

    return {
        attendances,
        loading,
        error,
        fetchAttendances,
        clockIn,
        clockOut,
        downloadAttendanceReport,
    };
};