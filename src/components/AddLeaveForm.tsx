import React, { useState, useEffect } from "react";
import { AddLeave, Employee, LeaveType } from "@/src/types/leave";

interface AddLeaveFormProps {
    onSubmit: (newLeaveData: AddLeave) => void; // This expects camelCase AddLeave
    onCancel: () => void;
    employees: Employee[];
    leaveTypes: LeaveType[];
    loadingData: boolean;
    errorData: string | null;
    currentEmployeeId: number; // Add current logged-in employee ID
}

export default function AddLeaveForm({
    onSubmit,
    onCancel,
    employees,
    leaveTypes,
    loadingData,
    errorData,
    currentEmployeeId,
}: AddLeaveFormProps) {
    // State to hold the new leave request data (using camelCase as per AddLeave type)
    const [newLeave, setNewLeave] = useState<AddLeave>({
        // employeeId: currentEmployeeId, // Initialize employeeId with the current logged-in employee's ID
        Leave_type_ID: 0,
        From_date: "",
        To_date: "",
        Leave_days: 0,
        Description: "",
        Approval_person: 0,
    });

    // Effect to reset form state and update employeeId when currentEmployeeId changes or other data loads
    useEffect(() => {
        setNewLeave(prev => ({
            ...prev,
            employeeId: currentEmployeeId, // Ensure employeeId is always synced with the current logged-in user
            leaveTypeId: 0, // Reset other fields for a clean form
            fromDate: "",
            toDate: "",
            leaveDays: 0,
            description: "",
            approvalPerson: 0,
        }));
    }, [currentEmployeeId, employees, leaveTypes]); // Dependencies ensure this runs when key data changes

    // Handle changes to form input fields
    // Handle changes to form input fields
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setNewLeave((prev) => {
            let updatedValue: string | number = value;

            // Convert to number for specific numeric fields
            if (
                name === "Leave_type_ID" ||
                name === "Leave_days" ||
                name === "Approval_person"
            ) {
                updatedValue = parseInt(value, 10) || 0;
            }

            // Create a new object with the updated field
            const updatedLeaveData = { ...prev, [name]: updatedValue };

            // Auto-calculate leaveDays if fromDate or toDate are changed
            // Fixed: Check for actual field names "From_date" and "To_date"
            if (name === "From_date" || name === "To_date") {
                const from = new Date(updatedLeaveData.From_date);
                const to = new Date(updatedLeaveData.To_date);

                // Calculate days only if both dates are valid and 'from' date is not after 'to' date
                if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && from <= to) {
                    // Calculate difference in days, add 1 to include the start day
                    const diffTime = Math.abs(to.getTime() - from.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    updatedLeaveData.Leave_days = diffDays + 1;
                } else {
                    updatedLeaveData.Leave_days = 0; // Reset if dates are invalid or out of order
                }
            }

            return updatedLeaveData;
        });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default browser form submission
        onSubmit(newLeave); // Call the onSubmit prop with the current leave data (camelCase)
    };

    // Find the current employee's name for display (not for selection)
    const currentEmployee = employees.find(emp => emp.Employee_ID === currentEmployeeId);
    const currentEmployeeName = currentEmployee ? currentEmployee.Name : "ກຳລັງໂຫຼດ...";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display current employee's name (applicant) - read-only */}
            <div>
                {/* <label
                    htmlFor="Employee_Name_Display"
                    className="block text-md font-medium text-gray-700 mb-1"
                >
                    ຊື່ພະນັກງານ
                </label> */}
                {/* <input
                    type="text"
                    id="Employee_Name_Display"
                    value={loadingData ? "ກຳລັງໂຫຼດ..." : errorData ? "ຜິດພາດໃນການໂຫຼດ" : currentEmployeeName}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 bg-gray-100 cursor-not-allowed"
                    readOnly // This field is for display only
                />
                {/* Hidden input to ensure employeeId is part of the form data submitted */}
                <input
                    type="hidden"
                    name="employeeId" // Correct camelCase name for internal state
                    value={currentEmployeeId}
                />
            </div>

            {/* Leave Type selection dropdown */}
            <div>
                <label htmlFor="leaveTypeId" className="block text-md font-medium text-gray-700 mb-1">
                    ປະເພດການພັກ
                </label>
                <select
                    id="Leave_type_ID"
                    name="Leave_type_ID" // Correct camelCase name for internal state
                    value={newLeave.Leave_type_ID}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value={0}> ເລືອກປະເພດການພັກ </option>
                    {loadingData ? (
                        <option disabled>ກຳລັງໂຫຼດ...</option>
                    ) : errorData ? (
                        <option disabled>{errorData}</option>
                    ) : (
                        leaveTypes.map((lt) => (
                            <option key={lt.id} value={lt.id}>
                                {lt.name}
                            </option>
                        ))
                    )}
                </select>
            </div>
            {/* From Date and To Date inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fromDate" className="block text-md font-medium text-gray-700 mb-1">
                        ວັນເລີ່ມພັກ
                    </label>
                    <input
                        type="date"
                        id="From_date"
                        name="From_date" // Correct camelCase name for internal state
                        value={newLeave.From_date}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="toDate" className="block text-md font-medium text-gray-700 mb-1">
                        ວັນສິ້ນສຸດ
                    </label>
                    <input
                        type="date"
                        id="To_date"
                        name="To_date" // Correct camelCase name for internal state
                        value={newLeave.To_date}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            {/* Leave Days input (auto-calculated and read-only) */}
            <div>
                <label htmlFor="Leave_days" className="block text-md font-medium text-gray-700 mb-1">
                    ຈຳນວນມື້ພັກ
                </label>
                <input
                    // type="number"
                    id="Leave_days"
                    name="Leave_days" // Correct camelCase name for internal state
                    value={newLeave.Leave_days}
                    onChange={handleChange} // Keep onChange for consistency if you ever want to make it editable
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 bg-gray-100 cursor-not-allowed"
                    readOnly
                />
            </div>

            {/* Description textarea */}
            <div>
                <label htmlFor="description" className="block text-md font-medium text-gray-700 mb-1">
                    ລາຍລະອຽດ
                </label>
                <textarea
                    id="Description"
                    name="Description" // Correct camelCase name for internal state
                    value={newLeave.Description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ປ້ອນລາຍລະອຽດການລາພັກ..."
                    required
                ></textarea>
            </div>

            {/* Approval Person selection dropdown */}
            <div>
                <label htmlFor="approvalPerson" className="block text-md font-medium text-gray-700 mb-1">
                    ຜູ້ອະນຸມັດ
                </label>
                <select
                    id="Approval_person"
                    name="Approval_person" // Correct camelCase name for internal state
                    value={newLeave.Approval_person}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value={0}> ເລືອກຜູ້ອະນຸມັດ </option>

                    {loadingData ? (
                        <option disabled>ກຳລັງໂຫຼດ...</option>
                    ) : errorData ? (
                        <option disabled>{errorData}</option>
                    ) : (

                        employees
                            .filter(emp => emp.Employee_ID !== currentEmployeeId) // Filter out the current user from approval list
                            .map((emp) => (
                                <option key={emp.Employee_ID} value={emp.Employee_ID}>
                                    {emp.Name}
                                </option>
                            ))
                    )}
                </select>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 mt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 bg-gray-300 text-slate-700 rounded-xl hover:bg-gray-400 transition-colors shadow-md font-medium"
                >
                    ຍົກເລີກ
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium flex items-center space-x-2"
                >
                    <span>ບັນທຶກການລາ</span>
                </button>
            </div>
        </form>
    );
}