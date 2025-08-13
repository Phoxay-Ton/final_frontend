// src/components/ManageTaskEditModal.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from "react";

// ✅ อัปเดต interface ให้ตรงกับ API
interface EditTaskPayload {
    Task_ID: number;
    task_name: string;
    description: string;
    attachment: string;
    employee_id: number;
    division_id: number;
    start_date: string;
    end_date: string;
    status: string;
}

// ✅ Interface สำหรับข้อมูลไฟล์
interface TaskData {
    Task_ID?: number;
    task_id?: number;
    Task_name?: string;
    task_name?: string;
    Description?: string;
    description?: string;
    Attachment?: string;
    attachment?: string;
    attachment_original_name?: string; // ชื่อไฟล์เดิมที่ผู้ใช้เห็น
    attachment_file_name?: string;     // ชื่อไฟล์จริงในเซิร์ฟเวอร์
    Employee_ID?: number;
    employee_id?: number;
    Division_ID?: number;
    division_id?: number;
    Start_Date?: string;
    start_date?: string;
    End_Date?: string;
    end_date?: string;
    Status?: string;
    status?: string;
}

interface Employee {
    Employee_ID: number;
    Name: string;
}

interface Division {
    Division_ID: number;
    Division_Name: string;
}

// ✅ Interface สำหรับ Modal Props - เพิ่ม file parameter
interface ManageTaskEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: TaskData; // Updated to use TaskData interface
    onSave: (taskData: EditTaskPayload, file: File | null) => Promise<boolean>;
    showNotification: (title: string, message: string) => void;
}

