// src/services/positionService.ts
import axios from "axios";
import { Position } from "@/src/types/position"; // Adjust the import path as needed

const API_BASE_URL = "http://localhost:8080/api/v1/Position";

export const positionService = {
    getPositions: async (): Promise<Position[]> => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: { "Content-Type": "application/json" },
            });
            const data = response.data?.data;
            if (Array.isArray(data)) {
                return data;
            }
            console.error('Invalid data format received for positions:', data);
            throw new Error('Invalid data format');
        } catch (error) {
            console.error("Error fetching positions:", error);
            throw error;
        }
    },

    updatePosition: async (position: Position): Promise<Position> => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${position.Position_ID}`, position, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to update position:", error);
            throw error;
        }
    },

    deletePosition: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error("Failed to delete position:", error);
            throw error;
        }
    },

    createPosition: async (positionName: string): Promise<Position> => {
        try {
            const response = await axios.post(API_BASE_URL, { Position_Name: positionName }, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to create position:", error);
            throw error;
        }
    }
};