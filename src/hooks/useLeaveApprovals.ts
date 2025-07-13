// src/hooks/useLeaveApprovals.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { LeaveApproval, UpdateLeaveApprovalPayload, Employee, LeaveType } from "@/src/types/leave";

interface UseLeaveApprovalsResult {
    pendingApprovals: LeaveApproval[];
    loadingApprovals: boolean;
    errorApprovals: string | null;
    fetchPendingApprovals: (approverId: number) => Promise<void>;
    handleApproveReject: (payload: UpdateLeaveApprovalPayload) => Promise<boolean>;
    employees: Employee[];
    leaveTypes: LeaveType[];
    loadingData: boolean;
    errorData: string | null;
}

export const useLeaveApprovals = (
    showNotification: (title: string, message: string) => void
): UseLeaveApprovalsResult => {
    const [pendingApprovals, setPendingApprovals] = useState<LeaveApproval[]>([]);
    const [loadingApprovals, setLoadingApprovals] = useState<boolean>(true);
    const [errorApprovals, setErrorApprovals] = useState<string | null>(null);

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [errorData, setErrorData] = useState<string | null>(null);

    // Helper function to get token safely
    const getToken = useCallback(() => {
        if (typeof window === "undefined") return null;

        const token = localStorage.getItem("token");
        console.log("📌 [DEBUG] Token from localStorage:", token ? "Found" : "Not found");

        if (!token) {
            showNotification("ຜິດພາດ", "Token not found. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
            return null;
        }

        return token;
    }, [showNotification]);

    // Helper function to get user safely
    const getUser = useCallback(() => {
        if (typeof window === "undefined") return null;

        try {
            const userString = localStorage.getItem("user");
            if (!userString) {
                console.warn("📌 [DEBUG] User not found in localStorage");
                return null;
            }

            const user = JSON.parse(userString);
            console.log("📌 [DEBUG] User from localStorage:", user);
            return user;
        } catch (error) {
            console.error("📌 [ERROR] Error parsing user from localStorage:", error);
            return null;
        }
    }, []);

    const fetchEmployees = useCallback(async () => {
        setLoadingData(true);
        setErrorData(null);

        const token = getToken();
        if (!token) {
            setLoadingData(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/v1/Employee", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = response.data?.data;
            if (Array.isArray(data)) {
                setEmployees(data);
                console.log("📌 [DEBUG] Employees loaded:", data.length);
            } else {
                setEmployees([]);
                setErrorData("Invalid employee data format.");
            }
        } catch (err: any) {
            console.error("📌 [ERROR] Error fetching employees:", err);
            setEmployees([]);
            setErrorData(err.response?.data?.message || err.message || "Failed to load employee data.");
        } finally {
            setLoadingData(false);
        }
    }, [getToken]);

    const fetchLeaveTypes = useCallback(async () => {
        setLoadingData(true);
        setErrorData(null);

        const token = getToken();
        if (!token) {
            setLoadingData(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/v1/Leave_Type", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = response.data?.data;
            if (Array.isArray(data)) {
                setLeaveTypes(data);
                console.log("📌 [DEBUG] Leave types loaded:", data.length);
            } else {
                setLeaveTypes([]);
                setErrorData("Invalid leave type data format.");
            }
        } catch (err: any) {
            console.error("📌 [ERROR] Error fetching leave types:", err);
            setLeaveTypes([]);
            setErrorData(err.response?.data?.message || err.message || "Failed to load leave type data.");
        } finally {
            setLoadingData(false);
        }
    }, [getToken]);

    const fetchPendingApprovals = useCallback(async (approverId: number) => {
        console.log("📌 [DEBUG] Start fetching approvals for Approver ID:", approverId);

        setLoadingApprovals(true);
        setErrorApprovals(null);

        if (!approverId) {
            console.warn("📌 [DEBUG] No approverId provided, skipping fetch.");
            setPendingApprovals([]);
            setLoadingApprovals(false);
            return;
        }

        const token = getToken();
        if (!token) {
            setLoadingApprovals(false);
            return;
        }

        try {
            console.log("📌 [DEBUG] Sending GET request to LeaveApproval API...");
            const response = await axios.get("http://localhost:8080/api/v1/LeaveApprova", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data?.data;
            console.log("📌 [DEBUG] Raw data received from API:", data);

            if (Array.isArray(data)) {
                const filtered = data.filter(
                    (approval) =>
                        approval.Approval_person === approverId &&
                        approval.Status === "pending"
                );

                console.log("📌 [DEBUG] Filtered data (pending approvals):", filtered);
                setPendingApprovals(filtered);

                if (filtered.length === 0) {
                    console.log("📌 [DEBUG] No pending approvals found for this approver");
                }
            } else {
                console.error("📌 [ERROR] Invalid data format received from API:", data);
                setPendingApprovals([]);
                showNotification(
                    "ຜິດພາດ",
                    "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການອະນຸມັດໄດ້. ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ."
                );
            }
        } catch (err: any) {
            console.error("📌 [ERROR] Error fetching pending approvals:", err);

            let errorMessage = "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນການອະນຸມັດ.";

            if (err.response?.status === 401) {
                errorMessage = "Token ໝົດອາຍຸ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.";
            } else if (err.response?.status === 403) {
                errorMessage = "ບໍ່ມີສິດໃນການເຂົ້າເຖິງຂໍ້ມູນນີ້.";
            }

            setErrorApprovals(errorMessage);
            setPendingApprovals([]);
            showNotification("ຜິດພາດ", errorMessage);
        } finally {
            setLoadingApprovals(false);
        }
    }, [getToken, showNotification]);

    const handleApproveReject = async (payload: UpdateLeaveApprovalPayload): Promise<boolean> => {
        const token = getToken();
        if (!token) {
            return false;
        }

        try {
            console.log("📌 [DEBUG] Sending approve/reject request:", payload);

            const response = await axios.post(
                "http://localhost:8080/api/v1/LeaveApprova",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                showNotification(
                    "ສຳເລັດ",
                    `ການລາພັກຖືກ ${payload.status === "approved" ? "ອະນຸມັດ" : "ປະຕິເສດ"} ແລ້ວ.`
                );

                // Refresh the approvals list
                const user = getUser();
                if (user && user.approverId) {
                    console.log("📌 [DEBUG] Refreshing approvals for approver:", user.approverId);
                    await fetchPendingApprovals(user.approverId);
                } else {
                    console.warn("📌 [DEBUG] Approver ID not found in user object.");
                }

                return true;
            } else {
                showNotification(
                    "ຜິດພາດ",
                    `ບໍ່ສາມາດ ${payload.status === "approved" ? "ອະນຸມັດ" : "ປະຕິເສດ"} ການລາພັກໄດ້.`
                );
                return false;
            }
        } catch (err: any) {
            console.error("📌 [ERROR] Error in approve/reject:", err);

            let errorMessage = `ເກີດຂໍ້ຜິດພາດໃນການ${payload.status === "approved" ? "ອະນຸມັດ" : "ປະຕິເສດ"}ການລາພັກ.`;

            if (err.response?.status === 401) {
                errorMessage = "Token ໝົດອາຍຸ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.";
            }

            showNotification("ຜິດພາດ", err.response?.data?.message || errorMessage);
            return false;
        }
    };

    // Initialize data on mount
    useEffect(() => {
        console.log("📌 [DEBUG] useLeaveApprovals - Component mounted, initializing data...");

        // Check if we're in browser environment
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");

            console.log("📌 [DEBUG] Initial check - Token:", token ? "Found" : "Not found");
            console.log("📌 [DEBUG] Initial check - User:", user ? "Found" : "Not found");

            if (token && user) {
                fetchEmployees();
                fetchLeaveTypes();

                // Auto-fetch approvals if user has approverId
                try {
                    const userData = JSON.parse(user);
                    if (userData.approverId) {
                        console.log("📌 [DEBUG] Auto-fetching approvals for approver:", userData.approverId);
                        fetchPendingApprovals(userData.approverId);
                    }
                } catch (error) {
                    console.error("📌 [ERROR] Error parsing user data:", error);
                }
            } else {
                console.warn("📌 [DEBUG] Missing token or user data - skipping initial data fetch");
                showNotification("ຜິດພາດ", "ບໍ່ພົບຂໍ້ມູນການເຂົ້າສູ່ລະບົບ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
            }
        }
    }, []);

    return {
        pendingApprovals,
        loadingApprovals,
        errorApprovals,
        fetchPendingApprovals,
        handleApproveReject,
        employees,
        leaveTypes,
        loadingData,
        errorData,
    };
};