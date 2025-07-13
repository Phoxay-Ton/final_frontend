import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ManageTask, AddManageTaskPayload } from "@/src/types/manageTask";
import { useAuth } from "@/src/hooks/useAuth";

interface Employee {
    Employee_ID: number;
    Name: string;
}

interface Division {
    Division_ID: number;
    Division_Name: string;
}

export interface UseManageTaskResult {
    manageTasks: ManageTask[];
    employees: Employee[];
    divisions: Division[];
    loading: boolean;
    error: string | null;
    fetchManageTasks: () => Promise<void>;
    fetchEmployeesByDivision: (divisionId: number | null) => Promise<void>;
    fetchDivisions: () => Promise<void>;
    updateManageTask: (updatedTask: ManageTask) => Promise<boolean>;
    deleteManageTask: (taskId: number) => Promise<boolean>;
    addManageTask: (payload: AddManageTaskPayload, file: File | null) => Promise<boolean>;
}

type ShowNotificationFunc = (title: string, message: string) => void;

export const useManageTask = (
    showNotification: ShowNotificationFunc
): UseManageTaskResult => {
    const [manageTasks, setManageTasks] = useState<ManageTask[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const TASK_API_BASE_URL = "http://localhost:8080/api/v1/Task";
    const ALL_DIVISIONS_API_URL = "http://localhost:8080/api/v1/Division";

    const getAuthHeaders = useCallback(() => {
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }, [token]);

    const getFormDataAuthHeaders = useCallback(() => {
        return {
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }, [token]);

    const fetchManageTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

        if (!currentToken) {
            setError("No authentication token found.");
            setLoading(false);
            showNotification("ຜິດພາດ", "ບໍ່ມີການເຂົ້າສູ່ລະບົບ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
            return;
        }

        try {
            const response = await axios.get(`${TASK_API_BASE_URL}/all-user`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentToken}`,
                },
            });

            const data = response.data?.data;

            if (Array.isArray(data)) {
                setManageTasks(data);
            } else {
                setManageTasks([]);
                console.error("Invalid data format for manage tasks:", data);
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນວຽກໄດ້.");
            }

        } catch (err: any) {
            console.error("Error fetching manage tasks:", err);
            const errorMessage =
                err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດວຽກ.";
            setError(errorMessage);
            showNotification("ຜິດພາດ", errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, showNotification, TASK_API_BASE_URL]);

    const fetchEmployeesByDivision = useCallback(async (divisionId: number | null) => {
        // ป้องกัน setState ซ้ำซ้อน
        if (!divisionId || divisionId === 0) {
            if (employees.length !== 0) setEmployees([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            console.log(`Fetching employees for division ID: ${divisionId}`);
            const response = await axios.get(`${TASK_API_BASE_URL}/all-division-employee/${divisionId}`, {
                headers: getAuthHeaders(),
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setEmployees(data);
                console.log("Successfully fetched employees:", data);
            } else {
                setEmployees([]);
                console.error("Invalid data format for employees:", data);
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນພະນັກງານໄດ້.");
            }
        } catch (err: any) {
            console.error(`Error fetching employees for division ${divisionId}:`, err);
            const errorMessage =
                err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດພະນັກງານ.";
            setError(errorMessage);
            showNotification("ຜິດພາດ", errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders, showNotification, TASK_API_BASE_URL, employees.length]);

    const fetchDivisions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(ALL_DIVISIONS_API_URL, {
                headers: getAuthHeaders(),
            });
            const data = response.data?.data;
            console.log("..........fetchDivisions API response:", data);
            if (Array.isArray(data)) {
                setDivisions(data);
                console.log("-------setDivisions:", data);
            } else {
                setDivisions([]);
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂະແໜງໄດ້.");
            }
        } catch (err: any) {
            console.error("Error fetching divisions:", err);
            const errorMessage =
                err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂະແໜງ.";
            setError(errorMessage);
            showNotification("ຜິດພາດ", errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders, showNotification, ALL_DIVISIONS_API_URL]);

    const addManageTask = useCallback(async (
        payload: AddManageTaskPayload,
        file: File | null
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການເຂົ້າສູ່ລະບົບ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                return false;
            }

            const formData = new FormData();

            // Format dates to match backend expectations
            const formatDateForBackend = (dateString: string) => {
                if (!dateString) return null;
                // Convert YYYY-MM-DD to ISO string with time
                const date = new Date(dateString + 'T08:00:00.000Z');
                return date.toISOString();
            };

            const backendPayload = {
                task_name: payload.Task_name,
                description: payload.Description,
                attachment: payload.Attachment,
                employee_id: payload.Employee_ID,
                division_id: payload.Division_ID,
                start_date: formatDateForBackend(payload.Start_Date),
                end_date: formatDateForBackend(payload.End_Date), // Fixed: Use End_Date instead of End_date
                status: payload.Status,
            };

            console.log("Backend payload being sent:", backendPayload);

            formData.append('data', JSON.stringify(backendPayload));

            if (file) {
                formData.append('document', file);
            }

            const response = await axios.post(`${TASK_API_BASE_URL}`, formData, {
                headers: getFormDataAuthHeaders(),
            });

            if (response.status === 201 || response.status === 200) {
                showNotification("ສຳເລັດ", "ເພີ່ມວຽກສຳເລັດແລ້ວ!");
                await fetchManageTasks();
                return true;
            } else {
                showNotification("ຜິດພາດ", "ເພີ່ມວຽກບໍ່ສຳເລັດ.");
                return false;
            }
        } catch (err: any) {
            console.error("Failed to add manage task:", err);
            const errorMessage =
                err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມວຽກ. ກະລຸນາລອງໃໝ່.";
            showNotification("ຜິດພາດ", errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, showNotification, getFormDataAuthHeaders, TASK_API_BASE_URL, fetchManageTasks]);

    const updateManageTask = useCallback(async (updatedTask: ManageTask): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການເຂົ້າສູ່ລະບົບ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                return false;
            }
            const { manage_tasks_details, ...taskData } = updatedTask;

            const response = await axios.put(
                `${TASK_API_BASE_URL}/${updatedTask.Task_ID}`,
                taskData,
                { headers: getAuthHeaders() }
            );

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ອັບເດດວຽກສຳເລັດແລ້ວ.");
                await fetchManageTasks();
                return true;
            } else {
                showNotification("ຜິດພາດ", "ອັບເດດວຽກບໍ່ສຳເລັດ.");
                return false;
            }
        } catch (err: any) {
            console.error("Failed to update task:", err);
            const errorMessage =
                err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ. ກະລຸນາລອງໃໝ່.";
            showNotification("ຜິດພາດ", errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, showNotification, getAuthHeaders, TASK_API_BASE_URL, fetchManageTasks]);

    const deleteManageTask = useCallback(async (taskId: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການເຂົ້າສູ່ລະບົບ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                return false;
            }
            const response = await axios.delete(`${TASK_API_BASE_URL}/${taskId}`, {
                headers: getAuthHeaders(),
            });

            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ລຶບວຽກສຳເລັດແລ້ວ.");
                await fetchManageTasks();
                return true;
            } else {
                showNotification("ຜິດພາດ", "ລຶບວຽກບໍ່ສຳເລັດ.");
                return false;
            }
        } catch (err: any) {
            console.error("Failed to delete task:", err);
            const errorMessage =
                err.response?.data?.message || err.message || "ເກີດຂໍ້ຜິດພາດໃນການລຶບ. ກະລຸນາລອງໃໝ່.";
            showNotification("ຜິດພາດ", errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [token, showNotification, getAuthHeaders, TASK_API_BASE_URL, fetchManageTasks]);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            setLoading(true);
            await Promise.all([
                fetchManageTasks(),
                fetchDivisions(),
            ]);
            setLoading(false);
        };

        loadInitialData();
    }, [token, fetchManageTasks, fetchDivisions, showNotification]);

    return {
        manageTasks,
        employees,
        divisions,
        loading,
        error,
        fetchManageTasks,
        fetchEmployeesByDivision,
        fetchDivisions,
        updateManageTask,
        deleteManageTask,
        addManageTask,
    };
};