export default function ManageTaskEditModal({
    isOpen,
    onClose,
    initialData,
    onSave,
    showNotification
}: ManageTaskEditModalProps) {

    // ✅ State for form data - แยก attachment ออกมาเป็น File object
    const [formData, setFormData] = useState<Omit<EditTaskPayload, 'attachment'> & {
        attachment: File | null;
        existingAttachment: string;
        attachmentOriginalName: string;
        attachmentFileName: string;
    }>({
        Task_ID: initialData?.Task_ID || 0,
        task_name: '',
        description: '',
        existingAttachment: '',
        attachmentOriginalName: '',
        attachmentFileName: '',
        attachment: null,
        employee_id: 0,
        division_id: 0,
        start_date: '',
        end_date: '',
        status: 'ກຳລັງດຳເນີນການ'
    });

    // ✅ States for dropdowns and file handling
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loadingDivisions, setLoadingDivisions] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ File input ref
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ✅ Initialize form data when modal opens
    useEffect(() => {
        if (isOpen && initialData) {
            // Map your existing data structure to the form structure
            setFormData({
                Task_ID: initialData.Task_ID || initialData.task_id || 0,
                task_name: initialData.Task_name || initialData.task_name || '',
                description: initialData.Description || initialData.description || '',
                existingAttachment: initialData.Attachment || initialData.attachment || '',
                attachmentOriginalName: initialData.attachment_original_name || initialData.Attachment || initialData.attachment || '',
                attachmentFileName: initialData.attachment_file_name || initialData.Attachment || initialData.attachment || '',
                attachment: null, // Reset file input
                employee_id: initialData.Employee_ID || initialData.employee_id || 0,
                division_id: initialData.Division_ID || initialData.division_id || 0,
                start_date: initialData.Start_Date || initialData.start_date || '',
                end_date: initialData.End_Date || initialData.end_date || '',
                status: initialData.Status || initialData.status || 'ກຳລັງດຳເນີນການ'
            });

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [isOpen, initialData]);

    // ✅ Fetch divisions
    const fetchDivisions = useCallback(async () => {
        setLoadingDivisions(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການກວດສອບສິດ");
                return;
            }

            const response = await fetch('http://localhost:8080/api/v1/division', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const responseText = await response.text();
            const data = JSON.parse(responseText);

            let divisionData = [];
            if (data.data && Array.isArray(data.data)) {
                divisionData = data.data;
            } else if (Array.isArray(data)) {
                divisionData = data;
            }

            setDivisions(divisionData);

        } catch (error: any) {
            console.error("Failed to fetch divisions:", error);
            showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂະແໜງໄດ້");
            setDivisions([]);
        } finally {
            setLoadingDivisions(false);
        }
    }, [showNotification]);

    // ✅ Fetch employees by division
    const fetchEmployeesByDivision = useCallback(async (divisionId: number) => {
        if (divisionId === 0) {
            setEmployees([]);
            return;
        }

        setLoadingEmployees(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການກວດສອບສິດ");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/v1/Task/all-division-employee/${divisionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const responseText = await response.text();
            const data = JSON.parse(responseText);

            let employeeData = [];
            if (data.data && Array.isArray(data.data)) {
                employeeData = data.data;
            } else if (Array.isArray(data)) {
                employeeData = data;
            }

            setEmployees(employeeData);

        } catch (error: any) {
            console.error("Failed to fetch employees:", error);
            showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດພະນັກງານໄດ້");
            setEmployees([]);
        } finally {
            setLoadingEmployees(false);
        }
    }, [showNotification]);

    // ✅ Load data when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchDivisions();

            // If we have initial division, load employees
            const initialDivisionId = initialData?.Division_ID || initialData?.division_id;
            if (initialDivisionId) {
                fetchEmployeesByDivision(initialDivisionId);
            }
        }
    }, [isOpen, fetchDivisions, fetchEmployeesByDivision, initialData]);

    // ✅ Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'division_id') {
            const divisionId = parseInt(value, 10) || 0;
            setFormData(prev => ({
                ...prev,
                division_id: divisionId,
                employee_id: 0 // Reset employee when division changes
            }));

            fetchEmployeesByDivision(divisionId);
        } else if (name === 'employee_id') {
            setFormData(prev => ({
                ...prev,
                employee_id: parseInt(value, 10) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // ✅ Handle file change - updated to match AddManageTaskForm logic
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        console.log("[DEBUG] Selected file:", file);

        if (file) {
            const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
            const ext = '.' + file.name.split('.').pop()?.toLowerCase();

            if (file.size > 50 * 1024 * 1024) { // Changed to 50MB to match AddManageTaskForm
                showNotification("ໄຟລ໌ໃຫຍ່ເກີນໄປ", "ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 50MB.");
                if (fileInputRef.current) fileInputRef.current.value = '';
                setFormData(prev => ({ ...prev, attachment: null }));
                console.log("[DEBUG] File too large, attachment set to null");
                return;
            }

            if (!allowedTypes.includes(ext)) {
                showNotification("ໄຟລ໌ບໍ່ຖືກຕ້ອງ", "ກະລຸນາເລືອກໄຟລ໌ ");
                if (fileInputRef.current) fileInputRef.current.value = '';
                setFormData(prev => ({ ...prev, attachment: null }));
                console.log("[DEBUG] File type not allowed, attachment set to null");
                return;
            }

            setFormData(prev => ({ ...prev, attachment: file }));
            console.log("[DEBUG] File accepted, attachment updated:", file.name);
        } else {
            // กรณียกเลิกเลือกไฟล์
            setFormData(prev => ({ ...prev, attachment: null }));
            if (fileInputRef.current) fileInputRef.current.value = '';
            console.log("[DEBUG] No file selected, attachment set to null");
        }
    }, [showNotification]);

    // ✅ Remove existing attachment
    const handleRemoveExistingAttachment = () => {
        setFormData(prev => ({
            ...prev,
            existingAttachment: '',
            attachmentOriginalName: '',
            attachmentFileName: ''
        }));
    };

    // ✅ Handle form submission
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        // ✅ Validate form
        if (!formData.task_name.trim()) {
            showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາໃສ່ຊື່ວຽກ");
            return;
        }
        if (!formData.description.trim()) {
            showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາໃສ່ລາຍລະອຽດ");
            return;
        }
        if (!formData.start_date) {
            showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກວັນເລີ່ມ");
            return;
        }
        if (!formData.end_date) {
            showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກວັນສິ້ນສຸດ");
            return;
        }
        if (formData.division_id === 0) {
            showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກຂະແໜງ");
            return;
        }
        if (formData.employee_id === 0) {
            showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກພະນັກງານ");
            return;
        }

        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            showNotification("ວັນຜິດພາດ", "ວັນເລີ່ມຕ້ອງບໍ່ເກົ່າກວ່າວັນສິ້ນສຸດ");
            return;
        }

        // Validate employee exists
        if (!employees.find(e => e.Employee_ID === formData.employee_id)) {
            showNotification("ຜິດພາດ", "ພະນັກງານບໍ່ຖືກຕ້ອງ");
            return;
        }

        setIsSubmitting(true);
        try {
            // ✅ Create payload - use new file name if uploaded, otherwise keep existing
            const attachmentName = formData.attachment?.name || formData.attachmentOriginalName || formData.existingAttachment;

            const payload: EditTaskPayload = {
                Task_ID: formData.Task_ID,
                task_name: formData.task_name.trim(),
                description: formData.description.trim(),
                attachment: attachmentName,
                start_date: formData.start_date,
                end_date: formData.end_date,
                division_id: formData.division_id,
                employee_id: formData.employee_id,
                status: formData.status
            };

            console.log("🧪 Updating task with payload:", payload);
            console.log("🧪 File to upload:", formData.attachment);

            const success = await onSave(payload, formData.attachment);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Error saving task:", error);
            showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto font-saysettha text-slate-800">
                <h2 className="text-xl font-bold mb-4 text-center">ແກ້ໄຂຂໍ້ມູນວຽກ</h2>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium">ຊື່ວຽກ </label>
                            <input
                                type="text"
                                name="task_name"
                                value={formData.task_name}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ຊື່ວຽກ"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">ວັນເລີ່ມ </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">ວັນສິ້ນສຸດ </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">ລາຍລະອຽດ </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                rows={4}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="ລາຍລະອຽດວຽກ"
                                required
                            />
                        </div>

                        {/* ✅ Updated File Upload Section to match AddManageTaskForm */}
                        <div>
                            <label className="block mb-1">ໄຟລ໌ແນບ</label>

                            {/* Show existing attachment as a clickable link (always use only the real server filename in href) */}
                            {formData.attachmentFileName && (
                                <div className="mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                            <span className="text-blue-600">📎</span>
                                            <span className="text-sm text-gray-600">ໄຟລ໌ເດີມ</span>
                                            <a
                                                href={`http://localhost:8080/uploads/${encodeURIComponent(formData.attachmentFileName)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm font-medium truncate"
                                                title={formData.attachmentOriginalName || formData.attachmentFileName}
                                            >
                                                {formData.attachmentOriginalName || formData.attachmentFileName}
                                            </a>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveExistingAttachment}
                                            disabled={isSubmitting}
                                            className="text-red-500 hover:text-red-700 text-sm ml-2 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                            title="ລຶບໄຟລ໌"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* File upload button - Updated to match AddManageTaskForm style */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSubmitting}
                                className="w-full p-3 border rounded-xl bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                            >
                                {formData.attachment?.name || ((formData.attachmentFileName || formData.existingAttachment) ? "ເລືອກໄຟລ໌ໃໝ່" : "ເລືອກໄຟລ໌")}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {/* Show new file selected */}
                            {formData.attachment && (
                                <p className="text-sm text-green-600 mt-1">
                                    ✓ ເລືອກໄຟລ໌ໃໝ່: {formData.attachment.name}
                                </p>
                            )}

                            {/* File size limit info */}
                            <p className="text-xs text-gray-500 mt-1">

                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium">ຂະແໜງ </label>
                            {loadingDivisions ? (
                                <select disabled className="w-full p-3 border rounded-xl bg-gray-100">
                                    <option>ກຳລັງໂຫຼດ...</option>
                                </select>
                            ) : (
                                <select
                                    name="division_id"
                                    value={formData.division_id}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value={0}> ເລືອກຂະແໜງ</option>
                                    {divisions.map(division => (
                                        <option key={division.Division_ID} value={division.Division_ID}>
                                            {division.Division_Name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {!loadingDivisions && divisions.length === 0 && (
                                <p className="text-sm text-red-500 mt-1">ບໍ່ສາມາດໂຫຼດຂະແໜງໄດ້</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">ພະນັກງານ </label>
                            {loadingEmployees ? (
                                <select disabled className="w-full p-3 border rounded-xl bg-gray-100">
                                    <option>ກຳລັງໂຫຼດ...</option>
                                </select>
                            ) : (
                                <select
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    disabled={isSubmitting || formData.division_id === 0}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value={0}>
                                        {formData.division_id === 0 ? "ເລືອກຂະແໜງກ່ອນ" : "-- ເລືອກພະນັກງານ --"}
                                    </option>
                                    {employees.map(employee => (
                                        <option key={employee.Employee_ID} value={employee.Employee_ID}>
                                            {employee.Name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {!loadingEmployees && formData.division_id > 0 && employees.length === 0 && (
                                <p className="text-sm text-red-500 mt-1">ບໍ່ມີພະນັກງານໃນຂະແໜງນີ້</p>
                            )}
                        </div>

                        {/* <div>
                            <label className="block mb-1 font-medium">ສະຖານະ</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ກຳລັງດຳເນີນການ">ກຳລັງດຳເນີນການ</option>
                                <option value="ສຳເລັດແລ້ວ">ສຳເລັດແລ້ວ</option>
                                <option value="ຍົກເລີກ">ຍົກເລີກ</option>
                            </select>
                        </div> */}
                    </div>

                    {/* Action Buttons */}
                    <div className="lg:col-span-2 flex justify-end space-x-4 mt-8 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors disabled:opacity-50"
                        >
                            ຍົກເລີກ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}