// src/components/forms/AddManageTaskForm.tsx
'use client';

import React, {
    useState, useEffect, useCallback, useRef, ChangeEvent, memo
} from "react";

// ✅ Interface รวมทุกอย่างที่ต้องใช้และ export
export interface AddManageTaskPayload {
    task_name: string;
    description: string;
    attachment: string; // เป็นชื่อไฟล์ (string)
    employee_id: number;
    division_id: number;
    start_date: string;
    end_date: string;
    status: string;
}

export interface Employee {
    Employee_ID: number;
    Name: string;
}

export interface Division {
    Division_ID: number;
    Division_Name: string;
}

// ✅ รวม Props ที่ต้องใช้ทั้งหมดใน Form Component
export interface AddManageTaskFormProps {
    onSave: (formData: FormData) => Promise<boolean>;
    onCancel: () => void;
    showNotification: (title: string, message: string) => void;
}

// 🟢 Component
const AddManageTaskForm = memo(({
    onSave,
    onCancel,
    showNotification
}: AddManageTaskFormProps) => {

    // State รวมข้อมูลฟอร์ม (attachment เป็น File | null)
    const [task, setTask] = useState<Omit<AddManageTaskPayload, 'attachment'> & { attachment: File | null }>({
        task_name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'ກຳລັງດຳເນີນການ',
        division_id: 0,
        employee_id: 0,
        attachment: null
    });

    const [divisions, setDivisions] = useState<Division[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loadingDivisions, setLoadingDivisions] = useState(true);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ดึง divisions จาก API
    const fetchDivisions = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການກວດສອບສິດ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                return;
            }

            const response = await fetch('http://localhost:8080/api/v1/division', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const text = await response.text();
            const data = JSON.parse(text);

            let divisionData: Division[] = [];
            if (data.data && Array.isArray(data.data)) {
                divisionData = data.data;
            } else if (Array.isArray(data)) {
                divisionData = data;
            }

            setDivisions(divisionData);
        } catch (error: any) {
            console.error("Failed to fetch divisions:", error);
            setDivisions([]);
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດໂຫຼດຂະແໜງໄດ້: ${error.message}`);
        } finally {
            setLoadingDivisions(false);
        }
    }, [showNotification]);

    // ดึง employees ตาม division id
    const fetchEmployeesByDivision = useCallback(async (divisionId: number) => {
        if (divisionId === 0) {
            setEmployees([]);
            return;
        }

        setLoadingEmployees(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການກວດສອບສິດ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                return;
            }

            const apiUrl = `http://localhost:8080/api/v1/Task/all-division-employee/${divisionId}`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const text = await response.text();
            const data = JSON.parse(text);

            let employeeData: Employee[] = [];
            if (data.data && Array.isArray(data.data)) {
                employeeData = data.data;
            } else if (Array.isArray(data)) {
                employeeData = data;
            }

            setEmployees(employeeData);

        } catch (error: any) {
            console.error("Failed to fetch employees:", error);
            setEmployees([]);
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດໂຫຼດພະນັກງານໄດ້: ${error.message}`);
        } finally {
            setLoadingEmployees(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchDivisions();
    }, [fetchDivisions]);

    useEffect(() => {
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    // อัปเดตข้อมูลฟอร์มเมื่อ input เปลี่ยน
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'division_id') {
            const divisionId = parseInt(value, 10) || 0;

            setTask(prev => ({
                ...prev,
                division_id: divisionId,
                employee_id: 0 // reset employee_id เวลาข้าม division
            }));

            if (divisionId > 0) {
                fetchEmployeesByDivision(divisionId);
            } else {
                setEmployees([]);
            }
        } else if (name === 'employee_id') {
            setTask(prev => ({
                ...prev,
                employee_id: parseInt(value, 10) || 0
            }));
        } else {
            setTask(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }, [fetchEmployeesByDivision]);

    // เลือกไฟล์แนบ
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        console.log("[DEBUG] Selected file:", file);

        if (file) {
            const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
            const ext = '.' + file.name.split('.').pop()?.toLowerCase();

            if (file.size > 50 * 1024 * 1024) {
                showNotification("ໄຟລ໌ໃຫຍ່ເກີນໄປ", "ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 50MB.");
                if (fileInputRef.current) fileInputRef.current.value = '';
                setTask(prev => ({ ...prev, attachment: null }));
                console.log("[DEBUG] File too large, attachment set to null");
                return;
            }

            if (!allowedTypes.includes(ext)) {
                showNotification("ໄຟລ໌ບໍ່ຖືກຕ້ອງ", "ກະລຸນາເລືອກໄຟລ໌ PDF/DOC/DOCX/TXT.");
                if (fileInputRef.current) fileInputRef.current.value = '';
                setTask(prev => ({ ...prev, attachment: null }));
                console.log("[DEBUG] File type not allowed, attachment set to null");
                return;
            }

            setTask(prev => ({ ...prev, attachment: file }));
            console.log("[DEBUG] File accepted, attachment updated:", file.name);
        } else {
            // กรณียกเลิกเลือกไฟล์
            setTask(prev => ({ ...prev, attachment: null }));
            if (fileInputRef.current) fileInputRef.current.value = '';
            console.log("[==============DEBUG] No file selected, attachment set to null");
        }
    }, [showNotification]);


    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const {
                task_name,
                description,
                start_date,
                end_date,
                division_id,
                employee_id,
                attachment
            } = task;

            // Validate
            if (!task_name.trim()) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາໃສ່ຊື່ວຽກ");
                setIsSubmitting(false);
                return;
            }
            if (!description.trim()) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາໃສ່ລາຍລະອຽດວຽກ");
                setIsSubmitting(false);
                return;
            }
            if (!start_date) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກວັນເລີ່ມຕົ້ນ");
                setIsSubmitting(false);
                return;
            }
            if (!end_date) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກວັນສິ້ນສຸດ");
                setIsSubmitting(false);
                return;
            }
            if (division_id === 0) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກຂະແໜງ");
                setIsSubmitting(false);
                return;
            }
            if (employee_id === 0) {
                showNotification("ຂໍ້ມູນບໍ່ຄົບ", "ກະລຸນາເລືອກພະນັກງານ");
                setIsSubmitting(false);
                return;
            }
            if (new Date(start_date) > new Date(end_date)) {
                showNotification("ວັນຜິດພາດ", "ວັນເລີ່ມຕ້ອງບໍ່ເກົ່າກວ່າວັນສິ້ນສຸດ");
                setIsSubmitting(false);
                return;
            }
            if (!employees.find(e => e.Employee_ID === employee_id)) {
                showNotification("ຜິດພາດ", "ພະນັກງານບໍ່ຖືກຕ້ອງ");
                setIsSubmitting(false);
                return;
            }

            // สร้าง FormData สำหรับ multipart/form-data
            const formData = new FormData();
            formData.append('task_name', task_name.trim());
            formData.append('description', description.trim());
            formData.append('start_date', start_date);
            formData.append('end_date', end_date);
            formData.append('division_id', String(division_id));
            formData.append('employee_id', String(employee_id));
            formData.append('status', task.status);
            if (attachment) {
                formData.append('attachment', attachment);
            }

            // ส่ง formData ไปที่ onSave (เปลี่ยน signature ให้รับ FormData)
            const success = await onSave(formData);
            if (success) {
                setTask({
                    task_name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    status: 'ກຳລັງດຳເນີນການ',
                    division_id: 0,
                    employee_id: 0,
                    attachment: null
                });
                setEmployees([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error("Form submission error:", err);
            showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດ");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <h2 className="text-2xl font-bold text-slate-800 font-saysettha mb-6 sticky top-0 bg-white/90 backdrop-blur-lg z-10 py-4 border-b border-sky-200 -mt-6 -mx-6 px-6">
                ເພີ່ມວຽກໃໝ່
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">

                {/* Left Column */}
                <div className="space-y-5">
                    <InputField
                        label="ຊື່ວຽກ *"
                        name="task_name"
                        value={task.task_name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                    <InputDate
                        label="ວັນທີເລີ່ມ *"
                        name="start_date"
                        value={task.start_date}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                    <InputDate
                        label="ວັນທີສິ້ນສຸດ *"
                        name="end_date"
                        value={task.end_date}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">ລາຍລະອຽດ *</label>
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            rows={4}
                            disabled={isSubmitting}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="ໃສ່ລາຍລະອຽດວຽກ..."
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">ໄຟລ໌ແນບ</label>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting}
                            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-left hover:bg-gray-100 transition-colors shadow-sm text-slate-800"
                        >
                            {task.attachment?.name || "ເລືອກໄຟລ໌ "}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {task.attachment && (
                            <p className="text-sm text-green-600 mt-1">
                                ✓ ເລືອກໄຟລ໌: {task.attachment.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    <SelectField
                        label="ຂະແໜງ *"
                        name="division_id"
                        value={task.division_id}
                        onChange={handleChange}
                        options={[
                            { id: 0, name: "ເລືອກຂະແໜງ " },
                            ...divisions.map(d => ({ id: d.Division_ID, name: d.Division_Name }))
                        ]}
                        disabled={isSubmitting}
                        loading={loadingDivisions}
                        error={loadingDivisions ? null : (divisions.length === 0 ? "ບໍ່ສາມາດໂຫຼດຂະແໜງໄດ້" : null)}
                    />
                    <SelectField
                        label="ພະນັກງານ *"
                        name="employee_id"
                        value={task.employee_id}
                        onChange={handleChange}
                        options={[
                            {
                                id: 0,
                                name: task.division_id === 0 ? "ເລືອກຂະແໜງກ່ອນ" : " ເລືອກພະນັກງານ "
                            },
                            ...employees.map(e => ({ id: e.Employee_ID, name: e.Name }))
                        ]}
                        disabled={loadingEmployees || isSubmitting || task.division_id === 0}
                        loading={loadingEmployees}
                        error={!loadingEmployees && task.division_id > 0 && employees.length === 0 ? "ບໍ່ມີພະນັກງານໃນຂະແໜງນີ້" : null}
                    />
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-2 flex justify-end space-x-4 mt-8 sticky bottom-0 bg-white/90 backdrop-blur-lg z-10 py-4 border-t border-sky-200 -mb-6 -mx-6 px-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className={`flex-1 px-6 py-3 rounded-xl transition-colors duration-200 shadow-md font-medium text-lg ${isSubmitting
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-300 text-slate-700 hover:bg-gray-400'
                            }`}
                    >
                        ຍົກເລີກ
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 px-6 py-3 rounded-xl transition-colors duration-200 shadow-md font-medium text-lg ${isSubmitting
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                    </button>
                </div>
            </form>
        </div>
    );
});

AddManageTaskForm.displayName = "AddManageTaskForm";

export default AddManageTaskForm;

// ----------------------------
// ** Component ช่วยสร้าง Input (แยกส่วน) **
// ----------------------------
interface InputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}
const InputField = ({ label, name, value, onChange, disabled }: InputFieldProps) => (
    <div>
        <label className="block mb-1 text-sm font-medium text-slate-700">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
    </div>
);

interface InputDateProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}
const InputDate = ({ label, name, value, onChange, disabled }: InputDateProps) => (
    <div>
        <label className="block mb-1 text-sm font-medium text-slate-700">{label}</label>
        <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { id: number; name: string }[];
    disabled?: boolean;
    loading?: boolean;
    error?: string | null;
}
const SelectField = ({ label, name, value, onChange, options, disabled, loading, error }: SelectFieldProps) => (
    <div>
        <label className="block mb-1 text-sm font-medium text-slate-700">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-3 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
            {loading ? (
                <option value="">ກຳລັງໂຫຼດ...</option>
            ) : (
                options.map(o => (
                    <option key={o.id} value={o.id}>
                        {o.name}
                    </option>
                ))
            )}
        </select>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
);