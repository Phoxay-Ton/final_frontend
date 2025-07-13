// src/components/AddDivisionForm.tsx
import React, { useState, useEffect } from 'react';
import { Department, AddDivisionPayload } from '@/src/types/division';

interface AddDivisionFormProps {
    onSave: (newDivision: AddDivisionPayload) => void;
    onCancel: () => void;
    initialData?: Partial<AddDivisionPayload>;
    departments: Department[];
}

const AddDivisionForm: React.FC<AddDivisionFormProps> = ({
    onSave,
    onCancel,
    initialData
}) => {
    // Initialize state to match AddDivisionPayload structure
    const [newDivision, setNewDivision] = useState<AddDivisionPayload>({
        Division_Name: initialData?.Division_Name || '',
        Phone: initialData?.Phone || '',
        Email: initialData?.Email || '',
        Department_ID: initialData?.Department_ID || 0,
        Contact_Person: initialData?.Contact_Person || '',
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [errorDepartments, setErrorDepartments] = useState<string | null>(null);

    // Fetch departments on component mount
    // useEffect(() => {
    //     async function fetchDepartments() {
    //         try {
    //             const token = localStorage.getItem("token");
    //             if (!token) {
    //                 throw new Error('No authentication token found');
    //             }

    //             const response = await fetch('http://localhost:8080/api/v1/department', {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                 },
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch departments');
    //             }

    //             const data = await response.json();
    //             setDepartments(data);

    //             // If initialData.department_ID is set, ensure it's a valid ID from fetched departments
    //             if (initialData?.Department_ID && data.some((dep: Department) => dep.Department_ID === initialData.Department_ID)) {
    //                 setNewDivision(prev => ({
    //                     ...prev,
    //                     department_ID: initialData.Department_ID as number
    //                 }));
    //             }

    //         } catch (err: any) {
    //             console.error("Failed to fetch departments:", err);
    //             setErrorDepartments(err.message);
    //         } finally {
    //             setLoadingDepartments(false);
    //         }
    //     }

    //     fetchDepartments();
    // }, [initialData?.Department_ID]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewDivision(prev => ({
            ...prev,
            [name]: name === "Department_ID" ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(newDivision);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="division_name" className="block text-lg font-medium text-gray-700 mb-2">
                    ຊື່ຂະແໜງ
                </label>
                <input
                    type="text"
                    id="division_name"
                    name="division_name"
                    value={newDivision.Division_Name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນຊື່ຂະແໜງ"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                    ອີເມວ
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={newDivision.Email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນອີເມວ"
                    required
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
                    ເບີໂທ
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={newDivision.Phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນເບີໂທ"
                    required
                />
            </div>

            <div>
                <label className="block text-md font-medium text-gray-700 mb-1">ພະແນກ</label>
                <select
                    name="Department_ID"
                    value={newDivision.Department_ID}
                    onChange={handleChange}
                    className="..."
                    required
                >
                    <option value={0} disabled>ເລືອກພະແນກ</option>
                    {departments.map(dep => (
                        <option key={dep.Department_ID} value={dep.Department_ID}>
                            {dep.Department_Name}
                        </option>
                    ))}
                </select>

            </div>

            <div className="flex space-x-4 mt-6">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md font-medium text-lg"
                    disabled={loadingDepartments}
                >
                    ບັນທຶກ
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors duration-200 shadow-md font-medium text-lg"
                >
                    ຍົກເລີກ
                </button>
            </div>
        </form>
    );
};

export default AddDivisionForm;