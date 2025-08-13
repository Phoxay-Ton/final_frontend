import React, { useState, useEffect } from "react";
import { AddLeave, Employee, LeaveType } from "@/src/types/leave";

interface AddLeaveFormProps {
    onSubmit: (newLeaveData: AddLeave) => void;
    onCancel: () => void;
    employees: Employee[];
    leaveTypes: LeaveType[];
    loadingData: boolean;
    errorData: string | null;
    currentEmployeeId: number;
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
    const [newLeave, setNewLeave] = useState<AddLeave>({
        Leave_type_ID: 0,
        From_date: "",
        To_date: "",
        Leave_days: 0,
        Description: "",
        Approval_person: 0,
    });

    // Get current user's role from localStorage
    const getCurrentUserRole = () => {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        return user?.role || "";
    };

    // Define approval options based on role hierarchy
    const getApprovalOptions = () => {
        const currentRole = getCurrentUserRole().toLowerCase();

        // Get available approval roles based on current user's role
        const availableRoles = [];

        // For regular employees - can request approval from Admin or Super_Admin
        if (!["admin", "super_admin"].includes(currentRole)) {
            // Check if we have Admin employees
            const hasAdmin = employees.some(emp =>
                emp.Role && emp.Role.toLowerCase() === "admin" && emp.Employee_ID !== currentEmployeeId
            );
            if (hasAdmin) {
                availableRoles.push({ value: "admin", label: "ຫົວໜ້າຂະແໜງ" });
            }

            // Check if we have Super_Admin employees
            const hasSuperAdmin = employees.some(emp =>
                emp.Role && emp.Role.toLowerCase() === "super_admin" && emp.Employee_ID !== currentEmployeeId
            );
            if (hasSuperAdmin) {
                availableRoles.push({ value: "super_admin", label: "ຫົວໜ້າພະແນກ" });
            }
        }
        // For Admin - can only request approval from Super_Admin
        else if (currentRole === "admin") {
            const hasSuperAdmin = employees.some(emp =>
                emp.Role && emp.Role.toLowerCase() === "super_admin" && emp.Employee_ID !== currentEmployeeId
            );
            if (hasSuperAdmin) {
                availableRoles.push({ value: "super_admin", label: "ຫົວໜ້າພະແນກ" });
            }
        }
        // For Super_Admin - can select other Super_Admin
        else if (currentRole === "super_admin") {
            const hasOtherSuperAdmin = employees.some(emp =>
                emp.Role && emp.Role.toLowerCase() === "super_admin" && emp.Employee_ID !== currentEmployeeId
            );
            if (hasOtherSuperAdmin) {
                availableRoles.push({ value: "super_admin", label: "ຫົວໜ້າພະແນກ" });
            }
        }

        return availableRoles;
    };

    useEffect(() => {
        setNewLeave(prev => ({
            ...prev,
            employeeId: currentEmployeeId, // Add this field for backend
            Leave_type_ID: 0,
            From_date: "",
            To_date: "",
            Leave_days: 0,
            Description: "",
            Approval_person: 0,
        }));
    }, [currentEmployeeId, employees, leaveTypes]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setNewLeave((prev) => {
            let updatedValue: string | number = value;

            if (
                name === "Leave_type_ID" ||
                name === "Leave_days"
            ) {
                updatedValue = parseInt(value, 10) || 0;
            }

            // Handle Approval_person specially - convert role to employee ID
            if (name === "Approval_person" && value !== "0") {
                // Find first employee with the selected role
                const selectedEmployee = employees.find(emp =>
                    emp.Role && emp.Role.toLowerCase() === value && emp.Employee_ID !== currentEmployeeId
                );
                updatedValue = selectedEmployee ? selectedEmployee.Employee_ID : 0;
            } else if (name === "Approval_person") {
                updatedValue = parseInt(value, 10) || 0;
            }

            const updatedLeaveData = { ...prev, [name]: updatedValue };

            if (name === "From_date" || name === "To_date") {
                const from = new Date(updatedLeaveData.From_date);
                const to = new Date(updatedLeaveData.To_date);

                if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && from <= to) {
                    const diffTime = Math.abs(to.getTime() - from.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    updatedLeaveData.Leave_days = diffDays + 1;
                } else {
                    updatedLeaveData.Leave_days = 0;
                }
            }

            return updatedLeaveData;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data for backend with proper field names
        const submitData = {
            Employee_ID: currentEmployeeId, // Use Employee_ID instead of employeeId
            Leave_type_ID: newLeave.Leave_type_ID,
            From_date: newLeave.From_date,
            To_date: newLeave.To_date,
            Leave_days: newLeave.Leave_days,
            Description: newLeave.Description,
            Approval_person: newLeave.Approval_person,
        };

        console.log("📤 Final data being submitted:", submitData);
        onSubmit(submitData);
    };

    const currentEmployee = employees.find(emp => emp.Employee_ID === currentEmployeeId);
    const currentEmployeeName = currentEmployee ? currentEmployee.Name : "ກຳລັງໂຫຼດ...";
    const approvalRoles = getApprovalOptions();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden input for employeeId */}
            <input
                type="hidden"
                name="employeeId"
                value={currentEmployeeId}
            />

            {/* Leave Type selection dropdown */}
            <div>
                <label htmlFor="leaveTypeId" className="block text-md font-medium text-gray-700 mb-1">
                    ປະເພດການພັກ
                </label>
                <select
                    id="Leave_type_ID"
                    name="Leave_type_ID"
                    value={newLeave.Leave_type_ID}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value={0}>ເລືອກປະເພດການພັກ</option>
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
                        name="From_date"
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
                        name="To_date"
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
                    id="Leave_days"
                    name="Leave_days"
                    value={newLeave.Leave_days}
                    onChange={handleChange}
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
                    name="Description"
                    value={newLeave.Description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ປ້ອນລາຍລະອຽດການລາພັກ..."
                    required
                ></textarea>
            </div>

            {/* Approval Person selection dropdown - Show only role titles */}
            <div>
                <label htmlFor="approvalPerson" className="block text-md font-medium text-gray-700 mb-1">
                    ຜູ້ອະນຸມັດ
                </label>
                <select
                    id="Approval_person"
                    name="Approval_person"
                    value={(() => {
                        // Convert current Employee_ID back to role for display
                        if (newLeave.Approval_person === 0) return "0";
                        const approver = employees.find(emp => emp.Employee_ID === newLeave.Approval_person);
                        return approver?.Role?.toLowerCase() || "0";
                    })()}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="0">ເລືອກຜູ້ອະນຸມັດ</option>
                    {loadingData ? (
                        <option disabled>ກຳລັງໂຫຼດ...</option>
                    ) : errorData ? (
                        <option disabled>{errorData}</option>
                    ) : (
                        approvalRoles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))
                    )}
                </select>

                {/* Show current user role info */}
                {/* <div className="mt-2 text-sm text-gray-600">
                    <div>
                        <span>ຕຳແໜ່ງປັດຈຸບັນ: </span>
                        <span className="font-medium">
                            {(() => {
                                const role = getCurrentUserRole().toLowerCase();
                                switch (role) {
                                    case 'super_admin': return 'ຫົວໜ້າພະແນກ';
                                    case 'admin': return 'ຫົວໜ້າຂະແໜງ';
                                    default: return 'ພະນັກງານ';
                                }
                            })()}
                        </span>
                    </div>
                    {approvalRoles.length === 0 && !loadingData && (
                        <div className="text-orange-600 mt-1">
                            ບໍ່ມີຫົວໜ້າທີ່ສາມາດອະນຸມັດໄດ້
                        </div>
                    )}
                </div> */}
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