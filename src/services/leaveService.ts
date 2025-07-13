// // src/services/leaveService.ts
// import axios from 'axios';
// import { Leave } from '@/src/types/leave'; // Adjust the import path as needed

// const API_BASE_URL = "http://localhost:8080/api/v1/Leave";

// export const leaveService = {
//     getLeaves: async (): Promise<Leave[]> => {
//         const response = await axios.get(API_BASE_URL, {
//             headers: { "Content-Type": "application/json" },
//         });
//         // Assuming your API returns data in response.data.data
//         if (Array.isArray(response.data?.data)) {
//             return response.data.data;
//         }
//         throw new Error("Invalid data format received for leaves.");
//     },

//     updateLeave: async (leave: Leave): Promise<Leave> => {
//         const response = await axios.put(`${API_BASE_URL}/${leave.leave_id}`, leave, {
//             headers: { "Content-Type": "application/json" },
//         });
//         return response.data;
//     },

//     deleteLeave: async (id: number): Promise<void> => {
//         await axios.delete(`${API_BASE_URL}/${id}`);
//     },
// };