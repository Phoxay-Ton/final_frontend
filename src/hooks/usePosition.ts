// src/hooks/usePosition.ts
import { useState, useEffect } from "react";
import { positionService } from "@/src/services/positionService"; // Adjust the import path
import { Position } from "@/src/types/position"; // Adjust the import path

interface UsePositionHook {
    positions: Position[];
    loading: boolean;
    error: string | null;
    fetchPositions: () => Promise<void>;
    updatePosition: (updatedPosition: Position) => Promise<boolean>;
    deletePosition: (id: number) => Promise<boolean>;
}

export const usePosition = (showNotification: (title: string, message: string) => void): UsePositionHook => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPositions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await positionService.getPositions();
            setPositions(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch positions.";
            setError(errorMessage);
            showNotification("ຜິດພາດ", `ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນຕຳແໜ່ງ: ${errorMessage}`);
            setPositions([]); // Clear positions on error
        } finally {
            setLoading(false);
        }
    };

    const updatePosition = async (updatedPosition: Position): Promise<boolean> => {
        try {
            await positionService.updatePosition(updatedPosition);
            showNotification("ສຳເລັດ", "ບັນທຶກຂໍ້ມູນຕຳແໜ່ງສຳເລັດ!");
            fetchPositions(); // Re-fetch to update the list
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to update position.";
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດອັບເດດຕຳແໜ່ງໄດ້: ${errorMessage}`);
            return false;
        }
    };

    const deletePosition = async (id: number): Promise<boolean> => {
        try {
            await positionService.deletePosition(id);
            showNotification("ສຳເລັດ", "ລຶບຕຳແໜ່ງສຳເລັດ!");
            fetchPositions(); // Re-fetch to update the list
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to delete position.";
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດລຶບຕຳແໜ່ງໄດ້: ${errorMessage}`);
            return false;
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    return { positions, loading, error, fetchPositions, updatePosition, deletePosition };
};