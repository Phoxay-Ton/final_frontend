import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Division, Department } from "@/src/types/division";

interface UseDivisionResult {
    divisions: Division[];
    departments: Department[];
    loading: boolean;
    error: string | null;
    fetchDivisions: () => Promise<void>;
    updateDivision: (updatedDivision: Division) => Promise<boolean>;
    deleteDivision: (divisionId: number) => Promise<boolean>;
    addDivision: (newDivision: Division) => Promise<boolean>;
}

export const useDivision = (showNotification: (title: string, message: string) => void): UseDivisionResult => {
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDivisions = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
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
                throw new Error("Invalid data format for divisions");
            }
        } catch (err: any) {
            console.error("Error fetching divisions:", err);
            setError(err.response?.data?.message || err.message);
            setDivisions([]);
            showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຂະແໜງໄດ້");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    const fetchDepartments = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/v1/department", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                setDepartments(data);
            } else {
                throw new Error("Invalid data format for departments");
            }
        } catch (err: any) {
            console.error("Error fetching departments:", err);
            setDepartments([]);
            showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດລາຍຊື່ພະແນກໄດ້");
        }
    }, [showNotification]);

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchDivisions(),
                fetchDepartments()
            ]);
        };
        loadData();
    }, [fetchDivisions, fetchDepartments]);

    const addDivision = async (newDivision: Division): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");
            const payload = {
                Division_Name: newDivision.Division_Name,
                Phone: newDivision.Phone,
                Email: newDivision.Email,
                Department_ID: newDivision.Department_ID,
                contact_person: newDivision.Contact_Person ?? "",
            };
            const response = await axios.post(
                `http://localhost:8080/api/v1/Division`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ເພີ່ມຂະແໜງສຳເລັດ!");
                await fetchDivisions();
                return true;
            }
            throw new Error("Add division failed");
        } catch (err: any) {
            console.error("Failed to add division:", err);
            showNotification("ຜິດພາດ", err.response?.data?.message || "ກະລຸນາລອງໃໝ່");
            return false;
        }
    };


    const updateDivision = async (updatedDivision: Division): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");
            const { Division_ID } = updatedDivision;
            const payload = {
                Division_Name: updatedDivision.Division_Name,
                Phone: updatedDivision.Phone,
                Email: updatedDivision.Email,
                Department_ID: updatedDivision.Department_ID,
                contact_person: updatedDivision.Contact_Person ?? "",
            };
            const response = await axios.put(
                `http://localhost:8080/api/v1/Division/${Division_ID}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ອັບເດດຂະແໜງສຳເລັດ!");
                await fetchDivisions();
                return true;
            }
            throw new Error("Update failed");
        } catch (err: any) {
            console.error("Failed to update division:", err);
            showNotification("ຜິດພາດ", err.response?.data?.message || "ກະລຸນາລອງໃໝ່");
            return false;
        }
    };

    const deleteDivision = async (divisionId: number): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:8080/api/v1/Division/${divisionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status === 200) {
                showNotification("ສຳເລັດ", "ລຶບຂະແໜງສຳເລັດ!");
                await fetchDivisions();
                return true;
            }
            throw new Error("Delete failed");
        } catch (err: any) {
            console.error("Failed to delete division:", err);
            showNotification("ຜິດພາດ", err.response?.data?.message || "ກະລຸນາລອງໃໝ່");
            return false;
        }
    };

    return { divisions, departments, loading, error, fetchDivisions, updateDivision, deleteDivision, addDivision };
};
